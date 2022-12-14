import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export function HideIcon({ toggleValue, toggleAction }) {
    const toggle = (e) => {
        e.preventDefault()
        toggleAction()
    }
    return (
        <div>
            {!toggleValue ? (
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
