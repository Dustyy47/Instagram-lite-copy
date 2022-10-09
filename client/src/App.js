import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import React, {useEffect} from "react";
import Header from "./components/Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserData, LoadingStatuses, setId} from "./store/userSlice";
import Loading from "./components/Loading/Loading";
import {useLogout} from "./utils/useLogout";
import {authRoutes, publicRoutes} from "./routes";

function App() {

    const {userId, entranceLoadingStatus} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const logout = useLogout();

    let isAuth = userId != null;

    useEffect(() => {
        dispatch(setId());
    }, [])

    useEffect(() => {
        //TODO:Replace condition to something smarter
        if (userId)
            dispatch(fetchUserData());
    }, [userId])

    const getRoutes = (routes) => {
        return routes.map(route => (
            <Route key={route.path} path={route.path} exact={route.exact} element={<route.element/>}/>
        ))
    }

    if (entranceLoadingStatus === LoadingStatuses.loading) {
        return (
            <>
                <Header/>
                <Loading/>
            </>
        )
    }

    if (entranceLoadingStatus === LoadingStatuses.error) {
        logout();
    }

    return (
        <div className="App">
            <Header/>
            <Routes>
                {
                    isAuth
                        ? getRoutes(authRoutes)
                        : getRoutes(publicRoutes)
                }
                <Route exact path="*" element={
                    isAuth ?
                        <Navigate replace to={`/profile/${userId}`}/> :
                        <Navigate replace to="/auth/login"/>
                }/>
            </Routes>
        </div>
    );
}

export default App;
