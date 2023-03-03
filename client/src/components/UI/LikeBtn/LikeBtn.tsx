import { FiHeart } from 'react-icons/fi'
import styles from './LikeBtn.module.scss'

interface LikeBtnProps {
    isLikedMe: boolean
    numLikes: number
    onLike: React.MouseEventHandler
    className: string
}

export function LikeBtn({ isLikedMe, numLikes, onLike, className }: LikeBtnProps) {
    return (
        <div onClick={(e) => onLike(e)} className={`${styles.like} ${className}`}>
            <FiHeart className={styles.image} data-isliked={isLikedMe} />
            <p className={styles.counter}>{String(numLikes)}</p>
        </div>
    )
}
