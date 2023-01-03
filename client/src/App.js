import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import { Header } from './components/Header/Header'
import { Loading } from './components/Loading/Loading'
import { RoutesManager } from './components/Navigate/RoutesManager'
import { LoadingStatuses } from './models/LoadingStatuses'
import { fetchUserData } from './store/slices/userSlice'
import { useLogout } from './utils/useLogout'

//TODO Вынести селекторы в отдельные файлы
//TODO Отрефакторить scss
//TODO Мемоизировать селекторы
//TODO Убирать расширенный пост при переходе на другую страницу
//TODO Написать useDebounce и отрефакторить вцелом Search

export function App() {
    const entranceLoadingStatus = useSelector((state) => state.user.entranceLoadingStatus)

    const dispatch = useDispatch()
    const logout = useLogout()

    console.log('render APP', entranceLoadingStatus)

    useEffect(() => {
        console.log('dispatch user data in app')
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
