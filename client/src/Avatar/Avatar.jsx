import React from 'react';
import styles from "./Avatar.module.scss";
import {useNavigate} from "react-router-dom";

const Avatar = ({url,nickName = "",...props}) => {

    const navigate = useNavigate();

    function handleClick(){
        if(nickName)
            navigate('/profile/' + nickName);
        if(props.onClick)
            props.onClick();
    }

    return (
        <img onClick={handleClick}
             className={styles.avatar}
             src={url}
             alt="avatar"
             {...props}
        />
    );
};

export default Avatar;