import { useEffect, useState } from 'react'
import { LikeBtn } from '../LikeBtn/LikeBtn'
import '../Profile/Profile.scss'

export function Post({ data, onLike, isLiked, onClick }) {
    const [likesCountWithoutUser, setLikesCountWithoutUser] = useState()

    const like = (e) => {
        e.stopPropagation()
        onLike(data._id)
    }

    console.log('render post')

    useEffect(() => {
        setLikesCountWithoutUser(data.likes.length - +isLiked)
    }, [])

    return (
        <div className="post" onClick={() => onClick({ ...data, likesCountWithoutUser })}>
            <img
                src={`${process.env.REACT_APP_API_URL}/${data.imageUrl}`}
                alt=""
                className="post-img"
            />
            <div className="post-info">
                <h5 className="post-info__title">{data.title}</h5>
                <LikeBtn
                    className="post-info-likes"
                    onLike={like}
                    likesCount={likesCountWithoutUser + +isLiked}
                    isLiked={isLiked}
                />
            </div>
        </div>
    )
}
