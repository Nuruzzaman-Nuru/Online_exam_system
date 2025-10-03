// Authentication handling
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
<<<<<<< HEAD
=======
        // Ensure an admin account exists for admin login/testing
        if (!this.users.some(u => u.role === 'admin')) {
            const admin = {
                id: 'admin-' + Date.now(),
                username: 'admin',
                password: 'admin123', // change after first use
                role: 'admin',
                fullName: 'Administrator',
                address: '',
                mobile: ''
            };
            this.users.push(admin);
            localStorage.setItem('users', JSON.stringify(this.users));
        }
>>>>>>> 56a26c6 (Initial commit)
    }

    signup(userData) {
        if (this.users.some(user => user.username === userData.username)) {
            throw new Error('Username already exists');
        }

        const user = {
            id: Date.now().toString(),
            username: userData.username,
            password: userData.password, // In a real app, this should be hashed
            role: userData.role,
            fullName: userData.fullName,
            address: userData.address,
            mobile: userData.mobile
        };

        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));
        return user;
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isTeacher() {
        return this.currentUser?.role === 'teacher';
    }

    isStudent() {
        return this.currentUser?.role === 'student';
    }

<<<<<<< HEAD
=======
    isAdmin() {
        return this.currentUser?.role === 'admin';
    }

>>>>>>> 56a26c6 (Initial commit)
    getCurrentUser() {
        return this.currentUser;
    }
}

const auth = new Auth();