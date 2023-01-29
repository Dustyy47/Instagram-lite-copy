import { useState } from 'react'
import { getLabel } from '../../helpers/getCorrectLabel'
import { getProfileOwnerInfo } from '../../http/userApi'
import { Modal } from '../Modal/Modal'
import { UsersList } from '../UsersList/UsersList'
import styles from './ProfileInfo.module.scss'

export function ProfileInfo({ fullName, email, avatarUrl, subscribesId, subscribersId }) {
    const [users, setUsers] = useState([])
    const [title, setTitle] = useState('')
    const [isModalOpen, setModalOpen] = useState(false)
    const [absenceText, setAbsenceText] = useState('')

    async function openModal(usersId, title, absenceText) {
        setModalOpen(true)
        setTitle(title)
        setAbsenceText(absenceText)
        const usersData = []
        for (const userId of usersId) {
            const userData = await getProfileOwnerInfo(userId)
            usersData.push(userData)
        }
        setUsers(usersData.map((data) => data))
    }

    return (
        <div className={styles.wrapper}>
            <img className={styles.avatar} src={avatarUrl} alt="avatar" />
            <div className={styles.content}>
                <h3 className={styles.name}>{fullName}</h3>
                <p className={styles.email}>{email}</p>
                <div className={styles.subscribesWrapper}>
                    <p
                        onClick={() => openModal(subscribersId, 'Подписчики', 'Нет подписчиков')}
                        className={styles.subscribers}
                    >
                        {getLabel(subscribersId.length, 'subscribers')}
                    </p>
                    <p
                        onClick={() => openModal(subscribesId, 'Подписки', 'Нет подписок')}
                        className={styles.subscribes}
                    >
                        {getLabel(subscribesId.length, 'subscribes')}
                    </p>
                </div>
            </div>
            <Modal isActive={isModalOpen} setActive={() => setModalOpen(false)}>
                <UsersList users={users} title={title} absenceText={absenceText} />
            </Modal>
        </div>
    )
}
