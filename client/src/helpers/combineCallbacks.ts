import { AnyFunction } from 'models/CallbacksTypes'

export function combineCallbacks<T>(...callbacks: AnyFunction[]) {
    return (arg: T) => {
        for (let callback of callbacks) {
            if (typeof callback === 'function') callback(arg)
        }
    }
}
