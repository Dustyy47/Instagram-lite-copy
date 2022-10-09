import React from 'react';
import UsersListItem from "./UsersListItem";
import {useNavigate} from "react-router-dom";

function UsersList({users, absenceText, title, onClick, ...props}) {
    const navigate = useNavigate();
    const handleClickToUser = user => {
        navigate('/profile/' + user.nickName);
    }

    return (
        <>
            <h3>{title}</h3>
            {
                users.length > 0
                    ?
                    users.map(user => (
                        <UsersListItem onClick={onClick ? () => onClick(user) : () => handleClickToUser(user)}
                                       key={user.profileId} user={user}/>
                    ))
                    :
                    <div style={{
                        display: 'flex',
                        justifyContent: "center",
                        alignItems: 'center',
                        color: "grey",
                        fontSize: 20,
                        flexDirection:'column',
                        width : '95%',
                        height : '95%',
                        textAlign:"center"
                    }}>
                        {props.children}
                    </div>
            }
        </>
    );
}

export default UsersList;