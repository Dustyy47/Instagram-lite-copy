import { shallowEqual, useSelector } from 'react-redux'

function getSelector(state, reducer, fields) {
    let selector = {}
    for (let field of fields) {
        selector[field] = state[reducer][field]
    }
    return selector
}

/**  Using for getting different data from the same reducer*/
export function useCombinedSelector(reducer, fields) {
    return useSelector((state) => getSelector(state, reducer, fields), shallowEqual)
}
