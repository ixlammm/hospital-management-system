// Fichier: app/api/abe.js - Client API pour appeler le backend Flask depuis Next.js

import axios from 'axios';

// URL de base de l'API Flask
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Client API pour interagir avec le service ABE Flask
 */
export class AbeClient {
  /**
   * Initialise le système ABE et génère les clés maîtresses
   * @param {number} securityParam - Paramètre de sécurité (par défaut: 256)
   * @returns {Promise<Object>} - Résultat de l'opération
   */
  static async setup(securityParam = 256) {
    try {
      const response = await axios.post(`${API_BASE_URL}/setup`, {
        security_param: securityParam
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Génère une clé utilisateur basée sur ses attributs
   * @param {Array} attributes - Liste des attributs (ex: ['MEDECIN', 'CARDIOLOGIE'])
   * @returns {Promise<Object>} - La clé utilisateur générée
   */
  static async generateUserKey(attributes) {
    try {
      const response = await axios.post(`${API_BASE_URL}/keygen`, {
        attributes: attributes
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Chiffre un message avec une politique d'accès basée sur la table et la colonne
   * @param {string} plaintext - Texte à chiffrer
   * @param {string} table - Nom de la table
   * @param {string} column - Nom de la colonne
   * @param {string} service - Service associé (optionnel)
   * @returns {Promise<Object>} - Les données chiffrées et la politique
   */
  static async encrypt(plaintext, table, column, service = null) {
    try {
      const response = await axios.post(`${API_BASE_URL}/encrypt`, {
        plaintext: plaintext,
        table: table,
        column: column,
        service: service
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Déchiffre un message avec la clé utilisateur
   * @param {string} userKeyJson - Clé utilisateur au format JSON
   * @param {string} encryptedDataJson - Données chiffrées au format JSON
   * @returns {Promise<Object>} - Le texte déchiffré
   */
  static async decrypt(userKeyJson, encryptedDataJson) {
    try {
      const response = await axios.post(`${API_BASE_URL}/decrypt`, {
        user_key: userKeyJson,
        encrypted_data: encryptedDataJson
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Crée une politique ABE pour un type d'utilisateur
   * @param {string} tableName - Nom de la table
   * @param {string} service - Service associé (optionnel)
   * @returns {Promise<Object>} - La politique générée
   */
  static async createPolicy(tableName, service = null) {
    try {
      const response = await axios.post(`${API_BASE_URL}/policy`, {
        table_name: tableName,
        service: service
      });
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Sauvegarde les clés maîtresses dans un fichier
   * @returns {Promise<Object>} - Résultat de l'opération
   */
  static async saveMasterKeys() {
    try {
      const response = await axios.post(`${API_BASE_URL}/save_master_keys`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Charge les clés maîtresses depuis un fichier
   * @returns {Promise<Object>} - Résultat de l'opération
   */
  static async loadMasterKeys() {
    try {
      const response = await axios.post(`${API_BASE_URL}/load_master_keys`);
      return response.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Gère les erreurs de l'API
   * @private
   */
  static _handleError(error) {
    if (error.response && error.response.data) {
      return new Error(error.response.data.message || 'Erreur du serveur');
    }
    return new Error('Erreur de connexion au serveur');
  }
}