const { auth } = require("./firebaseConfig");
import { GoogleAuthProvider } from "firebase/auth";

class User {
    constructor() {
        this.auth = auth;
    }
    async register() {
        try {
            const res = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
            return res.user
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }
    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const res  = await signInWithPopup(this.auth, provider);
            return res.user
        } catch (error) {
            console.error('Error logging in with Google:', error);
            throw error;
        }
    }
}

const UserService = new User();

export default UserService;