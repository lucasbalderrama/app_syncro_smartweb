import { supabase } from "../../supabaseConfig";
import Message from "./messages.js";
import User from "./users.js";

const privateConstructorKey = Symbol("Chat.PrivateConstructorKey");

class Chat {
    constructor(key, chatData) {
        if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        this.id = chatData.id;
        this.createdAt = new Date(chatData.created_at);
        this.user1Id = chatData.user1_id;
        this.user2Id = chatData.user2_id;
    }

    static Service = class ChatService {
        constructor(key) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        }

        static async get(id) {
            if (!id) throw new TypeError("Chat ID is required");
            const { data, error } = await supabase.from("chats")
                .select("*")
                .eq("id", id)
                .single();
            if (error) throw error;
            return new Chat(privateConstructorKey, data);
        }

        async get(id) {
            return await Chat.Service.get(id);
        }

        // static async getRelateds(auth, id) {
        //     // if (!(auth instanceof User.Auth)) throw new TypeError("Invalid authentication object");
        //     // const { data: groups, error: groupsError } = await supabase.rpc("get_groups_by_user", { p_user_id: auth.id });
        //     // if (groupsError) throw groupsError;
        //     // if (id) {
        //     //     const group = groups.find(g => g.id === id);
        //     //     if (!group) throw new Error("Group not found");
        //     //     return new Group(privateConstructorKey, group);
        //     // } else {
        //     //     return groups.map(g => new Group(privateConstructorKey, g));
        //     // }
        // }
    }

    static Repository = class ChatRepository {
        constructor(key, authUser, id) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
            this._service = new Chat.Service(key);
            this._authUser = authUser;

            this._messages = Message.Repository.create(authUser, "chat_messages", "chat_id", id);
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
            return new Chat.Repository(privateConstructorKey, authUser, id);
        }   
    }
}

export default Chat;