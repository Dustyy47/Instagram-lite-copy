import React from 'react';
import styles from './UsersList.module.scss'

function UsersListItem({user,onClick}) {
    return (
        <div onClick = {onClick}  className={styles.item}>
            <img src={`${process.env.REACT_APP_API_URL}/avatars/${user.avatarUrl}`}  alt={'avatar'}/>
            <h5>{user.fullName}</h5>
        </div>
    );
}

export default UsersListItem;