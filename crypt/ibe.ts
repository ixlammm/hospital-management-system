const API_BASE = process.env.IBE_BASE // Modifie selon ton serveur

export interface CleResponse {
    identite: string;
    r: string;
    a: string;
}

export interface ChiffrerResponse {
    message_chiffre: string;
}

export interface DechiffrerResponse {
    message_clair: string;
}

export interface PkgResponse {
    message: string;
    p: string;
    q: string;
    n: string;
}

// Helper fetcher
async function postJSON<T>(url: string, body: any): Promise<T> {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    return res.json();
}

async function getJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
    return res.json();
}

// --- API Calls ---

export class IBE {

    static genererCles(tableName: string, idUtilisateur: string): Promise<CleResponse> {
        return postJSON(`${API_BASE}/generer_cles`, {
            table_name: tableName,
            id_utilisateur: idUtilisateur
        });
    }

    static chiffrer(message: string, a: string): Promise<ChiffrerResponse> {
        return postJSON(`${API_BASE}/chiffrer`, {
            message,
            a
        });
    }

    static dechiffrer(messageChiffre: string, r: string, a: string): Promise<DechiffrerResponse> {
        return postJSON(`${API_BASE}/dechiffrer`, {
            message_chiffre: messageChiffre,
            r,
            a
        });
    }

    static getPkg(): Promise<PkgResponse> {
        return getJSON(`${API_BASE}/get_pkg`);
    }

    static setPkg(p: string, q: string, n: string): Promise<PkgResponse> {
        return postJSON(`${API_BASE}/set_pkg`, { p, q, n });
    }
}