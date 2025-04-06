from flask import Flask, request, jsonify
import pickle
import base64
from abe import CPABE, PolicyNode, MasterKey, UserKey
from typing import Dict, List
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)

envKey = json.loads(base64.b64decode(os.getenv("ABE_MASTER_KEY")))

cpabe_data = pickle.loads(base64.b64decode(envKey['cpabe']))
mpk = pickle.loads(base64.b64decode(envKey['mpk']))
msk = pickle.loads(base64.b64decode(envKey['msk']))

# Réinitialisation de CPABE avec les paramètres stockés
cpabe = CPABE(256)
cpabe.p = cpabe_data['p']
cpabe.q = cpabe_data['q']
cpabe.g = cpabe_data['g']

# 1. API pour la génération initiale des clés et paramètres
@app.route('/api/init', methods=['GET'])
def initialize_system():
    global cpabe, mpk, msk
    
    # Génération des paramètres et clés
    cpabe = CPABE(256)
    mpk, msk = cpabe.setup()
    
    # Sérialisation des données
    cpabe_data = {
        'p': cpabe.p,
        'q': cpabe.q,
        'g': cpabe.g
    }
    mpk_data = pickle.dumps(mpk)
    msk_data = pickle.dumps(msk)
    
    # Encodage en base64 pour le transport
    return jsonify({
        'cpabe': base64.b64encode(pickle.dumps(cpabe_data)).decode('utf-8'),
        'mpk': base64.b64encode(mpk_data).decode('utf-8'),
        'msk': base64.b64encode(msk_data).decode('utf-8'),
        'message': 'Système initialisé avec succès'
    })

# 2. API pour charger les clés existantes
@app.route('/api/load_keys', methods=['POST'])
def load_keys():
    global cpabe, mpk, msk
    
    data = request.json
    
    try:
        # Décodage et désérialisation des données
        cpabe_data = pickle.loads(base64.b64decode(data['cpabe']))
        mpk = pickle.loads(base64.b64decode(data['mpk']))
        msk = pickle.loads(base64.b64decode(data['msk']))
        
        # Réinitialisation de CPABE avec les paramètres stockés
        cpabe = CPABE(256)
        cpabe.p = cpabe_data['p']
        cpabe.q = cpabe_data['q']
        cpabe.g = cpabe_data['g']
        
        return jsonify({'message': 'Clés chargées avec succès'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 3. API pour le chiffrement
@app.route('/api/encrypt', methods=['POST'])
def encrypt_data():
    global cpabe, mpk
    
    if not cpabe or not mpk:
        return jsonify({'error': 'Système non initialisé'}), 400
    
    data = request.json
    table = data.get('table')
    column = data.get('column')
    plaintext = data.get('plaintext')
    service = data.get('service', None)
    
    try:
        encrypted_data, policy_list = encrypt_field(table, column, plaintext, service)
        
        # Sérialisation des données chiffrées
        encrypted_data_serialized = base64.b64encode(pickle.dumps(encrypted_data)).decode('utf-8')
        
        return jsonify({
            'encrypted_data': encrypted_data_serialized,
            'policy': policy_list,
            'message': 'Données chiffrées avec succès'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 4. API pour le déchiffrement
@app.route('/api/decrypt', methods=['POST'])
def decrypt_data():
    global cpabe, mpk
    
    if not cpabe or not mpk:
        return jsonify({'error': 'Système non initialisé'}), 400
    
    data = request.json
    encrypted_data_b64 = data.get('encrypted_data')
    user_key_b64 = data.get('user_key')
    
    try:
        # Désérialisation des données
        encrypted_data = pickle.loads(base64.b64decode(encrypted_data_b64))
        user_key = pickle.loads(base64.b64decode(user_key_b64))
        
        # Déchiffrement
        decrypted = decrypt_field(user_key, encrypted_data)
        
        return jsonify({
            'decrypted_data': decrypted,
            'message': 'Données déchiffrées avec succès'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 5. API pour la génération de clé utilisateur
@app.route('/api/generate_user_key', methods=['POST'])
def generate_user_key():
    global cpabe, mpk, msk
    
    if not cpabe or not mpk or not msk:
        return jsonify({'error': 'Système non initialisé'}), 400
    
    data = request.json
    attributes = data.get('attributes')
    
    try:
        # Génération de la clé utilisateur
        user_key = cpabe.keygen2(mpk, msk, attributes)
        
        # Sérialisation de la clé
        user_key_serialized = base64.b64encode(pickle.dumps(user_key)).decode('utf-8')
        
        return jsonify({
            'user_key': user_key_serialized,
            'message': 'Clé utilisateur générée avec succès'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Fonctions utilitaires (reprises du code original)
def encrypt_field(table: str, column: str, plaintext: str, service: str = None):
    """Chiffre un champ selon sa politique associée"""
    # Détermination de la politique
    policy_list = []
    
    # Cas dynamiques
    if (table, column) in [('PATIENT', 'dossier_medical')]:
        policy_list = [['MEDECIN', service.upper()]]
    elif (table, column) in [
        ('prelevement', 'temperature'),
        ('prelevement', 'observation'),
        ('prelevement', 'tension_art'),
        ('prelevement', 'pulsation'),
        ('prelevement', 'tension_resp')
    ]:
        policy_list = [['MEDECIN', service.upper()], ['INFIRMIER', service.upper()]]
    elif (table, column) in [
        ('analyse_medicale', 'examen'),
        ('analyse_medicale', 'valeur_details')
    ]:
        policy_list = [['MEDECIN', service.upper()], ['LABORANTIN']]
    elif (table, column) in [
        ('radio', 'type_radio'),
        ('radio', 'resultat')
    ]:
        policy_list = [['MEDECIN', service.upper()], ['RADIOLOGUE']]
    else:
        # Cas statiques (simplifié pour l'exemple)
        policy_list = [table.upper()]
    
    # Conversion en PolicyNode
    policy = list_to_policy(policy_list)
    
    # Chiffrement
    encrypted_data = cpabe.encrypt(mpk, plaintext.encode('utf-8'), policy)
    
    return encrypted_data, policy_list

def decrypt_field(user_key: UserKey, encrypted_data: Dict) -> str:
    """Déchiffre un champ avec la clé utilisateur"""     
    try:
        return cpabe.decrypt(mpk, user_key, encrypted_data).decode('utf-8')
    except ValueError as e:
        raise ValueError(str(e))

def list_to_policy(policy_list: list) -> PolicyNode:
    """Convertit une liste Python en arbre PolicyNode"""
    def build_node(element):
        if isinstance(element, list):
            if any(isinstance(e, list) for e in element):
                return PolicyNode("OR", [build_group(g) for g in element])
            else:
                return PolicyNode("AND", [build_attr(e) for e in element])
        else:
            return build_attr(element)

    def build_group(group):
        if isinstance(group, list):
            return PolicyNode("AND", [build_attr(e) for e in group])
        return build_attr(group)

    def build_attr(attr):
        return PolicyNode("ATTR", attribute=attr.upper())

    return build_node(policy_list)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)