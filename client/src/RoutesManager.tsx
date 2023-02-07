import { Navigate, Route, Routes } from 'react-router-dom'
import { authRoutes, publicRoutes, RouteModel } from './routes'
import { useAppSelector } from './store/hooks'

export function RoutesManager() {
    const nickName = useAppSelector((state) => state.user.nickName)

    function getRoutes(routes: RouteModel[]) {
        return routes.map((route) => {
            return <Route key={route.path} path={route.path} element={<route.element />} />
        })
    }

    return (
        <Routes>
            {nickName ? getRoutes(authRoutes) : getRoutes(publicRoutes)}
            <Route
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
