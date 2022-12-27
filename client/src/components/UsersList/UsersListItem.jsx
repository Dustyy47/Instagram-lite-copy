import React from 'react';
import styles from './UsersList.module.scss'
import Avatar from "../../Avatar/Avatar";

function UsersListItem({user,onClick}) {
    return (
        <div onClick = {onClick}  className={styles.item}>
            <Avatar url={user.avatarUrl}/>
            <h5>{user.fullName}</h5>
        </div>
    );
}

export default UsersListItem;