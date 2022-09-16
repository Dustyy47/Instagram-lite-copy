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

export const likePost = async(postId) => {
    try{
        await $authHost.put(`/profile/posts/${postId}`)
    }catch(e){
        console.log(e.request.response);
    }
}

export const searchUsers = async(nickname) =>{
    try{
        const {data} = await $host.get(`/profile/find/${nickname}`)
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