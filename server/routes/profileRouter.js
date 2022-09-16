import {Router} from 'express'
import profileController from "../controllers/profileController.js";
import {checkAuth, getUserId} from "../utils/authChecker.js";
import {validateParamsId} from "../utils/validateParamsId.js";

export const profileRouter = new Router();

profileRouter.get('/find/:name', profileController.findUsers)
profileRouter.get('/me', getUserId, profileController.getUserData)
profileRouter.get('/:id', getUserId, validateParamsId, profileController.getProfileData)
profileRouter.put('/:id/subscribe', getUserId, validateParamsId, profileController.toggleSubscribe)
profileRouter.get('/:id/posts', getUserId, validateParamsId, profileController.getPosts)
profileRouter.post('/posts', getUserId, checkAuth, profileController.addPost)
profileRouter.delete('/posts/:id', getUserId, checkAuth, profileController.deletePost);
profileRouter.put('/posts/:id', getUserId, checkAuth, profileController.likePost);