import React, {useEffect} from 'react';
import styles from './Chat.module.scss'
import UsersList from "../UsersList/UsersList";
import {getConversations} from "../../http/userApi";
import {useDispatch, useSelector} from "react-redux";
import {setConversations} from "../../store/chatSlice";

function Chat() {

    const {messages,messageText,conversations} = useSelector(state => state.chat);
    const dispatch = useDispatch();

    const fetchConversations = async ()=>{
        const fetchedConversations = await getConversations();
        dispatch(setConversations(fetchedConversations));
        console.log(conversations);
    }

    useEffect(()=>{
        fetchConversations();
    },[])

    return (
        <div className={styles.root}>
            <div className={styles.chatsList}>
                <UsersList users={[]} title={''} absenceText={''} onClick={()=>console.log('click')}></UsersList>
            </div>
            <div className={styles.chat}></div>
        </div>
    );
}

export default Chat;