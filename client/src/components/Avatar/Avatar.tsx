import { useNavigate } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../helpers/getCorrectAvatarUrl'
import styles from './Avatar.module.scss'

interface AvatarProps {
    url: string
    nickName?: string
    className?: string
    onClick?: () => {}
}

export function Avatar(props: AvatarProps) {
    const { url, nickName, className, onClick } = props
    const navigate = useNavigate()

    function handleClick() {
        if (onClick) onClick()
        if (nickName) navigate('/profile/' + nickName)
    }

    const imageClassName: string = `${styles.avatar} ${className}`

    return (
        <img
            className={imageClassName}
            onClick={handleClick}
            src={getCorrectAvatarUrl(url)}
            alt="avatar"
        />
    )
}
