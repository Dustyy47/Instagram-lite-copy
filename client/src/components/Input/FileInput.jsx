import { useEffect } from 'react'
import { ValidationMessage } from '../ValidationMessage/ValidationMessage'
import styles from './FileInput.module.scss'

export function FileInput({ validator, setSelectedFile, ...props }) {
    useEffect(() => {
        if (!props.needToValidate) return
        validator.validate(undefined)
    }, [props.needToValidate])

    function load(e) {
        validator?.validate(e.target.files[0])
        console.log(e.target)
        setSelectedFile(e)
    }

    return (
        <div style={{ position: 'relative' }}>
            <ValidationMessage show={true} errorsString={validator?.errors} />
            <label style={props.style} className={styles.label}>
                {props.children || 'Добавить файл'}
                <input
                    onChange={load}
                    type="file"
                    className={styles.input}
                    accept=".jpg,.png,.jpeg"
                />
            </label>
        </div>
    )
}
