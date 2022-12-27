import React from 'react';
import Post from "./Post";
import {isPostLiked} from "../../utils/isLikedPost";

function PostsList({posts,onLike,likedPosts,onClickPost}) {

    return (
        <div className="page-content">
            {
                posts?
                    posts.map(post => (
                        <Post onClick={onClickPost} isLiked = {isPostLiked(post._id,likedPosts)} onLike={onLike} key={post._id} data={post}/>
                    ))
                    :
                    "Нет постов"
            }
        </div>
    );
}

export default PostsList;