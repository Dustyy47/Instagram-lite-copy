import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {getPosts, getProfileInfo, likePost, subscribe} from "../../http/userApi";
import "./Profile.scss"
import ProfileInfo from "./ProfileInfo";
import Button from "../Button/Button";
import CreatingPost from "./CreatingPost";
import PostsList from "../Posts/PostsList";
import NotFound from "../Errors/NotFound";
import {useDispatch, useSelector} from "react-redux";
import Loading from "../Loading/Loading";

function Profile() {
    //console.log('rerender')
    const [isLoading, setLoading] = useState(true);
    const [isSubscribed, setSubscribe] = useState(true);

    const dispatch = useDispatch();
    const {likedPosts, subscribes} = useSelector(state => state.user);

    const {id: paramsId} = useParams()
    const [profileInfo, setProfileInfo] = useState(null)
    const [posts, setPosts] = useState([]);
    const [isCreatingPost, setCreatingPost] = useState(false);

    const fetchProfileData = async () => {
        setLoading(true);
        const profileInfo = await getProfileInfo(paramsId);
        const posts = await getPosts(paramsId);
        setProfileInfo(profileInfo);
        const res = !!subscribes.find(subscribe => subscribe === profileInfo.profileId)
        //console.log(res);
        setSubscribe(res);
        setPosts(posts);
        setLoading(false);
    }

    useEffect( () => {
    if(subscribes)
        fetchProfileData();
    }, [paramsId,subscribes])

    const toggleSubscribe = async () => {
        try {
            await subscribe(paramsId);
            setSubscribe(!isSubscribed);
        } catch (e) {
            console.log(e);
        }
    }

    const like = async (postId) => {
        await likePost(postId);
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
                        profileInfo.isUserProfile ?
                            <Button onClick={() => setCreatingPost(true)}>Создать пост</Button>
                            :
                            <div style = {{display:'flex',alignItems:'top'}}>
                            <Button style = {{margin: "0 20px"}}>Чат</Button>
                                {
                                    isSubscribed === true ?
                                        <Button onClick={toggleSubscribe}>Отписаться</Button>
                                        :
                                        <Button onClick={toggleSubscribe}>Подписаться</Button>
                                }
                            </div>


                    }
                </div>
                <PostsList likedPosts={likedPosts} posts={posts} onLike={like}/>
            </div>
            <CreatingPost isActive={isCreatingPost} setActive={setCreatingPost} onPostAdded={fetchProfileData}/>
        </section>
    );
}

export default Profile;
