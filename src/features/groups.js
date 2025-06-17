import { supabase } from "../../supabaseConfig";
import Message from "./messages.js";
import User from "./users.js";

const privateConstructorKey = Symbol("Group.PrivateConstructorKey");

class Group {
    constructor(key, groupData) {
        if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        this.id = groupData.id;
        this.name = groupData.name;
        this.createdAt = new Date(groupData.created_at);
        this.createdBy = groupData.created_by;
    }

    static Service = class GroupService {
        constructor(key) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        }

        async get(id) {
            if (!id) throw new TypeError("Group ID is required");
            const { data, error } = await supabase.from("groups")
                .select("*")
                .eq("id", id)
                .single();
            if (error) throw error;
            return new Group(privateConstructorKey, data);
        }

        static async getRelateds(auth, id) {
            if (!(auth instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            const { data: groups, error: groupsError } = await supabase.rpc("get_groups_by_user", { p_user_id: auth.id });
            if (groupsError) throw groupsError;
            if (id) {
                const group = groups.find(g => g.id === id);
                if (!group) throw new Error("Group not found");
                return new Group(privateConstructorKey, group);
            } else {
                return groups.map(g => new Group(privateConstructorKey, g));
            }
        }
    }

    static Repository = class GroupRepository {
        constructor(key, authUser, id) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
            this._service = new Group.Service(key);
            this._authUser = authUser;

            this._messages = Message.Repository.create(authUser, "group_messages", "group_id", id);
            this._users = User.Repository.create();
            this._users._authUser = authUser;
            this.id = id;
        }

        _authUser;
        _service;
        _messages;
        _users;
        id;

        async loadMessages() {
            if (!this._authUser || !(this._authUser instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            if (!(this._authUser instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            return await this._messages.load(this.id);
        }

        async sendMessage(content) {
            if (!(this._authUser instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            if (!content || typeof content !== "string") throw new TypeError("Content must be a non-empty string");
            return await this._messages.send(content);;
        }

        async getMessage(id) {
            if (!(this._authUser instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            return await this._messages.get(id);
        }

        async listenMessages(callback) {
            if (!(this._authUser instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            return await this._messages.listen(this.id, callback);
        }

        async getUser(id) {
            if (!(this._authUser instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            return await this._users.get(id);
        }

        static create(authUser, id) {
            if (!(authUser instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            return new Group.Repository(privateConstructorKey, authUser, id);
        }   
    }

    static Provider = class GroupProvider {}
}

export default Group;