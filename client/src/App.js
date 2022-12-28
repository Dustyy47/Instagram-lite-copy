import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import Header from './components/Header/Header'
import Loading from './components/Loading/Loading'
import { RoutesManager } from './components/Navigate/RoutesManager'
import { LoadingStatuses } from './models/LoadingStatuses'
import { fetchUserData } from './store/userSlice'
import { useLogout } from './utils/useLogout'

export function App() {
    const [userId, entranceLoadingStatus] = useSelector((state) => [
        state.user.userId,
        state.user.entranceLoadingStatus,
    ])

    function renderApplication() {
        if (entranceLoadingStatus === LoadingStatuses.loading) {
            return (
                <div className="App">
                    <Header />
                    <Loading />
                </div>
            )
        }
        if (entranceLoadingStatus === LoadingStatuses.error) {
            logout()
        }

        return (
            <div className="App">
                <Header />
                <RoutesManager userId={userId} />
            </div>
        )
    }

    const dispatch = useDispatch()
    const logout = useLogout()

    useEffect(() => {
        dispatch(fetchUserData())
    }, [userId])

    return renderApplication()
}
