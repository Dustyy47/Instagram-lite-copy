import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LoadingStatuses } from '../../models/LoadingStatuses'
import { useLogout } from '../../utils/useLogout'
import { placeholderUrl } from '../Auth/Registration'
import Avatar from '../Avatar/Avatar'
import Button from '../Button/Button'
import styles from './Header.module.scss'
import Search from './Search'

function Header() {
    const logout = useLogout()

    const { userId, nickName, avatarUrl, fullName, loadingStatus } = useSelector(
        (state) => state.user
    )
    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <div>
                    <Link
                        to={userId ? `/profile/${nickName}` : '/auth/login'}
                        className={styles.userInfo}
                    >
                        {loadingStatus === LoadingStatuses.loading ? (
                            <Avatar url="#" />
                        ) : avatarUrl ? (
                            <Avatar url={avatarUrl} />
                        ) : (
                            <Avatar url={placeholderUrl} />
                        )}

                        <span className={styles.userName}>
                            {loadingStatus === LoadingStatuses.loading
                                ? ''
                                : fullName
                                ? fullName
                                : 'Гость'}{' '}
                        </span>
                    </Link>
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

export default Header
