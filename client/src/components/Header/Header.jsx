import React, {useCallback, useEffect, useState} from 'react';
import styles from './Header.module.scss'
import Button from "../Button/Button";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setId} from "../../store/userSlice";
import {getProfileData} from "../../http/userApi";
import {placeholderUrl} from "../Auth/Registration";

function Header() {

    const [profileInfo,setProfileInfo] = useState(null);

    const  {userId,isLoading} = useSelector(state=>state.user);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const fetchData = async ()=>{
        try{
            if(!userId){
                setProfileInfo(null);
                return;
            }
            const {profileInfo} = await getProfileData(userId);
            setProfileInfo(profileInfo);
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
                    <Link to = {userId ? `/profile/${userId}` : '/auth/login'} className={styles.userInfo}>
                        {
                            profileInfo
                                ?
                                <img className={styles.avatar} src={process.env.REACT_APP_API_URL+'/avatars/'+profileInfo.avatarUrl} alt="ava"/>
                                :
                                <img className={styles.avatar} src={placeholderUrl} alt="ava"/>
                        }


                        <span className={styles.userName}>{profileInfo ? profileInfo.fullName : 'Гость'} </span>
                    </Link>
                </div>
                <nav>
                    <ul>
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