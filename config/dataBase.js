import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const defaultData = {
    "users": [
        {
            id: 1,
            nome: "Admin User",
            email: "admin@example.com",
            senha: '$2b$10$E9E6lvmIglzj/8XWLAhAD.D9EJRVSNg3aOoLu3Em/Qtj5aZcSKy1a', // hash para 'admin123'
            role: 'admin' // Papel de administrador 
        }
    ],

    "pets": []
}

const adapter = new JSONFile('db.json')

const db = new Low(adapter, defaultData)

await db.read()

export default db