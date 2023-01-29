import { Route } from 'react-router-dom'

export function getRoutes(routes) {
    return routes.map((route) => (
        <Route key={route.path} path={route.path} exact={route.exact} element={<route.element />} />
    ))
}
