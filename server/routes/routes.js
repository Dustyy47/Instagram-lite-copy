import {Router} from 'express'
export const router = new Router()
import {authRouter} from "./authRouter.js";
import {profileRouter} from "./profileRouter.js";
import {chatRouter} from "./chatRouter.js";

router.use('/auth',authRouter);
router.use('/profile',profileRouter);
router.use('/chat',chatRouter);