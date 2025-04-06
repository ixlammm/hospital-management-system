import hashlib
from typing import Dict, List, Optional, Tuple, Union
from dataclasses import dataclass
from Cryptodome.Cipher import AES
from Cryptodome.Util.Padding import pad, unpad
from Cryptodome.Util.number import getPrime, isPrime, getRandomRange

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
            return "Accès refusé"
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

# === EXEMPLE D'UTILISATION ===
if __name__ == "__main__":
    try:
        # Initialisation
        cpabe = CPABE(256)  # Paramètre de sécurité réduit pour les tests
        
        print("Génération des clés maîtresses...")
        mpk, msk = cpabe.setup()
        
        # Politique: (A ET (B OU C))
        policy = PolicyNode('AND', [
            PolicyNode('ATTR', attribute='A'),
            PolicyNode('OR', [
                PolicyNode('ATTR', attribute='B'),
                PolicyNode('ATTR', attribute='C')
            ])
        ])
        
        # Utilisateur avec attributs A et B
        print("Génération des clés utilisateur...")
        user_ab = cpabe.keygen(mpk, msk, ['A', 'B'])
        print(type(user_ab))
        # Utilisateur avec attributs A et C
        user_ac = cpabe.keygen(mpk, msk, ['A', 'C'])
        
        # Utilisateur avec seulement A (ne pourra pas déchiffrer)
        user_a = cpabe.keygen(mpk, msk, ['A'])
        
        # Message secret
        secret = b"Message ultra secret!"
        
        # Chiffrement
        print("Chiffrement du message...")
        ct = cpabe.encrypt(mpk, secret, policy)
        print(ct)
        
        # Déchiffrement par user_ab (devrait réussir)
        print("Tentative de déchiffrement avec A et B...")
        decrypted_ab = cpabe.decrypt(mpk, user_ab, ct)
        print(f"Succès: {decrypted_ab.decode()}")
        
        # Déchiffrement par user_ac (devrait réussir)
        print("Tentative de déchiffrement avec A et C...")
        decrypted_ac = cpabe.decrypt(mpk, user_ac, ct)
        print(f"Succès: {decrypted_ac.decode()}")
        
        # Déchiffrement par user_a (devrait échouer)
        print("Tentative de déchiffrement avec seulement A...")
        try:
            decrypted_a = cpabe.decrypt(mpk, user_a, ct)
            print("ERREUR: Le déchiffrement a réussi alors qu'il aurait dû échouer")
        except ValueError as e:
            print(f"Échec attendu: {e}")
        
    except Exception as e:
        print(f"Erreur: {e}")