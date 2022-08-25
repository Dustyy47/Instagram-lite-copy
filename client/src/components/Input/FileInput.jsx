import React from 'react';
import styles from './FileInput.module.scss'

function FileInput({setSelectedFile,...props}) {

    return (
        <label style = {props.style} className={styles.label}>
            {props.children || "Добавить файл"}
            <input onChange={setSelectedFile} type="file" className={styles.input} accept = ".jpg,.png,.jpeg"/>
        </label>
    );
}

export default FileInput;