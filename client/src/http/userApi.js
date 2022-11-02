import {$authHost, $host, $staticHost} from "./index";
import jwtDecode from "jwt-decode";

export const login = async (email,password) => {
    try{
        const {data} = await $host.post('/auth/login',{email,password});
        localStorage.setItem('token',data);
        return jwtDecode(data);
    }catch(e){
        throw new Error(e?.response?.data?.message);
    }
}

export const registration = async (inputData) => {
    try{
        const {data} = await $host.post('/auth/registration',inputData);
        localStorage.setItem('token',data);
        return jwtDecode(data);
    }catch(e){
        console.log(e);
        const errors = e?.response?.data;
        let errorMessage = '';
        if(Array.isArray(errors)){
            errors.forEach(error => errorMessage += error.message);
        }
        else errorMessage = errors.message;
        throw new Error(errorMessage);
    }
}

export const subscribe = async(id) => {
    try{
        await $authHost.put(`/profile/${id}/subscribe`)
    }catch(e){
        console.log(e.request.response);
    }
}

export const getProfileInfo = async(id) => {
    try{
        const {data} = await $authHost.get(`/profile/${id}`);
        return data;
    }catch(e){
        console.log(e.request.response);
    }
}

export const getPosts = async(id) => {
    try{
        const {data} = await $authHost.get(`/profile/${id}/posts`);
        return data;
    }catch(e){
        console.log(e.request.response);
    }
}

export const getUserInfo = async() => {
    try{
        const {data} = await $authHost.get('/profile/me');
        return data;
    }catch(e){
        // jwt expired
        console.log(e);

    }
}


export const addPost = async(data) => {
    try{
       await $authHost.post('/profile/posts',data);
    }catch(e){
        console.log(e.request.response);
    }
}

export const likePost = async(postId) => {
    try{
        await $authHost.put(`/profile/posts/${postId}`)
    }catch(e){
        console.log(e.request.response);
    }
}

export const searchUsers = async(nickname,limit,skip) =>{
    try{
        const {data} = await $host.get(`/profile/find/${nickname}` + (limit ? `?limit=${limit}` : '') + (skip ? `&skip=${skip}` : ''))
        return data;
    }catch(e){
        console.log(e.request.response);
    }
}

export const getConversations = async() => {
    try{
        const {data} = await $authHost.get('/chat');
        return data;
    }catch(e){
        console.log(e.request.response);
    }
}