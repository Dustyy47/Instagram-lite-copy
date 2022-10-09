import {setId} from "../store/userSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

export function useLogout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    return ()=>{
        localStorage.removeItem('token');
        dispatch(setId());
        navigate('/auth/login');
    }
}