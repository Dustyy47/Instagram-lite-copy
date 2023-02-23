import { FiHeart } from 'react-icons/fi'
import styles from './LikeBtn.module.scss'

interface LikeBtnProps {
    isLiked: boolean
    likesCount: number
    onLike: React.MouseEventHandler
    className: string
}

export function LikeBtn({ isLiked, likesCount, onLike, className }: LikeBtnProps) {
    return (
        <div onClick={(e) => onLike(e)} className={`${styles.like} ${className}`}>
            <FiHeart className={styles.image} data-isliked={isLiked} />
            <p className={styles.counter}>{String(likesCount)}</p>
        </div>
    )
}
