import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import styles from './Loading.module.scss'

function Loading() {
    return <AiOutlineLoading3Quarters className={styles.loading} />
}

export default Loading
