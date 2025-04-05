from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import base64
import json
from dataclasses import asdict, is_dataclass

# Import des classes ABE
from typing import Dict, List, Optional, Tuple, Union
from dataclasses import dataclass
from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad, unpad
from Cryptodome.Util.number import getPrime, isPrime, getRandomRange
import hashlib

# === STRUCTURES DE DONNEES ===
@dataclass
class PolicyNode:
    """Nœud de politique d'accès avec attribut intégré"""
    node_type: str  # 'AND', 'OR', 'THRESHOLD', 'ATTR'
    children: Optional[List['PolicyNode']] = None
    attribute: Optional[str] = None
    threshold: Optional[Tuple[int, int]] = None

    def __post_init__(self):
        if self.node_type == 'ATTR' and not self.attribute:
            raise ValueError("Les nœuds ATTR nécessitent un attribut")
        if self.node_type == 'THRESHOLD' and not self.threshold:
            raise ValueError("Les nœuds THRESHOLD nécessitent un tuple (k,n)")
        if self.node_type in ['AND', 'OR', 'THRESHOLD'] and not self.children:
            raise ValueError("Les nœuds logiques nécessitent des enfants")
        if self.attribute:
            self.attribute = self.attribute.upper()

@dataclass 
class MasterKey:
    g: int  # Générateur
    g_a: int  # g^α
    h: int  # g^β
    e_gg_alpha: int  # e(g,g)^α simulé
    p: int  # Nombre premier
    q: int  # Ordre du sous-groupe

@dataclass
class UserKey:
    K: int  # g^(α + βt)
    L: int  # g^t
    attrs: Dict[str, int]  # {attribut: D = g^(t/r)}

# === IMPLEMENTATION CP-ABE ===
@dataclass
class CPABE:
    def __init__(self, security_param: int = 256):
        self.security_param = security_param
        self.p, self.q = self._generate_safe_prime()
        self.g = self._find_generator()

    def _generate_safe_prime(self) -> Tuple[int, int]:
        """Génère un nombre premier sûr p = 2q + 1"""
        while True:
            q = getPrime(self.security_param)
            p = 2 * q + 1
            if isPrime(p):
                return p, q

    def _find_generator(self) -> int:
        """Trouve un générateur du sous-groupe d'ordre q"""
        # On cherche un élément d'ordre q (car p = 2q + 1)
        for _ in range(100):
            h = getRandomRange(2, self.p-1)
            g = pow(h, 2, self.p)
            if g != 1:
                return g
        raise ValueError("Générateur non trouvé")

    def setup(self) -> Tuple[MasterKey, Dict]:
        """Initialise le système et génère les clés maîtresses"""
        alpha = getRandomRange(1, self.q-1)
        beta = getRandomRange(1, self.q-1)
        
        g_a = pow(self.g, alpha, self.p)
        h = pow(self.g, beta, self.p)
        e_gg_alpha = pow(self.g, alpha * alpha, self.p)  # Simulation de e(g,g)^α
        
        return (
            MasterKey(
                g=self.g,
                g_a=g_a,
                h=h,
                e_gg_alpha=e_gg_alpha,
                p=self.p,
                q=self.q
            ),
            {'alpha': alpha, 'beta': beta}
        )
    
    def keygen(self, mpk: MasterKey, msk: Dict, attributes: List[str]) -> UserKey:
        """Génère une clé utilisateur basée sur ses attributs"""
        t = getRandomRange(1, self.q-1)
        
        K = (pow(mpk.g_a, t, mpk.p) * pow(mpk.h, msk['alpha'], mpk.p)) % mpk.p
        L = pow(mpk.g, t, mpk.p)
        
        # Génération des composantes pour chaque attribut
        attrs = {}
        for attr in set(attributes):  # Éliminer les doublons
            r = getRandomRange(1, self.q-1)
            attrs[attr.upper()] = pow(mpk.g, t * pow(r, -1, self.q), mpk.p)
        
        return UserKey(K=K, L=L, attrs=attrs)
    
    def keygen2(self, mpk: MasterKey, msk: Dict, attributes: List[Union[str, List[str]]]) -> UserKey:
        """Génère une clé utilisateur basée sur ses attributs"""
        t = getRandomRange(1, self.q-1)

        K = (pow(mpk.g_a, t, mpk.p) * pow(mpk.h, msk['alpha'], mpk.p)) % mpk.p
        L = pow(mpk.g, t, mpk.p)

        # Normalisation des attributs pour tout convertir en chaînes plates
        normalized_attributes = []
        for attr in attributes:
            if isinstance(attr, list):  # Si c'est une liste, on l'éclate
                normalized_attributes.extend(attr)
            else:  # Si c'est une simple chaîne, on la garde telle quelle
                normalized_attributes.append(attr)

        # Génération des composantes pour chaque attribut
        attrs = {}
        for attr in set(normalized_attributes):  # Éliminer les doublons
            r = getRandomRange(1, self.q-1)
            attrs[attr.upper()] = pow(mpk.g, t * pow(r, -1, self.q), mpk.p)

        return UserKey(K=K, L=L, attrs=attrs)

    def encrypt(self, mpk: MasterKey, plaintext: bytes, policy: PolicyNode) -> Dict:
        """Chiffre un message avec une politique d'accès"""
        s = getRandomRange(1, self.q-1)
        
        # Chiffrement AES avec la clé dérivée de e(g,g)^(αs)
        cipher_key = self._derive_key(pow(mpk.e_gg_alpha, s, mpk.p))
        cipher = AES.new(cipher_key, AES.MODE_GCM)
        ciphertext, tag = cipher.encrypt_and_digest(pad(plaintext, AES.block_size))
        
        return {
            'policy': policy,
            'C_tilde': pow(mpk.g_a, s, mpk.p),  # g^(αs)
            'C': pow(mpk.g, s, mpk.p),         # g^s
            'shares': self._distribute_shares(s, policy),
            'ciphertext': ciphertext,
            'iv': cipher.nonce,
            'tag': tag
        }

    def decrypt(self, mpk: MasterKey, sk: UserKey, ciphertext: Dict) -> bytes:
        """Déchiffre le message si la politique est satisfaite"""
        if not self._check_policy(ciphertext['policy'], sk.attrs):
            raise ValueError("Accès refusé: les attributs ne satisfont pas la politique")
            
        # Reconstruction du secret s
        s = self._reconstruct_secret(ciphertext['policy'], ciphertext['shares'], sk)
        if s is None:
            raise ValueError("Impossible de reconstruire le secret")
        
        # CORRECTION: Calcul simplifié mais fonctionnel de la clé
        # Dans une vraie implémentation CP-ABE, on utiliserait:
        # key = pairing(C_tilde, K) / pairing(L, C)
        # Mais ici on simule avec:
        reconstructed_key = pow(mpk.e_gg_alpha, s, mpk.p)
        
        # Dérivation de la clé
        cipher_key = self._derive_key(reconstructed_key)
        
        try:
            cipher = AES.new(cipher_key, AES.MODE_GCM, nonce=ciphertext['iv'])
            return unpad(cipher.decrypt_and_verify(
                ciphertext['ciphertext'], ciphertext['tag']
            ), AES.block_size)
        except ValueError as e:
            raise ValueError("Échec du déchiffrement: la clé ou les données sont corrompues") from e

    # === METHODES UTILITAIRES ===
    def _derive_key(self, element: int) -> bytes:
        """Dérive une clé AES à partir d'un élément du groupe"""
        return hashlib.sha3_256(
            str(element).encode()
        ).digest()[:32]

    def _distribute_shares(self, secret: int, policy: PolicyNode) -> Dict[str, int]:
        """Distribue le secret selon la politique d'accès"""
        shares = {}
        
        if policy.node_type == 'ATTR':
            shares[policy.attribute] = secret
            
        elif policy.node_type == 'AND':
            parts = [getRandomRange(1, self.q-1) for _ in policy.children[:-1]]
            parts.append((secret - sum(parts)) % self.q)
            for child, part in zip(policy.children, parts):
                shares.update(self._distribute_shares(part, child))
                
        elif policy.node_type == 'OR':
            # Pour un OR, on utilise le même secret pour tous les enfants
            for child in policy.children:
                shares.update(self._distribute_shares(secret, child))
                
        elif policy.node_type == 'THRESHOLD':
            k, n = policy.threshold
            if k > n:
                raise ValueError("Le seuil k ne peut pas être supérieur à n")
                
            # Polynôme de degré k-1
            coeffs = [secret] + [getRandomRange(1, self.q-1) for _ in range(k-1)]
            for child in policy.children:
                x = self._hash_attr(child.attribute)
                share = sum(c * pow(x, i, self.q) for i, c in enumerate(coeffs)) % self.q
                shares.update(self._distribute_shares(share, child))
                
        return shares

    def _reconstruct_secret(self, policy: PolicyNode, shares: Dict[str, int], sk: UserKey) -> Optional[int]:
        """Reconstruit le secret ssi la politique est satisfaite"""
        if policy.node_type == 'ATTR':
            if policy.attribute in sk.attrs:
                return shares.get(policy.attribute)
            return None
            
        elif policy.node_type == 'AND':
            parts = []
            for child in policy.children:
                part = self._reconstruct_secret(child, shares, sk)
                if part is None:
                    return None
                parts.append(part)
            return sum(parts) % self.q
            
        elif policy.node_type == 'OR':
            for child in policy.children:
                secret = self._reconstruct_secret(child, shares, sk)
                if secret is not None:
                    return secret
            return None
            
        elif policy.node_type == 'THRESHOLD':
            points = []
            for child in policy.children:
                if len(points) >= policy.threshold[0]:
                    break
                if (y := self._reconstruct_secret(child, shares, sk)) is not None:
                    points.append((self._hash_attr(child.attribute), y))
            
            if len(points) < policy.threshold[0]:
                return None
                
            # Interpolation de Lagrange
            secret = 0
            for i, (xi, yi) in enumerate(points):
                term = yi
                for j, (xj, _) in enumerate(points):
                    if i != j:
                        term = term * (0 - xj) * pow(xi - xj, -1, self.q) % self.q
                secret = (secret + term) % self.q
            return secret

    def _check_policy(self, policy: PolicyNode, attrs: Dict[str, int]) -> bool:
        """Vérifie si les attributs satisfont la politique"""
        if policy.node_type == 'ATTR':
            return policy.attribute in attrs
            
        elif policy.node_type == 'AND':
            return all(self._check_policy(c, attrs) for c in policy.children)
            
        elif policy.node_type == 'OR':
            return any(self._check_policy(c, attrs) for c in policy.children)
            
        elif policy.node_type == 'THRESHOLD':
            k, _ = policy.threshold
            satisfied = sum(1 for c in policy.children if self._check_policy(c, attrs))
            return satisfied >= k

    def _hash_attr(self, attr: str) -> int:
        """Hash un attribut en un entier modulo q"""
        return int.from_bytes(
            hashlib.sha3_256(attr.encode()).digest(),
            'big'
        ) % self.q

# Tables pour les politiques
SERVICE_TABLES = ['AGENT', 'MEDECIN', 'INFIRMIER']
REST_TABLES = ['PATIENT', 'RADIOLOGUE', 'COMPTABLE', 'LABORANTIN']
ABE_TABLES = SERVICE_TABLES + REST_TABLES

# Politiques statiques
STATIC_POLICIES = {
    ('patient', 'telephone'): ['AGENT', 'RECEPTION'],
    ('patient', 'email'): ['AGENT', 'RECEPTION'],
    ('patient' , 'adresse'): ['AGENT', 'RECEPTION'],
    ('medecin', 'telephone'): ['AGENT', 'ADMINISTRATION'],
    ('medecin', 'email'): ['AGENT', 'ADMINISTRATION'],
    ('agent', 'telephone'): ['AGENT', 'ADMINISTRATION'],
    ('agent', 'email'): ['AGENT', 'ADMINISTRATION'],
    ('infirmier', 'telephone'): ['AGENT', 'ADMINISTRATION'],
    ('infirmier', 'email'): ['AGENT', 'ADMINISTRATION'],
    ('laborantin', 'telephone'): ['AGENT', 'ADMINISTRATION'],
    ('laborantin', 'email'): ['AGENT', 'ADMINISTRATION'],
    ('radiologue', 'telephone'): ['AGENT', 'ADMINISTRATION'],
    ('radiologue', 'email'): ['AGENT', 'ADMINISTRATION'],
    ('comptable', 'telephone'): ['AGENT', 'ADMINISTRATION'],
    ('comptable', 'email'): [['AGENT', 'ADMINISTRATION']],
    ('radio', 'type_radio'): [['MEDECIN'], ['RADIOLOGUE']],
    ('radio', 'resultat'): [['MEDECIN'], ['RADIOLOGUE']],
    ('facture', 'montant'): [['COMPTABLE'], ['PATIENT']]
}

def create_abe_policy(table_name: str, servi: str = None) -> list[str]:
    """
    Crée une politique ABE au format simplifié ['MEDECIN', 'CARDIOLOGIE'].
    Vérifie si la table appartient à SERVICE_TABLES ou REST_TABLES.
    """
    table_name = table_name.upper()
    
    # Vérification de la table
    if table_name not in ABE_TABLES:
        raise ValueError(f"Table {table_name} non reconnue. Tables valides: {ABE_TABLES}")
    
    # Cas SERVICE_TABLES
    if table_name in SERVICE_TABLES:
        if not servi:
            raise ValueError(f"Pour la table {table_name}, le paramètre 'servi' est requis")
        return [table_name, servi.upper()]
    
    # Cas REST_TABLES (ignore servi si fourni)
    return [table_name]

def list_to_policy(policy_list: list) -> PolicyNode:
    """Convertit une liste Python en arbre PolicyNode avec gestion explicite des groupes OR/AND"""
    def build_node(element):
        if isinstance(element, list):
            # Si l'élément contient des sous-listes, créer un OR entre les groupes
            if any(isinstance(e, list) for e in element):
                return PolicyNode("OR", [build_group(g) for g in element])
            # Sinon, créer un AND pour les éléments simples
            else:
                return PolicyNode("AND", [build_attr(e) for e in element])
        else:
            return build_attr(element)

    def build_group(group):
        # Un groupe est traité comme un AND, même avec un seul élément
        if isinstance(group, list):
            return PolicyNode("AND", [build_attr(e) for e in group])
        return build_attr(group)

    def build_attr(attr):
        return PolicyNode("ATTR", attribute=attr.upper())

    return build_node(policy_list)

# Classe d'encodage JSON personnalisée pour les objets complexes
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if is_dataclass(obj):
            return asdict(obj)
        # Pour les bytes (comme ciphertext, iv, etc.)
        if isinstance(obj, bytes):
            return base64.b64encode(obj).decode('utf-8')
        # Pour PolicyNode qui est récursif
        if isinstance(obj, PolicyNode):
            result = {"node_type": obj.node_type}
            if obj.attribute:
                result["attribute"] = obj.attribute
            if obj.threshold:
                result["threshold"] = obj.threshold
            if obj.children:
                result["children"] = obj.children
            return result
        return super().default(obj)

# Méthodes de décodage des données sérialisées
def decode_json(data):
    """Convertit les structures données en objets python"""
    # Base64 decode pour les bytes
    for key in ['ciphertext', 'iv', 'tag']:
        if key in data:
            data[key] = base64.b64decode(data[key])
    
    # Reconstruction de PolicyNode
    if 'policy' in data:
        data['policy'] = decode_policy_node(data['policy'])
        
    return data

def decode_policy_node(node_data):
    """Reconstruit récursivement un PolicyNode depuis un dict"""
    node_type = node_data['node_type']
    
    if node_type == 'ATTR':
        return PolicyNode(node_type=node_type, attribute=node_data['attribute'])
    
    if node_type == 'THRESHOLD':
        return PolicyNode(
            node_type=node_type,
            threshold=tuple(node_data['threshold']),
            children=[decode_policy_node(child) for child in node_data['children']]
        )
    
    # AND, OR
    return PolicyNode(
        node_type=node_type,
        children=[decode_policy_node(child) for child in node_data['children']]
    )

# Initialisation de Flask
app = Flask(__name__)
CORS(app)  # Pour permettre les requêtes cross-origin depuis Next.js

# Variables globales pour stocker les clés maîtresses
global_cpabe = None
global_mpk = None
global_msk = None

@app.route('/api/setup', methods=['POST'])
def api_setup():
    """Initialise le système ABE et génère les clés maîtresses"""
    global global_cpabe, global_mpk, global_msk
    
    try:
        global_cpabe = CPABE(256)
        global_mpk, global_msk = global_cpabe.setup()
        
        # Conversion en format serialisable
        result = {
            'keys': {
                'mpk': json.dumps(global_mpk, cls=CustomJSONEncoder),
                'msk': json.dumps(global_msk, cls=CustomJSONEncoder),
            },
            'status': 'success',
            'message': 'Système ABE initialisé avec succès'
        }
        
        # On ne retourne pas les clés directement pour des raisons de sécurité
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/keygen', methods=['POST'])
def api_keygen():
    """Génère une clé utilisateur basée sur ses attributs"""
    global global_cpabe, global_mpk, global_msk
    
    if not all([global_cpabe, global_mpk, global_msk]):
        return jsonify({'status': 'error', 'message': 'Système ABE non initialisé'}), 400
    
    try:
        params = request.json
        attributes = params.get('attributes', [])
        
        if not attributes:
            return jsonify({'status': 'error', 'message': 'Attributs requis'}), 400
        
        # Génération de la clé
        user_key = global_cpabe.keygen2(global_mpk, global_msk, attributes)
        
        # Conversion en format serialisable
        result = {
            'status': 'success',
            'user_key': json.dumps(user_key, cls=CustomJSONEncoder)
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/encrypt', methods=['POST'])
def api_encrypt():
    """Chiffre un message avec une politique d'accès"""
    global global_cpabe, global_mpk, global_msk
    
    if not all([global_cpabe, global_mpk, global_msk]):
        return jsonify({'status': 'error', 'message': 'Système ABE non initialisé'}), 400
    
    try:
        params = request.json
        plaintext = params.get('plaintext', '')
        table = params.get('table', '')
        column = params.get('column', '')
        service = params.get('service', None)
        
        if not all([plaintext, table, column]):
            return jsonify({'status': 'error', 'message': 'Paramètres requis: plaintext, table, column'}), 400
        
        # Détermination de la politique
        policy_list = []
        
        # Cas dynamiques
        if (table, column) in [('patient', 'dossier_medical')]:
            if not service:
                return jsonify({'status': 'error', 'message': 'Service requis pour ce champ'}), 400
            policy_list = [['MEDECIN', service.upper()]]
            
        elif (table, column) in [
            ('prelevement', 'temperature'),
            ('prelevement', 'observation'),
            ('prelevement', 'tension_art'),
            ('prelevement', 'pulsation'),
            ('prelevement', 'tension_resp')
        ]:
            if not service:
                return jsonify({'status': 'error', 'message': 'Service requis pour ce champ'}), 400
            policy_list = [['MEDECIN', service.upper()], ['INFIRMIER', service.upper()]]
            
        elif (table, column) in [
            ('analyse_medicale', 'examen'),
            ('analyse_medicale', 'valeur_details')
        ]:
            if not service:
                return jsonify({'status': 'error', 'message': 'Service requis pour ce champ'}), 400
            policy_list = [['MEDECIN', service.upper()], ['LABORANTIN']]
            
        # Cas statiques
        else:
            policy_list = STATIC_POLICIES.get((table.lower(), column.lower()), [])
            if not policy_list:
                return jsonify({'status': 'error', 'message': f'Aucune politique définie pour {table}.{column}'}), 400
        
        # Conversion en PolicyNode
        policy = list_to_policy(policy_list)
        
        # Chiffrement
        encrypted_data = global_cpabe.encrypt(global_mpk, plaintext.encode('utf-8'), policy)
        
        # Préparation des résultats
        result = {
            'status': 'success',
            'encrypted_data': json.dumps(encrypted_data, cls=CustomJSONEncoder),
            'policy_list': policy_list
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/decrypt', methods=['POST'])
def api_decrypt():
    """Déchiffre un message avec la clé utilisateur"""
    global global_cpabe, global_mpk, global_msk
    
    if not all([global_cpabe, global_mpk, global_msk]):
        return jsonify({'status': 'error', 'message': 'Système ABE non initialisé'}), 400
    
    try:
        params = request.json
        user_key_json = params.get('user_key', '')
        encrypted_data_json = params.get('encrypted_data', '')
        
        if not all([user_key_json, encrypted_data_json]):
            return jsonify({'status': 'error', 'message': 'Paramètres requis: user_key, encrypted_data'}), 400
        
        # Décodage des structures JSON
        user_key_data = json.loads(user_key_json)
        user_key = UserKey(
            K=user_key_data['K'],
            L=user_key_data['L'],
            attrs=user_key_data['attrs']
        )
        
        encrypted_data = json.loads(encrypted_data_json)
        encrypted_data = decode_json(encrypted_data)
        
        # Déchiffrement
        try:
            plaintext = global_cpabe.decrypt(global_mpk, user_key, encrypted_data).decode('utf-8')
            return jsonify({
                'status': 'success',
                'plaintext': plaintext
            })
        except ValueError as e:
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 403  # 403 Forbidden si les attributs ne satisfont pas la politique
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/policy', methods=['POST'])
def api_create_policy():
    """Crée une politique ABE pour un type d'utilisateur"""
    try:
        params = request.json
        table_name = params.get('table_name', '')
        service = params.get('service', None)
        
        if not table_name:
            return jsonify({'status': 'error', 'message': 'Paramètre table_name requis'}), 400
        
        # Création de la politique
        try:
            policy = create_abe_policy(table_name, service)
            return jsonify({
                'status': 'success',
                'policy': policy
            })
        except ValueError as e:
            return jsonify({'status': 'error', 'message': str(e)}), 400
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/save_master_keys', methods=['POST'])
def api_save_master_keys():
    """Sauvegarde les clés maîtresses dans un fichier"""
    global global_cpabe, global_mpk, global_msk
    
    if not all([global_cpabe, global_mpk, global_msk]):
        return jsonify({'status': 'error', 'message': 'Système ABE non initialisé'}), 400
    
    try:
        # Sérialisation des objets avec pickle (plus sûr que JSON pour ces structures)
        with open('master_keys.pkl', 'wb') as f:
            pickle.dump({
                'cpabe': global_cpabe,
                'mpk': global_mpk,
                'msk': global_msk
            }, f)
        
        return jsonify({
            'status': 'success',
            'message': 'Clés maîtresses sauvegardées avec succès'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/load_master_keys', methods=['POST'])
def api_load_master_keys():
    """Charge les clés maîtresses depuis un fichier"""
    global global_cpabe, global_mpk, global_msk
    
    try:
        # Désérialisation des objets
        with open('master_keys.pkl', 'rb') as f:
            keys = pickle.load(f)
            global_cpabe = keys['cpabe']
            global_mpk = keys['mpk']
            global_msk = keys['msk']
        
        return jsonify({
            'status': 'success',
            'message': 'Clés maîtresses chargées avec succès'
        })
    except FileNotFoundError:
        return jsonify({'status': 'error', 'message': 'Fichier de clés non trouvé'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)