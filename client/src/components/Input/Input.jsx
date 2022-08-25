import React from 'react';
import styles from './Input.module.scss'

function Input({name, onChange, value, type, placeholder, className, isColumn, ...props}) {
    return (
        <div className={`${styles.group} ${isColumn && styles.column}`}>
            <label className={styles.label}
            >{props.children}<span>{name}</span></label>
            <input onChange={e => onChange(e.target.value)} value={value} type={type === "" ? "text" : type} id="email"
                   className={styles.input} placeholder={placeholder}/>
        </div>
    );
}

export default Input;