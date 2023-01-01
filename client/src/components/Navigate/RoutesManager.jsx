import { Navigate, Route, Routes } from 'react-router-dom'
import { authRoutes, publicRoutes } from '../../routes'

export function RoutesManager({ userId }) {
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
            {userId ? getRoutes(authRoutes) : getRoutes(publicRoutes)}
            <Route
                exact
                path="*"
                element={
                    userId ? (
                        <Navigate replace to={`/profile/${userId}`} />
                    ) : (
                        <Navigate replace to="/auth/login" />
                    )
                }
            />
        </Routes>
    )
}
