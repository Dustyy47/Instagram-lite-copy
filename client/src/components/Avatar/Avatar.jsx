import { useNavigate } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../helpers/getCorrectAvatarUrl'
import styles from './Avatar.module.scss'

export function Avatar({ url, nickName = '', className = '', onClick, ...props }) {
    const navigate = useNavigate()

    function handleClick() {
        if (onClick) onClick()
        if (nickName) navigate('/profile/' + nickName)
    }

    const imageClassName = `${styles.avatar} ${className}`

    return (
        <img
            onClick={handleClick}
            className={imageClassName}
            src={getCorrectAvatarUrl(url)}
            alt="avatar"
            {...props}
        />
    )
}
