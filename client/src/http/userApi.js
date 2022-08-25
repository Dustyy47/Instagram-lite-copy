import {$authHost, $host, $staticHost} from "./index";
import jwtDecode from "jwt-decode";

export const login = async (email,password) => {
    try{
        const {data} = await $host.post('/auth/login',{email,password});
        localStorage.setItem('token',data);
        return jwtDecode(data);
    }catch(e){
        console.log(e);
    }
}

export const registration = async (inputData) => {
    try{
        const {data} = await $host.post('/auth/registration',inputData);
        localStorage.setItem('token',data);
        return jwtDecode(data);
    }catch(e){
        console.log(e.request.response);
    }
}

export const getProfileData = async(id) => {
    try{
        const {data} = await $authHost.get(`/profile/${id}`);
        return data;
    }catch(e){
        console.log(e.request.response);
    }
}

export const addPost = async(data) => {
    try{
       await $authHost.post('/profile/posts',data);
    }catch(e){
        console.log(e.request.response);
    }
}