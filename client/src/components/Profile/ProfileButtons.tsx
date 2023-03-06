import { memo } from 'react'
import { RiAddCircleLine, RiChat4Line, RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { useAppSelector } from '../../store/hooks'
import { Button } from '../UI/Button/Button'
import styles from './ProfileButtons.module.scss'
//TODO Добавить Loader при подписке

interface ProfileButtonsProps {
    setCreatingPost: (value: boolean) => any
    toggleSubscribe: () => any
}

export const ProfileButtons = memo(function ProfileButtons({ setCreatingPost, toggleSubscribe }: ProfileButtonsProps) {
    let { profileInfo } = useAppSelector((state) => state.profile)
    const { owner, isUserProfile = false } = profileInfo || {}

    return isUserProfile ? (
        <Button className={styles.button} onClick={() => setCreatingPost(true)}>
            <span className={styles.buttonText}>Создать пост</span>
            <RiAddCircleLine className={styles.buttonIcon} />
        </Button>
    ) : (
        <div className={styles.communicateButtons}>
            <Button className={styles.button} onClick={() => {}}>
                <span className={styles.buttonText}>Чат</span>
                <RiChat4Line className={styles.buttonIcon} />{' '}
            </Button>
            {owner?.isActiveUserFollowing ? (
                <Button className={styles.unfollowButton + ' ' + styles.button} onClick={toggleSubscribe}>
                    <span className={styles.buttonText}>Подписан</span>
                    <RiUserFollowLine className={styles.buttonIcon} />
                </Button>
            ) : (
                <Button className={styles.button} onClick={toggleSubscribe}>
                    <span className={styles.buttonText}>Подписаться</span>
                    <RiUserUnfollowLine className={styles.buttonIcon} />
                </Button>
            )}
        </div>
    )
})
