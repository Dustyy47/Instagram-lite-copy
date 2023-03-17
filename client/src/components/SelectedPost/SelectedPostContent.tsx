import { ReactElement } from 'react'
import { useAppSelector } from 'store/hooks'
import styles from './SelectedPost.module.scss'

interface SelectedPostContentProps {
    children?: ReactElement
}

export function SelectedPostContent({ children }: SelectedPostContentProps) {
    const post = useAppSelector((state) => state.selectedPost.post)

    return (
        <div className={styles.content}>
            <div className={styles.contentHeader}>
                <h3 className={styles.title}>{post?.data.title}</h3>
                <div className={styles.buttons}>{children}</div>
            </div>
            <p className={styles.description}>{post?.data.description}</p>
        </div>
    )
}
