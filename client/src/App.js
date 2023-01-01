import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { Header } from './components/Header/Header'
import { Loading } from './components/Loading/Loading'
import { RoutesManager } from './components/Navigate/RoutesManager'
import { LoadingStatuses } from './models/LoadingStatuses'
import { fetchUserData } from './store/userSlice'
import { useLogout } from './utils/useLogout'

export function App() {
    const [userId, entranceLoadingStatus] = useSelector((state) => [
        state.user.userId,
        state.user.entranceLoadingStatus,
    ])

    const dispatch = useDispatch()
    const logout = useLogout()

    console.log('render APP')

    useEffect(() => {
        console.log('dispatch user id in app')
        dispatch(fetchUserData())
    }, [userId])

    function renderApplication() {
        if (entranceLoadingStatus === LoadingStatuses.loading) {
            console.log('render loading', entranceLoadingStatus)
            return (
                <div className="App">
                    <Header />
                    <Loading />
                </div>
            )
        } else if (entranceLoadingStatus === LoadingStatuses.error) {
            console.log('render error', entranceLoadingStatus)
            logout()
            return <p>Some error</p>
        }

        console.log('render routes', entranceLoadingStatus)
        return (
            <div className="App">
                <Header />
                <RoutesManager userId={userId} />
            </div>
        )
    }

    return renderApplication()
}
