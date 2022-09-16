import {Router} from 'express'
import {checkAuth, getUserId} from "../utils/authChecker.js";
import chatController from "../controllers/chatController.js";
import {validateParamsId} from "../utils/validateParamsId.js";
export const chatRouter = new Router()

chatRouter.post('/:id',getUserId,checkAuth,validateParamsId,chatController.createConversation);
chatRouter.put('/:conversationId',getUserId,checkAuth,chatController.sendMessage);
chatRouter.get('/:conversationId',getUserId,checkAuth,chatController.getConversation);
chatRouter.get('/',getUserId,checkAuth,chatController.getConversations)