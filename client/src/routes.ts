import { Login } from './components/Auth/Login'
import { Registration } from './components/Auth/Registration'
import { Chat } from './components/Chat/Chat'
import { Profile } from './components/Profile/Profile'

export const PROFILE_ROUTE = '/profile/:nickname'
export const LOGIN_ROUTE = '/auth/login'
export const REGISTER_ROUTE = '/auth/register'
export const CHAT_ROUTE = '/chat'

export interface RouteModel {
    path: string
    element: () => JSX.Element
}

export const publicRoutes: RouteModel[] = [
    {
        path: PROFILE_ROUTE,
        element: Profile,
    },
    {
        path: LOGIN_ROUTE,
        element: Login,
    },
    {
        path: REGISTER_ROUTE,
        element: Registration,
    },
]

export const authRoutes: RouteModel[] = [
    ...publicRoutes,
    {
        path: CHAT_ROUTE,
        element: Chat,
    },
]
