import React from 'react';
import Post from "./Post";

function PostsList({posts,onLike,likedPosts}) {
    const isLiked = postId=>{
        if(!likedPosts)
            return false;
        return likedPosts.indexOf(postId) !== -1;
    }
    return (
        <div className="page-content">
            {
                posts?
                    posts.map(post => (
                        <Post hasAlreadyLiked = {isLiked(post._id)} onLike={onLike} key={post._id} data={post}/>
                    ))
                    :
                    "Нет постов"
            }
        </div>
    );
}

export default PostsList;