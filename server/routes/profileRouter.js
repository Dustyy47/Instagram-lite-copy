import {Router} from 'express'
import profileController from "../controllers/profileController.js";
import {checkAuth, getId} from "../utils/authChecker.js";
import {addPostValidations, checkValidation} from "../utils/validations.js";
export const profileRouter = new Router();

profileRouter.get('/:id',getId,profileController.getProfileData)
profileRouter.post('/posts',getId,checkAuth,profileController.addPost)
profileRouter.delete('/posts/:id',getId,checkAuth,profileController.deletePost);