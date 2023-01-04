import { useEffect, useState } from 'react'
import { LikeBtn } from '../LikeBtn/LikeBtn'
import '../Profile/Profile.scss'

export function Post({ data, onLike, isLiked, onClick }) {
    const { likes, _id, imageUrl, title } = data
    const [likesCountWithoutUser, setLikesCountWithoutUser] = useState()

    const like = (e) => {
        e.stopPropagation()
        onLike(_id)
    }

    console.log('render post')

    useEffect(() => {
        setLikesCountWithoutUser(likes.length - +isLiked)
    }, [])

    return (
        <div className="post" onClick={() => onClick({ ...data, likesCountWithoutUser })}>
            <img src={`${process.env.REACT_APP_API_URL}/${imageUrl}`} alt="" className="post-img" />
            <div className="post-info">
                <h5 className="post-info__title">{title}</h5>
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
