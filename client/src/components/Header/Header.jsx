import { useSelector } from 'react-redux'
import { useLogout } from '../../utils/useLogout'
import { Button } from '../Button/Button'
import { Search } from '../Search/Search'
import { AccountLabel } from './AccountLabel'
import styles from './Header.module.scss'

export function Header() {
    const logout = useLogout()

    const userId = useSelector((state) => state.user.userId)

    console.log('render header')

    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <div>
                    <AccountLabel />
                </div>
                <nav>
                    <ul className={styles.list}>
                        <li>
                            <Search />
                        </li>
                        <li>
                            {userId && (
                                <Button style={{ width: 100, height: 50 }} onClick={logout}>
                                    Выйти
                                </Button>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
