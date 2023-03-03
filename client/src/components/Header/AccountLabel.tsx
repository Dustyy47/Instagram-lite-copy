import { useLocation } from 'react-router-dom'
import { useProfileNavigate } from '../../hooks/useProfileNavigate'
import { Avatar } from '../Avatar/Avatar'
import styles from './AccountLabel.module.scss'

interface AccountLabelProps {
    className?: string
}

export function AccountLabel({ className }: AccountLabelProps) {
    const { data, navigateToProfile } = useProfileNavigate()
    const location = useLocation()

    function handleClick() {
        if (data.link === location.pathname) {
            return
        }
        navigateToProfile()
    }

    return (
        <div onClick={handleClick} className={`${styles.userInfo} ${className}`}>
            <Avatar url={data.avatarUrl || ''}></Avatar>
            <span className={styles.userName}>{data.userName}</span>
        </div>
    )
}
