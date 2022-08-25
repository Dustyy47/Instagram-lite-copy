import React, {useState} from 'react';
import {useLocation,useNavigate} from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import {login} from '../../http/userApi.js'
import {registration} from '../../http/userApi.js'
import {useDispatch} from "react-redux";
import {setId} from "../../store/userSlice";

function Auth() {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let isLogin = location.pathname === '/auth/login';

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [avatarImage,setAvatarImage] = useState(null);
    const [fullName, setFullName] = useState("");
    const [nickName,setNickName] = useState("");

    const onLogin = async ()=>{
        try{
            const response = await login(email,password);
            navigate(`/profile/${response.userId}`);
            redirect(response.nickName);
        }catch(e){
            console.log(e);
        }
    }

    const onRegister = async ()=>{
        try{
            const data = new FormData;
            data.append('email',email);
            data.append('password',password);
            data.append('fullName',fullName);
            data.append('avatarImage',avatarImage);
            data.append('nickName',nickName);
            const response = await registration(data);
            redirect(response.nickName);
        }catch(e){
            console.log(e);
        }
    }

    const redirect = userId=>{
        navigate(`/profile/${userId}`);
        dispatch(setId());
    }

    const loginProps = {
        email, setEmail, password, setPassword , onLogin
    }

    const registrationProps = {
        ...loginProps, fullName, setFullName ,setAvatarImage, onRegister,nickName,setNickName
    }

    if (isLogin)
        return (
            <Login {...loginProps}/>
        )
    return (
        <Registration {...registrationProps}/>
    )
}

export default Auth;