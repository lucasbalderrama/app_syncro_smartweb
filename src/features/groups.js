import { supabase } from "../../supabaseConfig";
import User from "./users.js";

const privateConstructorKey = Symbol("User.PrivateConstructorKey");

class Group {
    constructor(key, groupData) {
        if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        this.id = groupData.id;
        this.name = groupData.name;
        this.createdAt = new Date(groupData.created_at);
        this.createdBy = groupData.created_by;
    }

    static Service = class GroupService {
        constructor(key, authUser) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
            if (!authUser) throw new Error("Authentication required");
            this._authUser = authUser;
        }

        _authUser;
    }

    static Repository = class GroupRepository {
        constructor(key, authUser) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
            this._service = new Group.Service(key, authUser);
            this._authUser = authUser;

            this._messages; // repositorio de mensagens
            this._users = User.Repository.create();
            this._users._authUser = authUser;
        }

        _authUser;
        _service;
        _messages;
        _users;
    }

    static Provider = class GroupProvider {}
}

export default Group;