import { SendMessageBar } from 'components/SendMessageBar/SendMessageBar'
import { selectedPostActions } from 'store/slices/selectedPostSlice'
import { Status } from '../../models/LoadingStatus'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Comments } from '../Comments/Comments'
import { Loading } from '../UI/Loading/Loading'
import styles from './SelectedPost.module.scss'

const barClassNames = {
    form: styles.sendForm,
    emojiPicker: styles.emojiPicker,
    input: styles.commentInput,
    inputWrapper: styles.commentInputWrapper,
    sendBtn: styles.sendBtn,
    sendBtnText: styles.sendBtnText,
    sendBtnIcon: styles.sendBtnIcon,
    leftWrapper: styles.formLeftWrapper,
}

export function SelectedPostComments() {
    const { comments, commentsStatus } = useAppSelector((state) => state.selectedPost)
    const isGuest = useAppSelector((state) => state.user.isGuest)
    const dispatch = useAppDispatch()

    function renderComments() {
        if (commentsStatus === Status.loading) {
            return <Loading />
        }
        if (commentsStatus === Status.error) {
            return <h5>Ошибка, что-то пошло не так...</h5>
        }
        return <Comments className={styles.commentsWrapper} onCommentAvatarClicked={handleAvatarClick} comments={comments} />
    }

    function sendComment(message: string) {
        dispatch(selectedPostActions.sendComment(message))
    }

    function handleAvatarClick() {
        dispatch(selectedPostActions.toggle(false))
    }

    return (
        <>
            {renderComments()}
            {!isGuest && <SendMessageBar onSend={sendComment} classNames={barClassNames} />}
        </>
    )
}
