
export type OnlineUser = {
    userId: string;
    socketId: string;
}

export type NewMessage = {
    chat_room: string;
    content: any;
}

export class LastMessage{
    user_id: string;
    message: {
        type: string;
        content: string;
        time: string;
    }
}

export interface NewConversation{
    partnerId: string;
    conversationId: string;
}