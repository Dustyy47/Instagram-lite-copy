import { MdOutlineArrowBack } from 'react-icons/md'

interface BackProps {
    onClick: () => any
    className?: string
}

export function Back({ onClick, className }: BackProps) {
    return (
        <button onClick={onClick} className={className}>
            <MdOutlineArrowBack />
            Назад
        </button>
    )
}
