import { Navigate, Route, Routes } from 'react-router-dom'
import { authRoutes, publicRoutes, RouteModel } from './routes'
import { useAppSelector } from './store/hooks'

export function RoutesManager() {
    const { nickname } = useAppSelector((state) => state.user.userProfile) || {}

    function getRoutes(routes: RouteModel[]) {
        return routes.map((route) => {
            return <Route key={route.path} path={route.path} element={<route.element />} />
        })
    }

    return (
        <Routes>
            {nickname ? getRoutes(authRoutes) : getRoutes(publicRoutes)}
            <Route
                path="*"
                element={nickname ? <Navigate replace to={`/profile/${nickname}`} /> : <Navigate replace to="/auth/login" />}
            />
        </Routes>
    )
}
