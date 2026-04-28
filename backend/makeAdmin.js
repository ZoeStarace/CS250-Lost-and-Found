import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const credentials = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const auth = admin.auth();

const email = process.argv[2];

if (!email) {
    console.log("Usage: node makeAdmin.js user@example.com");
    process.exit(1);
}

async function makeAdmin() {
    try {
        const user = await auth.getUserByEmail(email);

        await auth.setCustomUserClaims(user.uid, { admin: true });

        console.log(`Success: ${email} is now an admin.`);
        console.log(`UID: ${user.uid}`);
        process.exit(0);
    } catch (error) {
        console.error("Error making user admin:", error.message);
        process.exit(1);
    }
}

makeAdmin();