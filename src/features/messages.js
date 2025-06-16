import { supabase } from "../../supabaseConfig";
import User from "./users.js";

const privateConstructorKey = Symbol("Message.PrivateConstructorKey");

class Message {
    constructor(key, messageData) {
        if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        this.id = messageData.id;
        this.userId = messageData.user_id;
        this.fkId = messageData.chat_id ?? messageData.group_id;
        this.content = messageData.content;
        this.createdAt = new Date(messageData.created_at);
    }

    static Service = class MessageService {
        constructor(key, fkTable, fkColumn, fkId, authUser) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
            this._fkTable = fkTable;
            this._fkColumn = fkColumn;
            this._fkId = fkId;
            if (!(authUser instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            this._authUser = authUser;
        }

        async load(fkId) {
            if (!fkId) throw new TypeError("Foreign key ID is required");
            const { data, error } = await supabase.from(this._fkTable)
                .select("*")
                .eq(this._fkColumn, fkId)
                .order("created_at", { ascending: true });
            if (error) throw error;
            return data.map(msg => new Message(privateConstructorKey, msg));
        }

        async get(id) {
            if (!id) throw new TypeError("Message ID is required");
            const { data, error } = await supabase.from(this._fkTable)
                .select("*")
                .eq("id", id)
                .single();
            if (error) throw error;
            return new Message(privateConstructorKey, data);
        }

        async send(content) {
            if (!content || typeof content !== "string") throw new TypeError("Content must be a non-empty string");
            console.log();
            const { data, error } = await supabase.from(this._fkTable)
                .insert({ content, user_id: this._authUser.id, [this._fkColumn]: this._fkId })
                .select("*")
                .single();
            if (error) throw error;
            return new Message(privateConstructorKey, data);
        }

        async listen(fkId, callback) {
            if (!fkId) throw new TypeError("Foreign key ID is required");
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");

            const channel = supabase.channel(`${this._fkTable}:${fkId}`)
                .on("postgres_changes", { event: "INSERT", schema: "public", table: this._fkTable }, payload => {
                    if (payload.new[this._fkColumn] !== fkId) return;
                    const message = new Message(privateConstructorKey, payload.new);
                    callback(message);
                })
                .subscribe();

            return channel;
        }
    }

    static Repository = class MessageRepository {
        constructor(key, authUser, fkTable, fkColumn, fkId) {
            if (key !== privateConstructorKey) throw new TypeError("Private constructor");
            if (!(authUser instanceof User.Auth)) throw new TypeError("Invalid authentication object");
            this._service = new Message.Service(key, fkTable, fkColumn, fkId, authUser);
            this._authUser = authUser;
        }

        _authUser;
        _service;
        _messages = new Map();

        async load(fkId) {
            if (!fkId) throw new TypeError("Foreign key ID is required");
            const messages = await this._service.load(fkId);
            for (const message of messages) {
                this._messages.set(message.id, message);
            }
            return messages;
        }

        async fetch(id) {
            const message = await this._service.get(id);
            return message;
        }

        async getLocal(id) {
            if (this._messages.has(id)) {
                return this._messages.get(id);
            }
            return null;
        }

        async get(id) {
            if (this._messages.has(id)) {
                return this._messages.get(id);
            }
            const message = await this._service.get(id);
            if (message) {
                this._messages.set(message.id, message);
                return message;
            }
            return null;
        }

        async listen(fkId, callback) {
            return await this._service.listen(fkId, (message) => {
                this._messages.set(message.id, message);
                if (typeof callback !== "function") throw new TypeError("Callback must be a function");
                callback(message);
            });
        }

        async send(content) {
            if (!content || typeof content !== "string") throw new TypeError("Content must be a non-empty string");
            const message = await this._service.send(content);
            console.log(message);;
            this._messages.set(message.id, message);
            return message;
        }

        static create(authUser, fkTable, fkColumn, fkId) {
            return new Message.Repository(privateConstructorKey, authUser, fkTable, fkColumn, fkId);
        }
    }

    static Provider = class MessageProvider {}
}

export default Message;