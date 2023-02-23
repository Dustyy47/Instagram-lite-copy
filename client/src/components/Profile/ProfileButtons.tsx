import { memo, useMemo } from 'react'
import { RiAddCircleLine, RiChat4Line, RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { getIsUserSubscribed } from '../../helpers/getUserSubscribed'
import { useCombinedSelector } from '../../hooks/useCombinedSelector'
import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { useAppSelector } from '../../store/hooks'
import { Button } from '../UI/Button/Button'
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
            {isUserSubscribedOnProfile ? (
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
