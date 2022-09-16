import React from 'react';
import styles from './Input.module.scss'

function Input({name, onChange, value, type, placeholder, className, isColumn, ...props}) {
    return (
        <div style = {props.styleWrapper} className={`${styles.group} ${isColumn ? styles.column : ''}`}>
            <label style = {props.styleLabel} className={styles.label}
            >{props.children}<span>{name}</span></label>
            <input onBlur={props.onBlur} onFocus={props.onFocus} style = {props.styleInput} onChange={e => onChange(e.target.value)} value={value} type={type === "" ? "text" : type} id={props.id}
                   className={styles.input} placeholder={placeholder}/>
        </div>
    );
}

export default Input;