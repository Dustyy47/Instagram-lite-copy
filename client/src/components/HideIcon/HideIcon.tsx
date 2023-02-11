import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { AnyFunction } from '../../models/CallbacksTypes'

interface HideIconProps {
    isHidden: boolean
    toggle: AnyFunction
}

export function HideIcon({ isHidden, toggle: toggleCb }: HideIconProps) {
    const toggle = (e: React.MouseEvent<SVGElement>) => {
        e.preventDefault()
        toggleCb()
    }
    return (
        <div>
            {!isHidden ? (
                <AiOutlineEye
                    style={{
                        cursor: 'pointer',
                        marginRight: '10px',
                        fontSize: '23px',
                        transform: 'translateY(2px)',
                    }}
                    onClick={toggle}
                />
            ) : (
                <AiOutlineEyeInvisible
                    style={{
                        cursor: 'pointer',
                        marginRight: '10px',
                        fontSize: '23px',
                        transform: 'translateY(2px)',
                    }}
                    onClick={toggle}
                />
            )}
        </div>
    )
}
