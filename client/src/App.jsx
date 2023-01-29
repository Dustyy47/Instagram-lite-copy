import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { Header } from './components/Header/Header'
import { Loading } from './components/Loading/Loading'
import { useLogout } from './hooks/useLogout'
import { LoadingStatuses } from './models/LoadingStatuses'
import { RoutesManager } from './RoutesManager'
import { fetchUserData } from './store/slices/userSlice'

//TODO Написать useDebounce и отрефакторить вцелом Search
//TODO Добавить Loader в модальное окно подписок и подписчиков

export function App() {
    const entranceLoadingStatus = useSelector((state) => state.user.entranceLoadingStatus)

    const dispatch = useDispatch()
    const logout = useLogout()

    console.log('render APP', entranceLoadingStatus)

    useEffect(() => {
        dispatch(fetchUserData())
    }, [])

    function renderApplication() {
        if (entranceLoadingStatus === LoadingStatuses.loading) {
            return (
                <div className="App">
                    <Header />
                    <Loading />
                </div>
            )
        } else if (entranceLoadingStatus === LoadingStatuses.error) {
            logout()
            return <p>Some error</p>
        }

        return (
            <div className="App">
                <Header />
                <RoutesManager />
            </div>
        )
    }

    return renderApplication()
}
