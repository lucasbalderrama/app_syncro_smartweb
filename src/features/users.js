import { supabase } from "../../supabaseConfig";

const privateConstructorKey = Symbol("User.PrivateConstructorKey");

class User {
    constructor(key, userData) {
        if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        this.id = userData.id;
        this.name = userData.user_name;
        this.email = userData.user_email;
        this.createdAt = new Date(userData.created_at);
    }

    id;
    name;
    email;
    createdAt;

    static Service = class UserService {
        constructor(key) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        }

        static async auth(email, password) {
            const authData = {};
            let currentUser = await supabase.auth.getUser();
            if (currentUser.error) throw currentUser.error;
            if (currentUser.data.user) {
                authData.user = currentUser.data.user;
                let session = await supabase.auth.getSession();
                if (session.error) throw error;
                authData.session = session.data.session;
            } else {
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) throw signInError;
                authData.user = signInData.user;
                authData.session = signInData.session;
            }
            const { data: userData, error: userError } = await supabase.from("users")
                .select("id, user_name, created_at, user_email")
                .eq("id", authData.user.id)
                .single();
            if (userError) throw userError;
            const authUser = new AuthUser(privateConstructorKey, authData.session, authData.user, userData);
            return authUser;
        }

        async register(name, email, password) {
            if (this._authUser) throw Error("Already logged-in");
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password
            });
            if (authError) throw authError;
            const { data: userData, error: userError } = await supabase.from("users")
                .insert([{ id: authData.user.id, name, email }])
                .select("id, user_name, created_at, user_email")
                .single();
            if (userError) throw userError;
            const authUser = new AuthUser(privateConstructorKey, authData.session, authData.user, userData);
            this._authUser = authUser;
            return authUser;
        }

        async signOut() {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        }

        async get(id) { // único para todos, o resto é para o do _authUser;
            if (!id) throw new TypeError("User ID is required");
            const { data: userData, error: userError } = await supabase.from("users")
                .select("id, user_name, created_at, user_email")
                .eq("id", id)
                .single();
            if (userError) throw userError;
            return new User(privateConstructorKey, userData);
        }

        async getRelateds(auth) {
            if (!auth) throw new Error("Not authenticated");
            const authUserId = auth.id;
            const { data: users, error } = await supabase
                .from("chats")
                .select("*")
                .or(`user1_id.eq.${authUserId},user2_id.eq.${authUserId}`);
            if (error) throw error;
            return users;
        }

        async getByEmail(email) {
            if (!email) throw new TypeError("Email is required");
            const { data: userData, error: userError } = await supabase.from("users")
                .select("id, user_name, created_at, user_email")
                .eq("user_email", email)
                .single();
            if (userError) throw userError;
            return new User(privateConstructorKey, userData);
        }

        async update(info = {}) {}

        async delete() {}
    }

    static Repository = class UserRepository {
        constructor(key) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        }

        _authUser;
        _storage = new Map();
        _service = new User.Service(privateConstructorKey);

        async auth(email, password) {
            this._authUser = await User.Service.auth(email, password);
            this._storage.set(this._authUser.id, this._authUser);
            return this._authUser;
        }

        async get(id) {
            if (this._authUser.id === id) return this._authUser;
            if (this._storage.has(id)) return this._storage.get(id);
            let fetchUser = await this._service.get(id);
            if (fetchUser) {
                this._storage.set(fetchUser.id, fetchUser);
                return fetchUser;
            }
            return null;
        }

        async fetch(id) {
            let fetchUser = await this._service.get(id);
            if (fetchUser) {
                this._storage.set(fetchUser.id, fetchUser);
                return fetchUser;
            }
            return fetchUser ?? null;
        }

        getLocal(id) {
            return this._storage.get(id) ?? null;
        }

        async getRelateds() {
            if (!this._authUser) throw new Error("Not authenticated");
            const relatedUsers = await this._service.getRelateds(this._authUser);
            for (const user of relatedUsers) {
                this._storage.set(user.id, new User(privateConstructorKey, user));
            }
            return relatedUsers;
        }

        async getByEmail(email) {
            if (!email) throw new TypeError("Email is required");
            const inStorage = [...this._storage.values()].find(user => user.email === email);
            if (inStorage) return inStorage;
            const user = await this._service.getByEmail(email);
            if (user) {
                this._storage.set(user.id, user);
                return user;
            }
            return null;
        }

        static create() {
            return new User.Repository(privateConstructorKey);
        }
    }

    static Provider = class UserProvider {
        constructor(key) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        }
    }
}

class AuthUser extends User {
    constructor(key, session, auth, userData) {
        super(key, userData);
        this.session = session;
        this.auth = auth;
    }

    _session;
    _auth;
}

User.Auth = AuthUser;

export default User;