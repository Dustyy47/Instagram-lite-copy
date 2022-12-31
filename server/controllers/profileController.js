import path from "path";
import CommentModel from "../Models/CommentModel.js";
import PostModel from "../Models/PostModel.js";
import UserModel from "../Models/UserModel.js";
import { __dirname } from "../utils/directoryVariables.js";

const DEFAULT_LIMIT = 10;
const DEFAULT_SKIP = 0;

class ProfileController {
  // profileId may be in two existing formats - /:id or /:nickName , like /123ASfs67dfSgsS or /someNickName
  // return data in format : {email,nickName,fullName,likedPosts,avatarUrl,isUserAuth,isUserProfile}
  async getProfileData(req, res) {
    try {
      const profileId = req.validProfileID;
      const userId = req.userId;
      const isUserAuth = !!userId;
      const isUserProfile = profileId === userId;
      const user = await UserModel.findById(profileId);
      const { email, nickName, fullName, avatarUrl, subscribes, subscribers } =
        user;
      res.json({
        profileId,
        email,
        nickName,
        fullName,
        avatarUrl,
        isUserAuth,
        subscribes,
        subscribers,
        isUserProfile,
      });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Что-то пошло не так, попробуйте позже..." });
    }
  }

  async getPosts(req, res) {
    const validId = req.validProfileID;
    const posts = await PostModel.find({ postedBy: validId });
    res.json(posts);
  }

  async getUserData(req, res) {
    try {
      const userId = req.userId;
      if (userId == null) {
        res
          .status(500)
          .json("Ошибка получения пользователя. Пользователь не авторизован");
        return;
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        res
          .status(404)
          .json("Ошибка получения пользователя. Пользователя с таким id нет");
        return;
      }
      const { email, nickName, fullName, avatarUrl, likedPosts, subscribes } =
        user;
      res.json({
        email,
        nickName,
        fullName,
        avatarUrl,
        likedPosts,
        subscribes,
      });
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  }

  async getComments(req, res) {
    try {
      const postId = req.params.id;
      const comments = await CommentModel.find({ post: postId }).populate(
        "author",
        ["fullName", "nickName", "avatarUrl", "_id"]
      );
      console.log(comments);
      res.json(comments);
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  }

  async findUsers(req, res) {
    try {
      let limit =
        req.query.limit === undefined ? DEFAULT_LIMIT : req.query.limit;
      const skip = req.query.skip === undefined ? DEFAULT_SKIP : req.query.skip;
      const name = req.params.name;
      console.log(limit, skip, name);
      let users = await UserModel.find({ nickName: new RegExp(name, "i") })
        .skip(skip)
        .limit(limit);
      users = users?.map((user) => {
        const {
          nickName,
          fullName,
          avatarUrl,
          subscribes,
          _id: profileId,
        } = user;
        return { nickName, fullName, avatarUrl, subscribes, profileId };
      });
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(500);
    }
  }

  async toggleSubscribe(req, res) {
    try {
      const userId = req.userId;
      const userToSubscribeId = req.validProfileID;
      const activeUser = await UserModel.findById(userId);
      const isSubscribed = !!activeUser.subscribes.find(
        (subscribe) => subscribe.toString() === userToSubscribeId
      );
      if (isSubscribed) {
        await UserModel.findByIdAndUpdate(userToSubscribeId, {
          $pull: { subscribers: userId },
        });
        await UserModel.findByIdAndUpdate(userId, {
          $pull: { subscribes: userToSubscribeId },
        });
      } else {
        await UserModel.findByIdAndUpdate(userToSubscribeId, {
          $push: { subscribers: userId },
        });
        await UserModel.findByIdAndUpdate(userId, {
          $push: { subscribes: userToSubscribeId },
        });
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
      const { title, description } = req.body;
      const { img } = req.files;
      const fileName = Date.now() + "--" + img.name;
      const types = ["jpg", "jpeg", "png"];
      if (types.indexOf(fileName.split(".").pop()) === -1) {
        return res.status(400).json({ message: "Неверный формат файла" });
      }
      await img.mv(path.resolve(__dirname, "..", "images", fileName));

      const post = await PostModel.create({
        title,
        description,
        postedBy: userId,
        imageUrl: fileName,
      });
      res.json(post);
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Что-то пошло не так, попробуйте позже..." });
    }
  }

  async deletePost(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Такого поста не существует" });
      }
      if (post.postedBy.toString() !== userId) {
        return res.status(400).json({ message: "У вас нет доступа" });
      }
      await post.remove();

      res.json({ message: "Пост был удалён!" });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Что-то пошло не так, попробуйте позже..." });
    }
  }

  async likePost(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.userId;
      let post = await PostModel.findById(postId);
      const candidate = post.likes.find((like) => like.toString() === userId);
      if (candidate) {
        await PostModel.findByIdAndUpdate(postId, { $pull: { likes: userId } });
        await UserModel.findByIdAndUpdate(userId, {
          $pull: { likedPosts: postId },
        });
      } else {
        await PostModel.findByIdAndUpdate(postId, { $push: { likes: userId } });
        await UserModel.findByIdAndUpdate(userId, {
          $push: { likedPosts: postId },
        });
      }
      console.log(post);
      res.json({ message: post.likes });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Что-то пошло не так, попробуйте позже..." });
    }
  }

  async sendComment(req, res) {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    const post = await PostModel.findById(postId);
    const comment = await CommentModel.create({ text, author: user, post });
    await post.updateOne({ $push: { comments: comment } });
    res.json({ message: comment });
  }
}

export default new ProfileController();
