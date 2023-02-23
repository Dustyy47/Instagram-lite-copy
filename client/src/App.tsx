import { useEffect } from 'react'
import { Header } from './components/Header/Header'
import { Loading } from './components/UI/Loading/Loading'
import { NavBar } from './components/NavBar/NavBar'
import { useLogout } from './hooks/useLogout'
import { Status } from './models/LoadingStatus'
import { RoutesManager } from './RoutesManager'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchUserData } from './store/slices/userSlice'

//TODO Написать useDebounce и отрефакторить вцелом Search
//TODO Добавить Loader в модальное окно подписок и подписчиков

export function App() {
    const entranceLoadingStatus = useAppSelector((state) => state.user.entranceLoadingStatus)

    const dispatch = useAppDispatch()
    const logout = useLogout()

    useEffect(() => {
        dispatch(fetchUserData())
    }, [])

    function renderApplication() {
        if (entranceLoadingStatus === Status.loading) {
            return (
                <div className="App">
                    <Header />
                    <Loading />
                </div>
            )
        } else if (entranceLoadingStatus === Status.error) {
            logout()
            return <p>Some error</p>
        }

        return (
            <div className="App">
                <Header />
                <RoutesManager />
                <NavBar />
            </div>
        )
    }

    return renderApplication()
}
