import { memo, useCallback, useState } from 'react'
import { getLabel, LabelsType } from '../../helpers/getCorrectLabel'
import { getProfileOwnerInfo } from '../../http/profileApi'
import { Status } from '../../models/LoadingStatus'
import { ProfileOwnerModel } from '../../models/ProfileOwnerModel'
import { Loading } from '../Loading/Loading'
import { Modal } from '../Modal/Modal'
import { UsersList } from '../UsersList/UsersList'
import styles from './ProfileInfo.module.scss'

export const ProfileInfo = memo(function ProfileInfo({
    fullName,
    avatarUrl,
    email,
    subscribes = [],
    subscribers = [],
}: ProfileOwnerModel) {
    const [users, setUsers] = useState<ProfileOwnerModel[] | []>([])
    const [title, setTitle] = useState('')
    const [isModalOpen, setModalOpen] = useState(false)
    const [absenceText, setAbsenceText] = useState('')
    const [status, setStatus] = useState(Status.loading)

    async function openModal(usersIds: string[], title: string, absenceText: string) {
        try {
            setUsers([])
            setModalOpen(true)
            setTitle(title)
            setAbsenceText(absenceText)
            setStatus(Status.loading)
            const usersData: ProfileOwnerModel[] = []
            for (const userId of usersIds) {
                const userData = await getProfileOwnerInfo(userId)
                if (userData) usersData.push(userData)
            }
            setStatus(Status.idle)
            setUsers([...usersData])
        } catch (e) {}
    }

    const closeModal = useCallback(() => {
        setModalOpen(false)
    }, [])

    return (
        <div className={styles.wrapper}>
            <img className={styles.avatar} src={avatarUrl} alt="avatar" />
            <div className={styles.content}>
                <h3 className={styles.name}>{fullName}</h3>
                <p className={styles.email}>{email}</p>
                <div className={styles.subscribesWrapper}>
                    <p
                        onClick={() => openModal(subscribers, 'Подписчики', 'Нет подписчиков')}
                        className={styles.subscribers}
                    >
                        {getLabel(subscribers?.length || 0, LabelsType.subscribers)}
                    </p>
                    <p onClick={() => openModal(subscribes, 'Подписки', 'Нет подписок')} className={styles.subscribes}>
                        {getLabel(subscribes?.length || 0, LabelsType.subscribes)}
                    </p>
                </div>
            </div>
            <Modal className={styles.modal} isActive={isModalOpen} setActive={closeModal}>
                <UsersList users={users} title={title}>
                    {status === Status.loading ? <Loading /> : absenceText}
                </UsersList>
            </Modal>
        </div>
    )
})
