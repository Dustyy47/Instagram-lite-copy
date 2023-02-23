import { ReactElement } from 'react'
import { useAppSelector } from '../../store/hooks'
import { Avatar } from '../Avatar/Avatar'
import styles from './SelectedPost.module.scss'

interface SelectedPostHeaderProps {
    children?: ReactElement
}

export function SelectedPostHeader({ children }: SelectedPostHeaderProps) {
    const author = useAppSelector((state) => state.extendedPost.author)
    const { avatarUrl, nickName } = author

    return (
        <div className={styles.header}>
            <div className={styles.profileInfo}>
                <Avatar url={avatarUrl || ''} />
                <p className={styles.nickName}>{nickName}</p>
            </div>
            <div className={styles.headerButtons}>
                {children}

                {/* <div className={styles.menuToggleWrapper}>
                    <HiOutlineDotsVertical className={styles.menuToggleButton} onClick={() => {}} />
                    <DropDown
                        className={styles.menu}
                        setActive={setMenuOpen}
                        items={menuItems}
                        isActive={isMenuOpen}
                    ></DropDown>
                </div> */}
            </div>
        </div>
    )
}
