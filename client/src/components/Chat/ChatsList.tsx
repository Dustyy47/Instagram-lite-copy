import { UserInfo, UserInfoClassnames } from 'components/UsersList/UserInfo'
import { generateMockUsers } from 'mock/users'
import styles from './ChatsList.module.scss'

const userInfoClassnames: UserInfoClassnames = {
    wrapper: styles.user,
}

export function ChatsList() {
    return (
        <div className={styles.chatsList}>
            <ul>
                {generateMockUsers(30).map((user) => (
                    <UserInfo
                        classNames={userInfoClassnames}
                        onClick={() => console.log(user.nickname)}
                        user={user}
                        key={user.userID}
                    ></UserInfo>
                ))}
            </ul>
        </div>
    )
}
