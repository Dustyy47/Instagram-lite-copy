import { FiHeart } from 'react-icons/fi'
import styles from './LikeBtn.module.scss'

export interface LikeBtnClassNames {
    wrapper?: string
    icon?: string
    counter?: string
}
interface LikeBtnProps {
    isLikedMe: boolean
    numLikes: number
    onLike: React.MouseEventHandler
    classNames?: LikeBtnClassNames
}

export function LikeBtn({ isLikedMe, numLikes, onLike, classNames }: LikeBtnProps) {
    return (
        <div onClick={(e) => onLike(e)} className={`${styles.like} ${classNames?.wrapper}`}>
            <FiHeart className={`${styles.image} ${classNames?.icon}`} data-isliked={isLikedMe} />
            <p className={`${styles.counter} ${classNames?.counter}`}>{String(numLikes)}</p>
        </div>
    )
}
