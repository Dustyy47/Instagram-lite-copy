import { useSelector } from 'react-redux'
import { getIsUserSubscribed } from '../../helpers/getUserSubscribed'
import { Button } from '../Button/Button'
import styles from './ProfileButtons.module.scss'

//TODO Добавить Loader при подписке
export function ProfileButtons({ setCreatingPost, toggleSubscribe }) {
    const { subscribes, isGuest } = useSelector((state) => state.user)
    const { profileOwnerInfo } = useSelector((state) => state.profile)
    const { id: profileOwnerId, isUserProfile } = profileOwnerInfo

    console.log('rendered profile buttons', subscribes)

    const isUserSubscribedOnProfile = getIsUserSubscribed(subscribes, isGuest, profileOwnerId)

    return isUserProfile ? (
        <Button onClick={() => setCreatingPost(true)}>Создать пост</Button>
    ) : (
        <div className={styles.communicateButtons}>
            <Button>Чат</Button>
            {isUserSubscribedOnProfile ? (
                <Button onClick={toggleSubscribe}>Отписаться</Button>
            ) : (
                <Button onClick={toggleSubscribe}>Подписаться</Button>
            )}
        </div>
    )
}
