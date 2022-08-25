import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {addPost, getProfileData} from "../../http/userApi";
import "./Profile.scss"
import ProfileInfo from "./ProfileInfo";
import Post from "./Post";
import Button from "../Button/Button";
import CreatingPost from "./CreatingPost";

function Profile(props) {

    const {id} = useParams()
    const [data, setData] = useState({})

    const [isCreatingPost, setCreatingPost] = useState(false);

    const fetchProfileData = useCallback(async () => {
        const data = await getProfileData(id);
        setData(data)
    }, [data, id])

    useEffect(() => {
        fetchProfileData().then(()=>{
            console.log(data);
        });
    }, [id])

    if(!data){
        return (
            <div className="not-found">
                <h1 className="not-found__title">
                    404
                </h1>
                <p className="not-found__text">
                    Данный пользователь не найден
                </p>
            </div>
        )
    }

    if (!data.profileInfo) {
        return (
            "Загрузка"
        )
    }

    return (
        <section className="page">
            <div className="page-wrapper">
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <ProfileInfo fullName={data.profileInfo.fullName || ""} email={data.profileInfo.email || ""}
                                 avatarUrl={`${process.env.REACT_APP_API_URL}/avatars/${data.profileInfo.avatarUrl}`}/>
                    {
                        data.profileInfo.isUserPage &&
                        <Button onClick={() => setCreatingPost(true)}>Создать пост</Button>
                    }
                </div>
                <div className="page-content">
                    {
                        data.posts.length !== 0 ?
                            data.posts.map(post => (
                                <Post key={post._id} data={post}/>
                            ))
                            :
                            "Нет постов"
                    }
                </div>
            </div>
            <CreatingPost isActive = {isCreatingPost} setActive = {setCreatingPost} onPostAdded={fetchProfileData}/>
        </section>
    );
}

export default Profile;
