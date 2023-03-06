import { ReactElement } from 'react'
import { useAppSelector } from '../../store/hooks'
import { Avatar } from '../Avatar/Avatar'
import styles from './SelectedPost.module.scss'
import { SelectedPostMenu } from './SelectedPostMenu'

interface SelectedPostHeaderProps {
    children?: ReactElement
}

export function SelectedPostHeader({ children }: SelectedPostHeaderProps) {
    const author = useAppSelector((state) => state.extendedPost.author)
    const post = useAppSelector((state) => state.extendedPost.post)
    const isActiveUserPost = useAppSelector((state) => state.extendedPost.isActiveUserPost)

    if (!author) return null
    const { avatarUrl, nickname } = author

    return (
        <div className={styles.header}>
            <div className={styles.profileInfo}>
                <Avatar url={avatarUrl || ''} />
                <p className={styles.nickName}>{nickname}</p>
            </div>
            <div className={styles.headerButtons}>
                {children}
                {isActiveUserPost && <SelectedPostMenu postData={post?.data} />}
            </div>
        </div>
    )
}
