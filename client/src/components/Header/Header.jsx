import { useSelector } from 'react-redux'
import { LoadingStatuses } from '../../models/LoadingStatuses'
import { useLogout } from '../../utils/useLogout'
import { placeholderUrl } from '../Auth/Registration'
import { Button } from '../Button/Button'
import { Search } from '../Search/Search'
import { AccountLabel } from './AccountLabel'
import styles from './Header.module.scss'

export function Header() {
    const logout = useLogout()

    const { userId, nickName, avatarUrl, fullName, loadingStatus } = useSelector(
        (state) => state.user
    )

    console.log('render header')

    function getAccountLabelData() {
        if (loadingStatus === LoadingStatuses.loading) {
            return {
                avatarUrl: '#',
                userName: '',
                link: '/auth/login',
            }
        }
        if (avatarUrl !== '')
            return {
                avatarUrl: avatarUrl,
                userName: fullName,
                link: `/profile/${nickName}`,
            }
        return {
            avatarUrl: placeholderUrl,
            userName: 'Гость',
            link: '/auth/login',
        }
    }

    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <div>
                    <AccountLabel data={getAccountLabelData()}></AccountLabel>
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
