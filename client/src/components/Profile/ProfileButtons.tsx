import { memo, useMemo } from 'react'
import { RiAddCircleLine, RiChat4Line, RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { getIsUserSubscribed } from '../../helpers/getUserSubscribed'
import { useCombinedSelector } from '../../hooks/useCombinedSelector'
import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { useAppSelector } from '../../store/hooks'
import { Button } from '../Button/Button'
import styles from './ProfileButtons.module.scss'
//TODO Добавить Loader при подписке

interface ProfileButtonsProps {
    setCreatingPost: (value: boolean) => any
    toggleSubscribe: () => any
}

export const ProfileButtons = memo(function ProfileButtons({ setCreatingPost, toggleSubscribe }: ProfileButtonsProps) {
    const { subscribes, isGuest } = useCombinedSelector('user', ['subscribes', 'isGuest'])
    let { profileOwnerInfo } = useAppSelector((state) => state.profile)
    const { _id: profileOwnerId = '', isUserProfile = false } = profileOwnerInfo as ProfileOwnerModel

    let isUserSubscribedOnProfile

    isUserSubscribedOnProfile = useMemo(() => {
        return getIsUserSubscribed(subscribes, isGuest, profileOwnerId)
    }, [subscribes, isGuest, profileOwnerId])

    return isUserProfile ? (
        <Button className={styles.addPostButton} onClick={() => setCreatingPost(true)}>
            <span className={styles.addPostText}>Создать пост</span>
            <RiAddCircleLine className={styles.addPostIcon} />
        </Button>
    ) : (
        <div className={styles.communicateButtons}>
            <Button onClick={() => {}}>
                <span className={styles.chatText}>Чат</span>
                <RiChat4Line className={styles.chatIcon} />{' '}
            </Button>
            {isUserSubscribedOnProfile ? (
                <Button className={styles.unfollowButton} onClick={toggleSubscribe}>
                    <span className={styles.unfollowText}>Подписан</span>
                    <RiUserFollowLine className={styles.unfollowIcon} />
                </Button>
            ) : (
                <Button className={styles.followButton} onClick={toggleSubscribe}>
                    <span className={styles.followText}>Подписаться</span>
                    <RiUserUnfollowLine className={styles.followIcon} />
                </Button>
            )}
        </div>
    )
})
