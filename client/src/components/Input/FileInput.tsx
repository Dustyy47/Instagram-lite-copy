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
}

export function FileInput(props: FileInputProps) {
    const { validator, setSelectedFile, needToValidate } = props
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
        <div style={{ position: 'relative' }}>
            <ValidationMessage show={true} errorsString={validator?.errors || ''} />
            <label style={props.style} className={styles.label}>
                {props.children || 'Добавить файл'}
                <input onChange={load} type="file" className={styles.input} accept=".jpg,.png,.jpeg" />
            </label>
        </div>
    )
}
