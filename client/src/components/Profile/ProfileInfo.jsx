import { useState } from 'react'
import { getProfileInfo } from '../../http/userApi'
import { Modal } from '../Modal/Modal'
import { UsersList } from '../UsersList/UsersList'

export function ProfileInfo({ fullName, email, avatarUrl, subscribesId, subscribersId }) {
    const [users, setUsers] = useState([])
    const [title, setTitle] = useState('')
    const [isModalOpen, setModalOpen] = useState(false)
    const [absenceText, setAbsenceText] = useState('')

    async function openModal(usersId, title, absenceText) {
        const usersData = []
        for (const userId of usersId) {
            const userData = await getProfileInfo(userId)
            usersData.push(userData)
        }
        setUsers(usersData.map((data) => data))
        setTitle(title)
        setAbsenceText(absenceText)
        setModalOpen(true)
    }

    return (
        <div className="page-header">
            <img className="page-avatar" src={avatarUrl} alt="avatar" />
            <div className="page-header__content">
                <h3 className="page-header__name">{fullName}</h3>
                <p className="page-header__email">{email}</p>
                <div className="page-header__subscribesBlock">
                    <p
                        onClick={() => openModal(subscribersId, 'Подписчики', 'Нет подписчиков')}
                        className="page-header__subscribers"
                    >
                        {subscribersId.length} подписчиков
                    </p>
                    <p
                        onClick={() => openModal(subscribesId, 'Подписки', 'Нет подписок')}
                        className="page-header__subscribes"
                    >
                        {subscribesId.length} подписок
                    </p>
                </div>
            </div>
            <Modal isActive={isModalOpen} setActive={() => setModalOpen(false)}>
                <UsersList users={users} title={title} absenceText={absenceText} />
            </Modal>
        </div>
    )
}
