import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {getPosts, getProfileInfo, likePost, subscribe} from "../../http/userApi";
import "./Profile.scss"
import ProfileInfo from "./ProfileInfo";
import CreatingPost from "./CreatingPost";
import PostsList from "../Posts/PostsList";
import NotFound from "../Errors/NotFound";
import {useDispatch, useSelector} from "react-redux";
import Loading from "../Loading/Loading";
import ProfileButtons from "./ProfileButtons";
import {fetchLikePost, fetchUserData} from "../../store/userSlice";
import ExtendedPost from "../Posts/ExtendedPost";
import {isPostLiked} from "../../utils/isLikedPost";

function Profile() {
    const [isLoading, setLoading] = useState(true);
    const [isSubscribed, setSubscribe] = useState(true);
    const [profileInfo, setProfileInfo] = useState(null)
    const [posts, setPosts] = useState([]);
    const [isCreatingPost, setCreatingPost] = useState(false);
    const [extendedPostData, setExtendedPostData] = useState(undefined)
    const [isExtendedPostOpen, setExtendedPostOpen] = useState(false)

    const {likedPosts, subscribes: userSubscribes, isGuest, loadingStatus} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const {id: profileId} = useParams()

    const fetchProfileData = async () => {
        setLoading(true);
        try {
            const profileInfo = await getProfileInfo(profileId);
            if (!profileInfo) {
                setLoading(false);
                return;
            }
            const posts = await getPosts(profileId);
            document.title = profileInfo.fullName;
            setProfileInfo(profileInfo);
            if (userSubscribes === null && !isGuest) {
                return;
            }
            const isUserSubscribedOnProfile = isGuest ? false : !!userSubscribes.find(subscribe => subscribe === profileInfo.profileId);
            setSubscribe(isUserSubscribedOnProfile);
            setPosts(posts);
            setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchProfileData();
    }, [profileId, userSubscribes])

    const toggleSubscribe = async () => {
        try {
            await subscribe(profileId);
            await dispatch(fetchUserData());
            setSubscribe(!isSubscribed);
        } catch (e) {
            console.log(e);
        }
    }

    const handlePostClick = async (data) => {
        setExtendedPostData(data);
        setExtendedPostOpen(true);
    }

    const like = async (postId) => {
        await dispatch(fetchLikePost(postId));
    }

    if (isLoading) {
        return (
            <Loading/>
        )
    }

    if (!profileInfo) {
        return (
            <NotFound/>
        )
    }

    return (
        <section className="page">
            <div className="page-wrapper">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <ProfileInfo fullName={profileInfo.fullName || ""} email={profileInfo.email || ""}
                                 avatarUrl={`${process.env.REACT_APP_API_URL}/avatars/${profileInfo.avatarUrl}`}
                                 subscribesId={profileInfo.subscribes}
                                 subscribersId={profileInfo.subscribers}
                    />
                    {
                        !isGuest &&
                        <ProfileButtons isUserProfile={profileInfo.isUserProfile}
                                        isSubscribed={isSubscribed}
                                        setCreatingPost={setCreatingPost}
                                        toggleSubscribe={() => toggleSubscribe()}
                        />
                    }
                </div>
                <PostsList likedPosts={likedPosts} posts={posts} onLike={like} onClickPost={handlePostClick}/>
            </div>
            <ExtendedPost authorInfo={profileInfo} postData={extendedPostData} isActive={isExtendedPostOpen}
                          setActive={() => setExtendedPostOpen(false)}
                          likeInfo={{
                              onLike: like,
                              isLiked : isPostLiked(extendedPostData?._id,likedPosts),
                          }}/>
            <CreatingPost isActive={isCreatingPost} setActive={setCreatingPost} onPostAdded={fetchProfileData}/>
        </section>
    );
}

export default Profile;
