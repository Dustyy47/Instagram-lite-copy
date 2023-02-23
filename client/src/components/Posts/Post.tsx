import { PostLikeButton } from 'components/LikeBtn/PostLikeBtn'
import { PostModel } from '../../models/PostModel'
import { useAppDispatch } from '../../store/hooks'
import { fetchOpenPost } from '../../store/slices/extendedPostSlice'
import styles from './Post.module.scss'

interface PostProps {
    data: PostModel
}

export function Post({ data }: PostProps) {
    const { imageUrl, title } = data

    const dispatch = useAppDispatch()

    function handleClick() {
        dispatch(fetchOpenPost(data))
    }

    return (
        <div className={styles.wrapper} onClick={handleClick}>
            <img src={imageUrl} alt="Post" className={styles.preview} />
            <div className={styles.info}>
                <h5 className={styles.title}>{title}</h5>
                <PostLikeButton className={styles.likes} post={data} />
            </div>
        </div>
    )
}
