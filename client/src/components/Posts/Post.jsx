import React, {useState} from 'react';
import '../Profile/Profile.scss'

function Post({data,onLike,hasAlreadyLiked}) {
    const [isLiked,setLiked] = useState(hasAlreadyLiked);
    const like = id=>{
        setLiked(!isLiked);
        onLike(id);
    }
    return (
        <div className="post">
            <img src={`${process.env.REACT_APP_API_URL}/${data.imageUrl}`} alt=""
                 className="post-img"/>
            <div className="post-info">
                <h5 className="post-info__title">{data.title}</h5>
                <div className="post-info-likes">
                    <img onClick = {()=>like(data._id)} className={`post-info-likes__img ${isLiked ? "post-info-likes__img--liked" : "" }`}
                         src="https://img.icons8.com/color/96/000000/like--v3.png" alt="like"/>
                    <p className="post-info-likes__counter">{data.likes.length + (isLiked ? 1 : 0) - (hasAlreadyLiked ? 1 : 0)}</p>
                </div>
            </div>
        </div>
    );
}

export default Post;