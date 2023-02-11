import { ChangeEvent, useEffect } from 'react'
import { Validator } from '../../hooks/validators/useValidator'
import { ValidationMessage } from '../ValidationMessage/ValidationMessage'
import styles from './FileInput.module.scss'

interface FileInputProps {
    setSelectedFile: (e: ChangeEvent<HTMLInputElement>) => any
    validator?: Validator
    needToValidate?: boolean
    style?: React.CSSProperties
    children?: React.ReactElement | string
    className?: string
}

//TODO to deal with validation message

export function FileInput({ validator, setSelectedFile, needToValidate, style, children, className }: FileInputProps) {
    useEffect(() => {
        if (!needToValidate) return
        validator?.validate('')
    }, [needToValidate])

    function load(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        //TODO add validations
        //validator?.validate(e.target.files[0])
        console.log(e.target)
        setSelectedFile(e)
    }

    return (
        <div style={{ position: 'relative' }} className={className}>
            <ValidationMessage isHidden={true} errorsString={validator?.errors || ''} />
            <label style={style} className={styles.label}>
                {children || 'Добавить файл'}
                <input onChange={load} type="file" className={styles.input} accept=".jpg,.png,.jpeg" />
            </label>
        </div>
    )
}
