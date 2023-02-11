import styles from './LikeBtn.module.scss'

interface LikeBtnProps {
    isLiked: boolean
    likesCount: number
    onLike: React.MouseEventHandler
    className: string
}

export function LikeBtn({ isLiked, likesCount, onLike, className }: LikeBtnProps) {
    const imageClassName = styles.image + ' ' + (isLiked ? styles.imageLiked : styles.imageUnliked)
    return (
        <div onClick={(e) => onLike(e)} className={`${styles.like} ${className}`}>
            <img className={imageClassName} src="https://img.icons8.com/color/96/000000/like--v3.png" alt="like" />
            <p className={styles.counter}>{String(likesCount)}</p>
        </div>
    )
}
