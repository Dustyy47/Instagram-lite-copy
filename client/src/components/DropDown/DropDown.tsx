import styles from './DropDown.module.scss'

export interface DropDownItem {
    key: any
    text: string
    icon: React.ReactElement
    callback: () => any
}

interface DropDownProps {
    isActive: boolean
    setActive: (value: boolean) => any
    items: DropDownItem[]
    className?: string
}

export function DropDown({ items, className, isActive, setActive }: DropDownProps) {
    function handleClick(item: DropDownItem) {
        item.callback()
        setActive(false)
    }

    return (
        <div className={`${styles.wrapper}  ${className || ''} ${isActive || styles.hidden}`}>
            <ul className={styles.list}>
                {items.map((item) => (
                    <li onClick={() => handleClick(item)} key={item.key} className={styles.listItem}>
                        {item.icon}
                        {item.text}
                    </li>
                ))}
            </ul>
        </div>
    )
}
