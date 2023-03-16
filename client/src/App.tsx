import { useEffect } from 'react'
import { userActions } from 'store/slices/userSlice'
import { Header } from './components/Header/Header'
import { NavBar } from './components/NavBar/NavBar'
import { Loading } from './components/UI/Loading/Loading'
import { useLogout } from './hooks/useLogout'
import { Status } from './models/LoadingStatus'
import { RoutesManager } from './RoutesManager'
import { useAppDispatch, useAppSelector } from './store/hooks'

//TODO Написать useDebounce и отрефакторить вцелом Search
//TODO Добавить Loader в модальное окно подписок и подписчиков

export function App() {
    const entranceLoadingStatus = useAppSelector((state) => state.user.entranceLoadingStatus)

    const dispatch = useAppDispatch()
    const logout = useLogout()

    useEffect(() => {
        //TODO Handle exit and enter for online status
        //window.addEventListener('beforeunload', (event) => {})
        dispatch(userActions.getData())
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
