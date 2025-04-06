const API_BASE = process.env.ABE_BASE; // Change if hosted elsewhere

export interface CPABEInitResponse {
    cpabe: string;
    mpk: string;
    msk: string;
    message: string;
}

export interface EncryptResponse {
    encrypted_data: string;
    policy: string[][];
    message: string;
}

export interface DecryptResponse {
    decrypted_data: string;
    message: string;
}

export interface GenerateKeyResponse {
    user_key: string;
    message: string;
}

const handleFetch = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
};

export class ABE {
    static async initializeSystem(): Promise<CPABEInitResponse> {
        return await handleFetch(`${API_BASE}/init`);
    }

    static async loadKeys(cpabe: string, mpk: string, msk: string): Promise<{ message: string }> {
        return await handleFetch(`${API_BASE}/load_keys`, {
            method: 'POST',
            body: JSON.stringify({ cpabe, mpk, msk }),
        });
    }

    static async encrypt(
        table: string,
        column: string,
        plaintext: string,
        service?: string
    ): Promise<EncryptResponse> {
        return await handleFetch(`${API_BASE}/encrypt`, {
            method: 'POST',
            body: JSON.stringify({ table, column, plaintext, service }),
        });
    }

    static async decrypt(
        encrypted_data: string,
        user_key: string
    ): Promise<DecryptResponse> {
        return await handleFetch(`${API_BASE}/decrypt`, {
            method: 'POST',
            body: JSON.stringify({ encrypted_data, user_key }),
        });
    }

    static async generateUserKey(attributes: string[] | string[][]): Promise<GenerateKeyResponse> {
        return await handleFetch(`${API_BASE}/generate_user_key`, {
            method: 'POST',
            body: JSON.stringify({ attributes }),
        });
    }
};
