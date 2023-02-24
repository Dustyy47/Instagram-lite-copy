import { useNavigate } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../helpers/getCorrectUrl'
import styles from './Avatar.module.scss'

interface AvatarProps {
    url: string
    nickName?: string
    className?: string
    onClick?: (e: React.MouseEvent) => any
}

export function Avatar({ url, nickName, className, onClick }: AvatarProps) {
    const navigate = useNavigate()

    function handleClick(e: React.MouseEvent) {
        if (onClick) onClick(e)
        if (nickName) navigate('/profile/' + nickName)
    }

    const imageClassName: string = `${styles.avatar} ${className}`

    return <img className={imageClassName} onClick={handleClick} src={getCorrectAvatarUrl(url)} alt="avatar" />
}
