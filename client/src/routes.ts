import { Auth } from './components/Auth/Auth'
import { Chat } from './components/Chat/Chat'
import { Profile } from './components/Profile/Profile'

export const PROFILE_ROUTE = '/profile/:id'
export const LOGIN_ROUTE = '/auth/login'
export const REGISTER_ROUTE = '/auth/register'
export const CHAT_ROUTE = '/chat'

interface Route {
    path: string
    element: React.ReactElement
    exact: boolean
}

export const publicRoutes: Route[] = [
    {
        path: PROFILE_ROUTE,
        element: Profile,
        exact: false,
    },
    {
        path: LOGIN_ROUTE,
        element: Auth,
        exact: false,
    },
    {
        path: REGISTER_ROUTE,
        element: Auth,
        exact: true,
    },
]

export const authRoutes: Route[] = [
    ...publicRoutes,
    {
        path: CHAT_ROUTE,
        element: Chat,
        exact: true,
    },
]
