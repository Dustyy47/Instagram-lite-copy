import { getCorrectAvatarUrl } from '../../../utils/getCorrectAvatarUrl'
import { Avatar } from '../../Avatar/Avatar'
import styles from './Comment.module.scss'

export function Comment({ authorInfo, commentInfo }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.infoWrapper}>
                <Avatar
                    nickName={authorInfo.nickName}
                    url={getCorrectAvatarUrl(authorInfo.avatarUrl)}
                    style={{ width: 45, height: 45, marginLeft: 10 }}
                />
                <span className={styles.nickName}>{authorInfo.nickName}</span>
            </div>
            <p className={styles.text}>
                {' '}
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias consequatur iure
                modi, quibusdam quod sapiente vel. Ab accusantium dolorem earum fugiat, in neque
                nihil reiciendis similique soluta tempore tenetur.
            </p>
        </div>
    )
}
