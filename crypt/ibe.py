import re
import gmpy2
# import psycopg2
# from psycopg2 import sql
# from psycopg2.extras import execute_values
from flask import Flask, app, jsonify, request
from cocks import Cocks, CocksPKG
from base64 import b64encode, b64decode
from utils import *
import pickle

# Initialisation unique (au démarrage du serveur)
global_pkg = CocksPKG()  # Génère p, q, et n
# Verifier la table cocks_pkg :
# Si actif == 1 alors {
#     global_pkg.n = gmpy2.mpz(n)
#     global_pkg.p = gmpy2.mpz(p)
#     global_pkg.q = gmpy2.mpz(q)
#     }
# Il faut utiliser gmpy2.mpz() pour caster la donnee qui a ete dans la base et la recuperer dans une variable ici

global_n = global_pkg.n   # n est désormais global

# === Fonctions IBE ===
# --- 1. Génération des clés pour un nouvel utilisateur ---
# Il faut avoir le nom de la table et le user_id ---> l'identité sera : la premiere lettre du nom de la table + user_id : str
def generer_cles_ibe(table_name, id_utilisateur):
    """
    Génère les clés pour un utilisateur en utilisant le `n` global.
    """
    # Création de l'identité : première lettre table + id
    id_str = f"{table_name[0]}{id_utilisateur}"

    r, a = global_pkg.extract(id_str)
    return {
        'r': str(r),    # stocké comme str      a l'utilisation ils seront mis a mpz avec gmpy2.mpz(r)
        'a': str(a),    # stocké comme str 
    }
# Stocker le resultat dans la table de l'utilisateur :
# cles = generer_cles_ibe('patient', 140)
#     a     ---> cles['a']
#     r     ---> cles['r']


# --- 2. Chiffrement ---
# Il faut avoir le message a chiffrer et le "a" du user qui va chiffrer
def chiffrer_ibe(message: str, a: str) -> list:
    """
    Chiffre un message en utilisant 'a' et 'n_global'.
    """
    a_mpz = gmpy2.mpz(a)
    cocks = Cocks(global_n)
    return cocks.encrypt(message.encode('utf-8'), a_mpz)

# --- 3. Déchiffrement ---
# Il faut avoir le message chiffré et le r_mpz et a_mpz
def dechiffrer_ibe(message_chiffre: list, r: str, a: str) -> str:
    """
    Déchiffre un message en utilisant 'r', 'a' et 'n_global'.
    """
    r_mpz = gmpy2.mpz(r)
    a_mpz = gmpy2.mpz(a)
    cocks = Cocks(global_n)
    message_clair = cocks.decrypt(message_chiffre, r_mpz, a_mpz)
    return message_clair.decode('utf-8')
# Obtenir le message clair : str

app = Flask(__name__)

@app.route('/generer_cles', methods=['POST'])
def generer_cles():
    data = request.get_json()

    # Validate input
    if not data or 'table_name' not in data or 'id_utilisateur' not in data:
        return jsonify({'error': 'Champs table_name et id_utilisateur requis.'}), 400

    table_name = data['table_name']
    id_utilisateur = data['id_utilisateur']

    try:
        # Création de l'identité : première lettre table + id
        identite = f"{table_name[0]}{id_utilisateur}"
        id_str = str(id_utilisateur)
        r, a = global_pkg.extract(id_str)

        return jsonify({
            'identite': identite,
            'r': str(r),
            'a': str(a)
        })

    except Exception as e:
        return jsonify({'error': f'Erreur lors de la génération des clés: {str(e)}'}), 500

@app.route('/chiffrer', methods=['POST'])
def chiffrer():
    data = request.get_json()
    if not data or 'message' not in data or 'a' not in data:
        return jsonify({'error': 'Champs message et a requis.'}), 400

    try:
        message = data['message']
        a = gmpy2.mpz(data['a'])
        cocks = Cocks(global_n)
        message_chiffre = cocks.encrypt(message.encode('utf-8'), a)
        return jsonify({
            'message_chiffre': b64encode(pickle.dumps(message_chiffre)).decode(),  # Sérialisation pour JSON
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- 3. Déchiffrement ---
@app.route('/dechiffrer', methods=['POST'])
def dechiffrer():
    data = request.get_json()
    if not data or 'message_chiffre' not in data or 'r' not in data or 'a' not in data:
        return jsonify({'error': 'Champs message_chiffre, r et a requis.'}), 400

    try:
        message_chiffre = pickle.loads(b64decode(data['message_chiffre']))
        r = gmpy2.mpz(data['r'])
        a = gmpy2.mpz(data['a'])
        cocks = Cocks(global_n)
        message_clair = cocks.decrypt(message_chiffre, r, a)
        return jsonify({
            'message_clair': message_clair.decode('utf-8')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_pkg', methods=['GET'])
def get_pkg():
    global global_pkg, global_n
    global_pkg = CocksPKG()  # Nouveau jeu de clés
    global_n = global_pkg.n

    return jsonify({
        "message": "Nouveau CocksPKG généré.",
        "p": str(global_pkg.p),
        "q": str(global_pkg.q),
        "n": str(global_pkg.n)
    })

@app.route('/set_pkg', methods=['POST'])
def set_pkg():
    data = request.get_json()

    if not data or not all(k in data for k in ("p", "q", "n")):
        return jsonify({"error": "Champs requis : p, q, n"}), 400

    try:
        global global_pkg, global_n
        global_pkg.p = gmpy2.mpz(data["p"])
        global_pkg.q = gmpy2.mpz(data["q"])
        global_pkg.n = gmpy2.mpz(data["n"])
        global_n = global_pkg.n

        return jsonify({
            "message": "CocksPKG mis à jour.",
            "p": str(global_pkg.p),
            "q": str(global_pkg.q),
            "n": str(global_pkg.n)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

#Execution
# do = {
#     "nom_table" : "medecin",
#     "donnees" : {
#         'id_medecin' : 1,
#         "mdp" : "ana chikour",
#         "a" : "a",
#         "r" : "r"
#     }
# }
# data = use_to_cipher_ibe(do)
# clair = dechiffrer_ibe(data["donnees"]["mdp"], data["donnees"]["r"], data["donnees"]["a"])
# print(data["donnees"]["a"])


# ============================ RESUME ============================
# - Verification du champ actif dans la table cocks_pkg :
#     A l'initialisation on doit avoir un seul global_pkg donc a la premiere execution on stocke les parametres du global_pkg dans la table cocks_pk
#     Pour les prochaines executions, on verifie si le champs "actif" = 1
#         Si oui, alors on ecrase les donnees du variable qui se trouve dans le codes par les champs existants dans la table
#         Sinon : c'est la premiere fois, donc on les insere dans la table cocks_pkg et on met actif a 1

# - Pour l'insertion d'un nouveau utilisateur dans les tables des utilisateurs ou bien insertion dans la table consultation par un medecin 
#       on utilise la fonction use_to_cipher avec ces parametres

# - Pour le dechiffrement 
#       on utilise la fonction dechiffrer_ibe
