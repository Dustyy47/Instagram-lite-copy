import { shallowEqual } from 'react-redux'
import { State } from '../models/State'
import { useAppSelector } from '../store/hooks'
import { RootState } from './../store/index'

type Selector = {
    [field: string]: any
}

function getSelector(state: RootState, slice: string, fields: string[]) {
    let selector: Selector = {}
    for (let field of fields) {
        selector[field] = (state as State)[slice][field]
    }
    return selector
}

/**  Using for getting different data from the same slice*/
export function useCombinedSelector(slice: string, fields: string[]) {
    return useAppSelector((state) => getSelector(state, slice, fields), shallowEqual)
}
