import { supabase } from "../../supabaseConfig";

const privateConstructorKey = Symbol("User.PrivateConstructorKey");

class User {
    constructor(key, userData) {
        if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        this.id = userData.id;
        this.name = userData.name;
        this.email = userData.email;
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

        _authUser;

        async auth(email, password) {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            const { data: userData, error: userError } = await supabase.from("users")
                .select("id, name, created_at, email")
                .eq("id", authData.user.id)
                .single();
            if (userError) throw userError;
            const authUser = new AuthUser(privateConstructorKey, authData.session, authData.user, userData);
            this._authUser = authUser;
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
                .select("id, name, created_at, email")
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

        async get(id) {} // único para todos, o resto é para o do _authUser;

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
            this._authUser = await this._service.auth(email, password);
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