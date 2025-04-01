import CryptoJS from 'crypto-js';

export function saltAndHashPassword(password: string) {
    return CryptoJS.SHA256(password).toString();
}