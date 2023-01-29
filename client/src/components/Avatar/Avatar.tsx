import { useNavigate } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../helpers/getCorrectAvatarUrl'
import styles from './Avatar.module.scss'

interface AvatarProps {
    url: string
    nickName: string
    className: string
    onClick: () => {}
}

export function Avatar(props: AvatarProps) {
    const navigate = useNavigate()

    function handleClick() {
        if (props.onClick) props.onClick()
        if (props.nickName) navigate('/profile/' + props.nickName)
    }

    const imageClassName: string = `${styles.avatar} ${props.className}`

    return (
        <img
            className={imageClassName}
            onClick={handleClick}
            src={getCorrectAvatarUrl(props.url)}
            alt="avatar"
        />
    )
}
