import './App.css';
import {BrowserRouter, Route, Routes,Navigate} from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Profile from "./components/Profile/Profile";
import jwtDecode from "jwt-decode";
import {useCallback, useEffect, useState} from "react";
import Header from "./components/Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {setId} from "./store/userSlice";


function App() {

    const  {userId,isLoading} = useSelector(state=>state.user);
    const dispatch = useDispatch()

    useEffect( ()=>{
        dispatch(setId());
    },[])

    if(isLoading) return ( "Загрузка..." )

    return (
            <div className="App">
                <Header/>
                <Routes>
                    <Route path="/profile/:id" element={<Profile/>}/>
                    <Route path="/auth/login" element={<Auth/>}/>
                    <Route path="/auth/register" element={<Auth/>}/>
                    <Route exact path="*" element={!userId ? <Navigate replace to="/auth/login"/> : <Navigate replace to = {`/profile/${userId}`}/>}/>
                </Routes>
            </div>
    );
}

export default App;
