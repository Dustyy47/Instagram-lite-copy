import { BiExit } from 'react-icons/bi'
import { useLogout } from '../../hooks/useLogout'
import { useAppSelector } from '../../store/hooks'
import { Search } from '../Search/Search'
import { Button } from '../UI/Button/Button'
import { AccountLabel } from './AccountLabel'
import styles from './Header.module.scss'

export function Header() {
    const logout = useLogout()

    const { isGuest } = useAppSelector((state) => state.user)
    return (
        <>
            <header className={styles.header}>
                <div className={styles.wrapper}>
                    <AccountLabel className={styles.label} />
                    <nav>
                        {!isGuest && (
                            <ul className={styles.list}>
                                <li>
                                    <Search className={styles.search} />
                                </li>
                                <li>
                                    <Button className={styles.exitButton} onClick={logout}>
                                        <p className={styles.exitText}>Выйти</p>
                                        <BiExit className={styles.exitIcon}></BiExit>
                                    </Button>
                                </li>
                            </ul>
                        )}
                    </nav>
                </div>
                {!isGuest && <Search className={styles.mobileSearch} />}
            </header>
        </>
    )
}
