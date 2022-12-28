import styles from './LikeBtn.module.scss'

export function LikeBtn({ isLiked, likesCount, onLike, ...props }) {
    return (
        <div className={`${styles.like} ${props?.className}`}>
            <img
                onClick={(e) => onLike(e)}
                className={!isLiked ? styles.image : styles.imageLiked}
                src="https://img.icons8.com/color/96/000000/like--v3.png"
                alt="like"
            />
            <p className={styles.counter}>{likesCount}</p>
        </div>
    )
}
