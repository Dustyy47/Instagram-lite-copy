import React from 'react';
import styles from './ValidationMessage.module.scss'

const ValidationMessage = ({errorsString,show}) => {

    return (
        <div className={`${styles.wrapper} ${!show || errorsString === "" ? '' : styles.active}`}>
            {errorsString}
        </div>
    );
};

export default ValidationMessage;