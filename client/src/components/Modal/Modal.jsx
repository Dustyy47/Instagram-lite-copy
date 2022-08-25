import React from 'react';
import styles from './Modal.module.scss'

function Modal({isActive , setActive , ...props}) {
    return (
        <div onClick={()=>setActive(false)} className={`${styles.modal} ${!isActive ? styles["modal--hidden"] : ""}`}>
            <div onClick={e=>e.stopPropagation()} className={styles.content}>
                {props.children}
            </div>
        </div>
    );
}

export default Modal;