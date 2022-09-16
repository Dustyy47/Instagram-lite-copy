import React from 'react';
import UsersListItem from "./UsersListItem";
import {useNavigate} from "react-router-dom";

function UsersList({users, absenceText , title,onClick}) {
    const navigate = useNavigate();
    const handleClickToUser = user=>{
        navigate('/profile/'+user.nickName);
    }

    return (
        <>
            <h3>{title}</h3>
            {
                users.length > 0
                    ?
                users.map(user=>(
                    <UsersListItem onClick={onClick ?  ()=>onClick(user) : ()=>handleClickToUser(user)} key={user.profileId} user = {user}/>
                ))
                : absenceText
            }
        </>
    );
}

export default UsersList;