import { memo, useMemo } from 'react'
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

export const ProfileButtons = memo(function ProfileButtons(props: ProfileButtonsProps) {
    const { setCreatingPost, toggleSubscribe } = props
    const { subscribes, isGuest } = useCombinedSelector('user', ['subscribes', 'isGuest'])
    let { profileOwnerInfo } = useAppSelector((state) => state.profile)
    const { _id: profileOwnerId = '', isUserProfile = false } = profileOwnerInfo as ProfileOwnerModel

    let isUserSubscribedOnProfile

    isUserSubscribedOnProfile = useMemo(() => {
        return getIsUserSubscribed(subscribes, isGuest, profileOwnerId)
    }, [subscribes, isGuest, profileOwnerId])

    return isUserProfile ? (
        <Button onClick={() => setCreatingPost(true)}>Создать пост</Button>
    ) : (
        <div className={styles.communicateButtons}>
            <Button onClick={() => {}}>Чат</Button>
            {isUserSubscribedOnProfile ? (
                <Button onClick={toggleSubscribe}>Отписаться</Button>
            ) : (
                <Button onClick={toggleSubscribe}>Подписаться</Button>
            )}
        </div>
    )
})
