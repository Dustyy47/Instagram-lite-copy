import { useState } from 'react'
import { getProfileOwnerInfo } from '../../http/userApi'
import { getLabel } from '../../utils/getCorrectLabel'
import { Modal } from '../Modal/Modal'
import { UsersList } from '../UsersList/UsersList'

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
                        {getLabel(subscribersId.length, 'subscribers')}
                    </p>
                    <p
                        onClick={() => openModal(subscribesId, 'Подписки', 'Нет подписок')}
                        className="page-header__subscribes"
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
