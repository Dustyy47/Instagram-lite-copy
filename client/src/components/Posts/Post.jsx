import { useEffect, useState } from 'react'
import { LikeBtn } from '../LikeBtn/LikeBtn'
import styles from './Post.module.scss'

export function Post({ data, onLike, isLiked, onClick }) {
    const { likes, _id, imageUrl, title } = data
    const [likesCountWithoutUser, setLikesCountWithoutUser] = useState()

    const like = (e) => {
        e.stopPropagation()
        onLike(_id)
    }

    useEffect(() => {
        setLikesCountWithoutUser(likes.length - +isLiked)
    }, [])

    return (
        <div className={styles.wrapper} onClick={() => onClick({ ...data, likesCountWithoutUser })}>
            <img
                src={`${process.env.REACT_APP_API_URL}/${imageUrl}`}
                alt=""
                className={styles.preview}
            />
            <div className={styles.info}>
                <h5 className={styles.title}>{title}</h5>
                <LikeBtn
                    className={styles.likes}
                    onLike={like}
                    likesCount={likesCountWithoutUser + +isLiked}
                    isLiked={isLiked}
                />
            </div>
        </div>
    )
}
