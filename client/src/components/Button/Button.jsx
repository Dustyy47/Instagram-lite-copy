import React from 'react';
import styles from './Button.module.scss'

function Button({onClick,...props}) {
    const click = e=>{
        e.preventDefault();
        onClick();
    }
    return (
        <button style = {props.style}  onClick={click} className={styles.button}>
            {props.children}
        </button>
    );
}

export default Button;