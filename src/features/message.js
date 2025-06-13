import { supabase } from "../../supabaseConfig";

const privateConstructorKey = Symbol("User.PrivateConstructorKey");

class Message {
    constructor(key, messageData) {
        if (key !== privateConstructorKey) throw new TypeError("Private constructor");
        this.id = messageData.id;
        this.content = messageData.content;
        this.userId = messageData.user_id;
        this.createdAt = new Date(messageData.created_at);
        this.fkId = messageData.chat_id ?? messageData.group_id;
        this.fkTable = messageData.chat_id ? "chat_messages" : "group_messages";
    }

    static Service = class MessageService { }

    static Repository = class MessageRepository {}

    static Provider = class MessageProvider {}
}