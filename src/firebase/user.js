class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
    async register() {
        try {
            await createUserWithEmailAndPassword(auth, this.email, this.password);
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }
    async loginWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Error logging in with Google:', error);
            throw error;
        }
    }
}