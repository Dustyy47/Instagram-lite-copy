import {Router} from 'express'
export const router = new Router()
import {authRouter} from "./authRouter.js";
import {profileRouter} from "./profileRouter.js";

router.use('/auth',authRouter);
router.use('/profile',profileRouter);
