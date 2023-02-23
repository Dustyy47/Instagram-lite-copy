import { SendMessageBar } from 'components/SendMessageBar/SendMessageBar'
import { fetchSendComment } from 'store/slices/extendedPostSlice'
import { Status } from '../../models/LoadingStatus'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Comments } from '../Comments/Comments'
import { Loading } from '../UI/Loading/Loading'
import styles from './SelectedPost.module.scss'

export function SelectedPostComments() {
    const { comments, commentsStatus } = useAppSelector((state) => state.extendedPost)
    const isGuest = useAppSelector((state) => state.user.isGuest)
    const dispatch = useAppDispatch()

    function renderComments() {
        if (commentsStatus === Status.loading) {
            return <Loading />
        }
        if (commentsStatus === Status.error) {
            return <h5>Ошибка, что-то пошло не так...</h5>
        }
        return <Comments comments={comments} />
    }

    function sendComment(message: string) {
        dispatch(fetchSendComment(message))
    }

    return (
        <div>
            {renderComments()}
            {!isGuest && <SendMessageBar onSend={sendComment} className={styles.sendForm} />}
        </div>
    )
}
