import { RiLogoutBoxRLine } from 'react-icons/ri'
import { useLogout } from '../../hooks/useLogout'
import { useProfileNavigate } from '../../hooks/useProfileNavigate'
import { Avatar } from '../Avatar/Avatar'
import styles from './NavBar.module.scss'

interface NavBarProps {}

export function NavBar({}: NavBarProps) {
    const { data, navigateToProfile } = useProfileNavigate()
    const logout = useLogout()

    return (
        <div className={styles.container}>
            <nav className={styles.wrapper}>
                <li className={styles.listItem}></li>
                <li className={styles.listItem + ' ' + styles.avatarItem} onClick={navigateToProfile}>
                    <Avatar className={styles.icon} url={data.avatarUrl}></Avatar>
                </li>
                <li className={styles.listItem} onClick={logout}>
                    {!data.isGuest && <RiLogoutBoxRLine className={styles.icon} />}
                </li>
            </nav>
        </div>
    )
}
