import React, { useEffect, useState} from 'react';
import styles from './Header.module.scss'
import Button from "../Button/Button";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setId} from "../../store/userSlice";
import {getProfileInfo} from "../../http/userApi";
import {placeholderUrl} from "../Auth/Registration";
import Search from "./Search";

function Header() {

    const [profileInfo,setProfileInfo] = useState(null);
    const [loading,setLoading] = useState(true);

    const  {userId,nickName} = useSelector(state=>state.user);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const fetchData = async ()=>{
        try{
            setLoading(true);
            if(!userId){
                setProfileInfo(null);
                setLoading(false);
                return;
            }
            const profileInfo = await getProfileInfo(userId);
            setProfileInfo(profileInfo);
            setLoading(false);
        }catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        fetchData();
    },[userId])

    function exit(){
        localStorage.removeItem('token');
        dispatch(setId());
        navigate('/auth/login');
    }

    return (
        <header className={styles.header}>
            <div className={styles.wrapper}>
                <div>
                    <Link to = {userId ? `/profile/${nickName}` : '/auth/login'} className={styles.userInfo}>
                        {
                            loading ?
                                <img className={styles['avatar--loading']} src="#" alt=""/>
                                :
                            profileInfo
                                ?
                                <img className={styles.avatar} src={process.env.REACT_APP_API_URL+'/avatars/'+profileInfo.avatarUrl} alt=""/>
                                :
                                <img className={styles.avatar} src={placeholderUrl} alt=""/>
                        }


                        <span className={styles.userName}>{loading ? "" : profileInfo ? profileInfo.fullName : 'Гость'} </span>
                    </Link>
                </div>
                <nav>
                    <ul className={styles.list}>
                        <li>
                            <Search/>
                        </li>
                        <li>
                            {
                                userId &&
                                <Button style = {{width: 100 , height : 50}} onClick={exit}>
                                    Выйти
                                </Button>
                            }
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;