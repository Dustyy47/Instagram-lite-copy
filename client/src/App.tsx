import { useEffect } from 'react'
import './App.css'
import { Header } from './components/Header/Header'
import { Loading } from './components/Loading/Loading'
import { useLogout } from './hooks/useLogout'
import { LoadingStatus } from './models/LoadingStatus'
import { RoutesManager } from './RoutesManager'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchUserData } from './store/slices/userSlice'

//TODO Написать useDebounce и отрефакторить вцелом Search
//TODO Добавить Loader в модальное окно подписок и подписчиков

export function App() {
    const entranceLoadingStatus = useAppSelector((state) => state.user.entranceLoadingStatus)

    const dispatch = useAppDispatch()
    const logout = useLogout()

    console.log('render APP', entranceLoadingStatus)

    useEffect(() => {
        dispatch(fetchUserData())
    }, [])

    function renderApplication() {
        if (entranceLoadingStatus === LoadingStatus.loading) {
            return (
                <div className="App">
                    <Header />
                    <Loading />
                </div>
            )
        } else if (entranceLoadingStatus === LoadingStatus.error) {
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
