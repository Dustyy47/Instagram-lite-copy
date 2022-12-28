import { useNavigate } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../utils/getCorrectAvatarUrl'
import styles from './Avatar.module.scss'

export const Avatar = ({ url, nickName = '', ...props }) => {
    const navigate = useNavigate()

    function handleClick() {
        if (nickName) navigate('/profile/' + nickName)
        if (props.onClick) props.onClick()
    }

    return (
        <img
            onClick={handleClick}
            className={styles.avatar}
            src={getCorrectAvatarUrl(url)}
            alt="avatar"
            {...props}
        />
    )
}
