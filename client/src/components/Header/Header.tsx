import { BiExit } from 'react-icons/bi'
import { useLogout } from '../../hooks/useLogout'
import { useAppSelector } from '../../store/hooks'
import { Button } from '../Button/Button'
import { Search } from '../Search/Search'
import { AccountLabel } from './AccountLabel'
import styles from './Header.module.scss'

export function Header() {
    const logout = useLogout()

    const userId = useAppSelector((state) => state.user.userId)

    console.log('render header')

    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <AccountLabel />
                <nav>
                    <ul className={styles.list}>
                        <li>
                            <Search />
                        </li>
                        <li>
                            {userId && (
                                <Button className={styles.exitButton} onClick={logout}>
                                    <p className={styles.exitText}>Выйти</p>
                                    <BiExit className={styles.exitIcon}></BiExit>
                                </Button>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
