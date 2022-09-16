import UserModel from "../Models/UserModel.js";
import PostModel from "../Models/PostModel.js";
import path from "path";
import {__dirname} from "../utils/directoryVariables.js";

class ProfileController {

    // profileId may be in two existing formats - /:id or /:nickName , like /123ASfs67dfSgsS or /someNickName
    // return data in format : {email,nickName,fullName,likedPosts,avatarUrl,isUserAuth,isUserProfile}
    async getProfileData(req, res) {
        try {
            const profileId = req.paramsId;
            const userId = req.userId;
            const isUserAuth = !!userId;
            const isUserProfile = profileId === userId;
            const user = await UserModel.findById(profileId);
            const {email, nickName, fullName, avatarUrl, subscribes, subscribers,} = user;
            res.json({
                profileId,
                email,
                nickName,
                fullName,
                avatarUrl,
                isUserAuth,
                subscribes,
                subscribers,
                isUserProfile
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что-то пошло не так, попробуйте позже..."});
        }
    }

    async getPosts(req, res) {
        const validId = req.paramsId;
        const posts = await PostModel.find({postedBy: validId});
        res.json(posts);
    }

    async getUserData(req, res) {
        try {
            const userId = req.userId;
            const user = await UserModel.findById(userId);
            const {email, nickName, fullName, avatarUrl, likedPosts, subscribes} = user;
            res.json({email, nickName, fullName, avatarUrl, likedPosts, subscribes})
        } catch (e) {
            console.log(e);
            res.status(500);
        }
    }

    async findUsers(req, res) {
        try {
            const name = req.params.name;
            const users = await UserModel.find({nickName: new RegExp(name, "i")}, null, {limit: 10});
            res.json(users);
        } catch (e) {
            console.log(e);
            res.status(500);
        }
    }

    async toggleSubscribe(req, res) {
        try {
            const userId = req.userId;
            const userToSubscribeId = req.paramsId;
            const activeUser = await UserModel.findById(userId);
            const isSubscribed = !!activeUser.subscribes.find(subscribe => subscribe.toString() === userToSubscribeId);
            if (isSubscribed) {
                await UserModel.findByIdAndUpdate(userToSubscribeId, {$pull: {subscribers: userId}});
                await UserModel.findByIdAndUpdate(userId, {$pull: {subscribes: userToSubscribeId}});
            } else {
                await UserModel.findByIdAndUpdate(userToSubscribeId, {$push: {subscribers: userId}});
                await UserModel.findByIdAndUpdate(userId, {$push: {subscribes: userToSubscribeId}});
            }
            res.json(200);
        } catch (e) {
            console.log(e);
            res.status(500);
        }
    }

    async addPost(req, res) {
        try {
            const userId = req.userId;
            const {title} = req.body;
            const {img} = req.files;
            const fileName = Date.now() + '--' + img.name;
            const types = ["jpg", "jpeg", "png"];
            if (types.indexOf(fileName.split('.').pop()) === -1) {
                return res.status(400).json({message: "Неверный формат файла"});
            }
            await img.mv(path.resolve(__dirname, '..', 'images', fileName));

            const post = await PostModel.create({title, postedBy: userId, imageUrl: fileName});
            res.json(post);
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что-то пошло не так, попробуйте позже..."});
        }
    }

    async deletePost(req, res) {
        try {
            const postId = req.params.id;
            const userId = req.userId;
            const post = await PostModel.findById(postId);
            if (!post) {
                return res.status(404).json({message: "Такого поста не существует"});
            }
            if (post.postedBy.toString() !== userId) {
                return res.status(400).json({message: "У вас нет доступа"});
            }
            await post.remove();

            res.json({message: "Пост был удалён!"});
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что-то пошло не так, попробуйте позже..."});
        }
    }

    async likePost(req, res) {
        try {
            const postId = req.params.id;
            const userId = req.userId;
            let post = await PostModel.findById(postId);
            const candidate = post.likes.find(like => like.toString() === userId);
            if (candidate) {
                await PostModel.findByIdAndUpdate(postId, {$pull: {likes: userId}});
                await UserModel.findByIdAndUpdate(userId, {$pull: {likedPosts: postId}});
            } else {
                await PostModel.findByIdAndUpdate(postId, {$push: {likes: userId}});
                await UserModel.findByIdAndUpdate(userId, {$push: {likedPosts: postId}});
            }
            console.log(post);
            res.json({message: post.likes})
        } catch (e) {
            console.log(e);
            res.status(500).json({message: "Что-то пошло не так, попробуйте позже..."});
        }
    }
}

export default new ProfileController()