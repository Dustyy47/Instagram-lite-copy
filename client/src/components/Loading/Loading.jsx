import React from 'react';
import styles from './Loading.module.scss'
import {AiOutlineLoading3Quarters} from "react-icons/ai";

function Loading() {
    return (
        <AiOutlineLoading3Quarters className={styles.loading}/>
    );
}

export default Loading;