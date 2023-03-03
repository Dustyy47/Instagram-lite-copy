import { getCorrectAvatarUrl } from 'helpers/getCorrectUrl'
import { getFollowers, getFollowings } from 'http/profileApi'
import { Status } from 'models/LoadingStatus'
import { memo, useCallback, useState } from 'react'
import { useAppSelector } from 'store/hooks'
import { getProfileInfo } from 'store/selectors/profileSelectors'
import { getLabel, LabelsType } from '../../helpers/getCorrectLabel'
import { UserItemModel } from '../../models/ProfileOwnerModel'
import { Modal } from '../Modal/Modal'
import { Loading } from '../UI/Loading/Loading'
import { UsersList } from '../UsersList/UsersList'
import styles from './ProfileInfo.module.scss'

interface UsersModal {
    title: string
    users: UserItemModel[]
    isOpen: boolean
    absenceText: string
    loadingStatus: Status
}
interface ProfileInfoProps {
    className?: string
}

export const ProfileInfo = memo(function ProfileInfo({ className }: ProfileInfoProps) {
    const { fullname, avatarUrl, email, numFollowers, numFollowing, userID } = useAppSelector(getProfileInfo) || {}
    const [modalInfo, setModalInfo] = useState<UsersModal>({
        title: '',
        users: [],
        isOpen: false,
        absenceText: '',
        loadingStatus: Status.loading,
    })

    async function openModal(type: 'followers' | 'followings') {
        let fetchUsersCallback: (id: number) => Promise<UserItemModel[] | undefined> = async () => await []
        if (type === 'followers') {
            fetchUsersCallback = getFollowers
            setModalInfo((prev) => ({
                ...prev,
                title: 'Подписчики',
                absenceText: 'Нет подписчиков',
                loadingStatus: Status.loading,
            }))
        } else if (type === 'followings') {
            fetchUsersCallback = getFollowings
            setModalInfo((prev) => ({
                ...prev,
                title: 'Подписки',
                absenceText: 'Нет подписок',
                loadingStatus: Status.loading,
            }))
        }

        const users = await fetchUsersCallback(userID || -1)
        if (!users) {
            setModalInfo((prev) => ({ ...prev, loadingStatus: Status.error }))
            return
        }

        setModalInfo((prev) => ({
            ...prev,
            isOpen: true,
            loadingStatus: Status.idle,
            users,
        }))
    }

    const closeModal = useCallback(() => {
        setModalInfo((prev) => ({ ...prev, isOpen: false }))
    }, [])

    return (
        <div className={`${styles.wrapper} ${className}`}>
            <img className={styles.avatar} src={getCorrectAvatarUrl(avatarUrl)} alt="avatar" />
            <div className={styles.content}>
                <div>
                    <h3 className={styles.name}>{fullname}</h3>
                    <p className={styles.email}>{email}</p>
                </div>
                <div className={styles.subscribesWrapper}>
                    <p onClick={() => openModal('followers')} className={styles.subscribers}>
                        {getLabel(numFollowers || 0, LabelsType.subscribers)}
                    </p>
                    <p onClick={() => openModal('followings')} className={styles.subscribes}>
                        {getLabel(numFollowing || 0, LabelsType.subscribes)}
                    </p>
                </div>
            </div>
            <Modal className={styles.modal} isActive={modalInfo.isOpen} setActive={closeModal}>
                <UsersList users={modalInfo.users} title={modalInfo.title}>
                    {modalInfo.loadingStatus === Status.loading ? <Loading /> : modalInfo.absenceText}
                </UsersList>
            </Modal>
        </div>
    )
})
