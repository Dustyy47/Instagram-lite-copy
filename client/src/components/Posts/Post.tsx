import { MouseEvent, useEffect, useState } from 'react'
import { PostModel } from '../../models/PostModel'
import { LikeBtn } from '../LikeBtn/LikeBtn'
import styles from './Post.module.scss'

interface PostProps {
    data: PostModel
    onLike: (_id: number) => {}
    isLiked: boolean
    onClick: (data: PostModel, likesCountWithoutUser: number) => {}
}

export function Post(props: PostProps) {
    const { data, onLike, isLiked, onClick } = props
    const { likes, _id, imageUrl, title } = data

    const [likesCountWithoutUser, setLikesCountWithoutUser] = useState<number>(0)

    const like = (e: MouseEvent<Element, MouseEvent>) => {
        e.stopPropagation()
        onLike(_id)
    }

    useEffect(() => {
        setLikesCountWithoutUser(likes.length - +isLiked)
    }, [])

    return (
        <div className={styles.wrapper} onClick={() => onClick(data, likesCountWithoutUser)}>
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
