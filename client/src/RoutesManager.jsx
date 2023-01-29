import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { getRoutes } from './helpers/getRoutes'
import { authRoutes, publicRoutes } from './routes'

export function RoutesManager() {
    const nickName = useSelector((state) => state.user.nickName)

    return (
        <Routes>
            {nickName ? getRoutes(authRoutes) : getRoutes(publicRoutes)}
            <Route
                exact
                path="*"
                element={
                    nickName ? (
                        <Navigate replace to={`/profile/${nickName}`} />
                    ) : (
                        <Navigate replace to="/auth/login" />
                    )
                }
            />
        </Routes>
    )
}
