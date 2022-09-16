import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Profile from "./components/Profile/Profile";
import {useEffect} from "react";
import Header from "./components/Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {setId, setInfo} from "./store/userSlice";
import {getUserInfo} from "./http/userApi";
import io from 'socket.io-client';
import Chat from "./components/Chat/Chat";

function App() {

    const socket = io.connect(process.env.REACT_APP_API_URL);
    const {userId, isLoading} = useSelector(state => state.user);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setId());
    }, [])

    useEffect(() => {
        const setUserInfo = async () => {
            if (userId) {
                const userInfo = await getUserInfo();
                dispatch(setInfo(userInfo));
            }
        }
        setUserInfo();
    }, [userId])

    if (isLoading) return ("Загрузка...")

    return (
        <div className="App">
            <Header/>
            <Routes>
                <Route path="/profile/:id" element={<Profile/>}/>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/auth/login" element={<Auth/>}/>
                <Route path="/auth/register" element={<Auth/>}/>
                <Route exact path="*" element={!userId ? <Navigate replace to="/auth/login"/> :
                    <Navigate replace to={`/profile/${userId}`}/>}/>
            </Routes>
        </div>
    );
}

export default App;
