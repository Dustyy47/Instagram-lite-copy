import React from 'react';
import styles from './Button.module.scss'

function Button({onClick, ...props}) {
    const click = e => {
        e.preventDefault();
        onClick();
    }
    return (
        <button style={props.style} disabled={props.disabled} onClick={click}
                className={`${styles.button} ${props.disabled ? styles.disabled : ""} ${props.className ? props.className : ''}`}>
            {props.children}
        </button>
    );
}

export default Button;