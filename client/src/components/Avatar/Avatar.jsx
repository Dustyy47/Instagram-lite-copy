import { useNavigate } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../utils/getCorrectAvatarUrl'
import styles from './Avatar.module.scss'

export function Avatar({ url, nickName = '', className = '', ...props }) {
    const navigate = useNavigate()

    function handleClick() {
        console.log('clicked to avatar')
        if (nickName) navigate('/profile/' + nickName)
        if (props.onClick) props.onClick()
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
