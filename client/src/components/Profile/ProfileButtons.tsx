import { createConversation, CreateConversationRequestBody } from 'http/chatApi'
import { memo } from 'react'
import { RiAddCircleLine, RiChat4Line, RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { profileActions } from 'store/slices/profileSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { Button } from '../UI/Button/Button'
import styles from './ProfileButtons.module.scss'

interface ProfileButtonsProps {
    setCreatingPost: (value: boolean) => any
}
const socket = new WebSocket('ws://127.0.0.1:8000/v1/conversations/10/ws', `Bearer_${localStorage.getItem('token')}`)

export const ProfileButtons = memo(function ProfileButtons({ setCreatingPost }: ProfileButtonsProps) {
    let { profileInfo } = useAppSelector((state) => state.profile)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { owner, isUserProfile = false } = profileInfo || {}

    async function toggleFollow() {
        dispatch(profileActions.follow(owner?.userID || 0))
    }

    async function openChat() {
        const requestBody: CreateConversationRequestBody = {
            secondUserID: owner?.userID || 0,
        }
        const conversationID = await createConversation(requestBody)
        navigate('/chat/')
        // const socket = new WebSocket(`ws://127.0.0.1:8000/v1/conversations/${conversationID}/ws`)
    }

    return isUserProfile ? (
        <Button className={styles.button} onClick={() => setCreatingPost(true)}>
            <span className={styles.buttonText}>Создать пост</span>
            <RiAddCircleLine className={styles.buttonIcon} />
        </Button>
    ) : (
        <div className={styles.communicateButtons}>
            <Button className={styles.button} onClick={openChat}>
                <span className={styles.buttonText}>Чат</span>
                <RiChat4Line className={styles.buttonIcon} />{' '}
            </Button>
            {owner?.isActiveUserFollowing ? (
                <Button className={styles.unfollowButton + ' ' + styles.button} onClick={toggleFollow}>
                    <span className={styles.buttonText}>Подписан</span>
                    <RiUserFollowLine className={styles.buttonIcon} />
                </Button>
            ) : (
                <Button className={styles.button} onClick={toggleFollow}>
                    <span className={styles.buttonText}>Подписаться</span>
                    <RiUserUnfollowLine className={styles.buttonIcon} />
                </Button>
            )}
        </div>
    )
})
