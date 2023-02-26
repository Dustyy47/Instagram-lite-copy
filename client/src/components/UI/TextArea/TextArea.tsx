import { AnyFunction } from 'models/CallbacksTypes'
import styles from './TextArea.module.scss'

export interface TextAreaProps {
    onChange: (value: string) => any
    value: string
    onBlur?: AnyFunction
    htmlProps?: Omit<React.HTMLProps<HTMLTextAreaElement>, 'onChange' | 'ref' | 'value'>
    forwardRef?: React.MutableRefObject<HTMLTextAreaElement | null>
}

export function TextArea({ htmlProps, onChange, value, forwardRef, onBlur }: TextAreaProps) {
    function resize(element: HTMLTextAreaElement) {
        element.style.height = 'auto'
        element.style.height = element.scrollHeight + 'px'
    }

    function handleType(e: React.ChangeEvent<HTMLTextAreaElement>) {
        onChange(e.target.value)
        resize(e.target)
    }

    return (
        <textarea
            {...htmlProps}
            className={`${styles.textArea} ${htmlProps?.className || ''}`}
            onChange={handleType}
            ref={forwardRef}
            value={value}
            onBlur={onBlur}
        ></textarea>
    )
}
