import UserModel from "../Models/UserModel.js";

// Convert id from params if it`s format is nickname to default ID format and set into req.validProfileID (set nickname to ID format)
export const validateParamsId = async (req, res, next) => {
    try {
        const profileId = req.params.id; // id of profile what user are trying to get
        let candidate = await UserModel.findOne({nickName: profileId});
        if (candidate == null)
            candidate = await UserModel.findById(profileId);
        req.validProfileID = candidate?._id.toString();
        next();
    } catch (e) {
        console.log(e);
        res.status(500).json({message: "Что-то пошло не так, попробуйте позже..."});
    }

}