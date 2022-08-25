import React from 'react';

function Post({data}) {
    return (
        <div className="post">
            <img src={`${process.env.REACT_APP_API_URL}/${data.imageUrl}`} alt=""
                 className="post-img"/>
            <div className="post-info">
                <h5 className="post-info__title">{data.title}</h5>
                <div className="post-info-likes">
                    <img className="post-info-likes__img"
                         src="https://img.icons8.com/color/96/000000/like--v3.png" alt="like"/>
                    <p className="post-info-likes__counter">{data.likes.length}</p>
                </div>
            </div>
        </div>
    );
}

export default Post;