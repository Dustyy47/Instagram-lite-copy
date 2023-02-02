import styles from './LikeBtn.module.scss'

interface LikeBtnProps {
    isLiked: boolean
    likesCount: number
    onLike: React.MouseEventHandler
    className: string
}

export function LikeBtn(props: LikeBtnProps) {
    const { isLiked, likesCount, onLike, className } = props
    return (
        <div onClick={(e) => onLike(e)} className={`${styles.like} ${className}`}>
            <img
                className={!isLiked ? styles.image : styles.imageLiked}
                src="https://img.icons8.com/color/96/000000/like--v3.png"
                alt="like"
            />
            <p className={styles.counter}>{String(likesCount)}</p>
        </div>
    )
}
