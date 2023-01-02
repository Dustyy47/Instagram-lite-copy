import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { authRoutes, publicRoutes } from '../../routes'

export function RoutesManager() {
    const nickName = useSelector((state) => state.user.nickName)

    function getRoutes(routes) {
        return routes.map((route) => (
            <Route
                key={route.path}
                path={route.path}
                exact={route.exact}
                element={<route.element />}
            />
        ))
    }

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
