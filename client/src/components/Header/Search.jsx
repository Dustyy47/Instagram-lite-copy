import React, {useCallback, useEffect, useRef, useState} from 'react';
import Input from "../Input/Input";
import {BiSearchAlt2} from "react-icons/bi";
import UsersList from "../UsersList/UsersList";
import style from './Search.module.scss'
import {searchUsers} from "../../http/userApi";

const searchTime = 333;

function Search() {
    const [value,setValue] = useState("");
    const [areUsersHidden,setUsersHidden] = useState(true);
    const [users,setUsers] = useState([]);
    const [isLoading , setLoading] = useState(false);
    let timer = useRef();
    let input = useRef();

    const focusSearch = () => {
        if(value)
            setUsersHidden(false);
    }

    console.log('рендеринг')

    const fetchUsers = async ()=>{
        const foundUsers = await searchUsers(input.current.value);
        console.log(input.current.value,foundUsers);
        if(foundUsers)
            setUsers([...foundUsers])
        setLoading(false);
    }

    const typing = async value => {
        value = value.trim();
        setValue(value);
        if(!value){
            setUsers([])
            setUsersHidden(true);
            return
        }
        setUsersHidden(false);
        setLoading(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(fetchUsers,searchTime);
    }

    const unFocusSearch = () => {
        setUsersHidden(true);
    }

    return (
        <div className={style.wrapper}>
        <Input forwardRef={input} onBlur = {unFocusSearch} onFocus = {focusSearch} value={value} onChange={typing} styleInput = {{width:250,height:40,color:"#363636"}} styleWrapper = {{margin:"0 30px"}}>
            <BiSearchAlt2 style = {{fontSize:32,fill:"#ededed",margin:"0 15px"}}/>
        </Input>
            <div className={`${style.users} ${areUsersHidden ? style.hidden : ''}`}>
                <UsersList isLoading={isLoading} users={users}  title={""}>
                    <p>Пользователей с таким именем не существует</p>
                    <p>🙁</p>
                </UsersList>
            </div>
        </div>
    );
}

export default Search;