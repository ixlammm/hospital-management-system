import { ABE } from "./abe";

(async () => {
    try {
        const init = await ABE.initializeSystem();
        console.log('Initialized:', init.message);

        const userKeyRes = await ABE.generateUserKey(['MEDECIN', 'CARDIO']);
        console.log('Generated key:', userKeyRes.user_key);

        const encrypted = await ABE.encrypt('PATIENT', 'dossier_medical', 'données secrètes', 'cardio');
        console.log('Encrypted:', encrypted.encrypted_data);

        const decrypted = await ABE.decrypt(encrypted.encrypted_data, userKeyRes.user_key);
        console.log('Decrypted:', decrypted.decrypted_data);
    } catch (err) {
        console.error('Error:', err);
    }
})();
