import UserModel from "../Models/UserModel.js";
import MessageModel from "../Models/MessageModel.js";
import ConversationModel from "../Models/ConversationModel.js";

class ChatController {
    async createConversation(req, res) {
        try {
            const companionId = req.paramsId;
            const userId = req.userId;
            let user = await UserModel.findById(userId).populate('conversations');
            for (let conversation of user.conversations) {
                if (conversation.companions.includes(companionId)) {
                    return res.status(400).json({message: "Чат с таким пользователем уже был создан"})
                }
            }

            const companion = await UserModel.findById(companionId);
            const conversation = await ConversationModel.create({
                companions: [companionId, userId],
                messages: [],
            })

            await user.updateOne({$push: {conversations: conversation._id}});
            await companion.updateOne({$push: {conversations: conversation._id}});

            res.json({message: "Чат с id " + conversation._id + " Успешно создана!"});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что-то пошло не так, попробуйте позже..."});
        }
    }

    async getConversations(req, res) {
        try {
            const userId = req.userId;
            const {conversations} = await UserModel.findById(userId);
            const populatedConversations = [];
            for (let id of conversations) {
                let conversation = await ConversationModel.findById(id);
                console.log(conversation)
                let companions = [];
                for (let companionId of conversation.companions) {
                    const {_id, fullName, nickName, avatarUrl} = await UserModel.findById(companionId);
                    if (_id.toString() !== userId)
                        companions.push({_id, fullName, nickName, avatarUrl});
                }
                const lastMessage = await MessageModel.findById(conversation.messages[conversation.messages.length - 1]);
                const {_id} = conversation;
                populatedConversations.push({_id, lastMessage, companions});
            }
            res.json(populatedConversations);
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что-то пошло не так, попробуйте позже..."});
        }
    }

    async getConversation(req, res) {
        try {
            const conversationId = req.params.conversationId;
            const populatedMessages = [];
            const {messages,companions} = await ConversationModel.findById(conversationId);
            for(let message of messages){
                let populatedMessage = await MessageModel.findById(message).populate('author');
                let {_id,nickName,fullName,avatarUrl} = populatedMessage.author;
                populatedMessages.push({_id:populatedMessage._id,text:populatedMessage.text,author:{_id,nickName,fullName,avatarUrl}});
            }
            res.json({messages:populatedMessages});

        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что-то пошло не так, попробуйте позже..."});
        }
    }

    async sendMessage(req, res) {
        try {
            const conversationId = req.params.conversationId;
            const userId = req.userId;
            const {message: messageText} = req.body;
            const user = await UserModel.findById(userId);
            if (user.conversations.find(conversation => conversation.toString() === conversationId) === -1) {
                return res.status(404).json({message: "Такой беседы нет"})
            }
            const message = await MessageModel.create({text: messageText, author: userId});
            const conversation = await ConversationModel.findByIdAndUpdate(conversationId, {
                $push: {
                    messages: message._id
                }
            }).populate('messages');
            res.json(conversation);

        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что-то пошло не так, попробуйте позже..."});
        }
    }
}

export default new ChatController();