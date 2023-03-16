import { DropDown } from 'components/UI/DropDown/DropDown'
import { useOutsideClick } from 'hooks/useOutsideClick'
import { PostModel } from 'models/PostModel'
import { useMemo, useRef, useState } from 'react'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useAppDispatch } from 'store/hooks'
import { profileActions } from 'store/slices/profileSlice'
import { selectedPostActions } from 'store/slices/selectedPostSlice'
import styles from './SelectedPost.module.scss'

interface SelectedPostMenuProps {
    postData: PostModel | undefined
}

export function SelectedPostMenu({ postData }: SelectedPostMenuProps) {
    const [isMenuOpen, setMenuOpen] = useState(false)
    const dispatch = useAppDispatch()
    const ref = useRef<HTMLDivElement>(null)
    useOutsideClick(ref, () => setMenuOpen(false))
    const menuItems = useMemo(() => {
        return [
            {
                key: 1,
                text: 'Удалить',
                icon: <RiDeleteBinLine />,
                callback: () => {
                    dispatch(selectedPostActions.toggle(false))
                    dispatch(profileActions.deletePost(postData?.id || 0))
                },
            },
        ]
    }, [postData])

    return (
        <div ref={ref} className={styles.menuToggleWrapper}>
            <HiOutlineDotsVertical
                className={styles.menuToggleButton}
                onClick={() => {
                    setMenuOpen(true)
                }}
            />
            <DropDown className={styles.menu} setActive={setMenuOpen} items={menuItems} isActive={isMenuOpen}></DropDown>
        </div>
    )
}
