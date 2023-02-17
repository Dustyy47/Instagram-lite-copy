import { useCallback, useEffect, useState } from 'react'
import { ClickPostCallback, LikePostCallback } from '../../models/CallbacksTypes'
import { PostModel } from '../../models/PostModel'
import { useAppSelector } from '../../store/hooks'
import { LikeBtn } from '../LikeBtn/LikeBtn'
import styles from './Post.module.scss'

interface PostProps {
    data: PostModel
    onLike: LikePostCallback
    isLiked: boolean
    onClick: ClickPostCallback
}

export function Post({ data, onLike, isLiked, onClick }: PostProps) {
    const { likes, _id, imageUrl, title } = data
    const [likesCountWithoutUser, setLikesCountWithoutUser] = useState<number>(0)

    const isGuest = useAppSelector((state) => state.user.isGuest)

    const like = useCallback(
        (e: React.MouseEvent) => {
            if (isGuest) return
            e.stopPropagation()
            onLike(_id)
        },
        [_id, onLike]
    )

    function handleClick() {
        onClick({ postData: data, likesCountWithoutUser, isActive: true })
    }

    useEffect(() => {
        setLikesCountWithoutUser(likes.length - +isLiked)
    }, [])

    return (
        <div className={styles.wrapper} onClick={handleClick}>
            <img src={imageUrl} alt="Post" className={styles.preview} />
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
