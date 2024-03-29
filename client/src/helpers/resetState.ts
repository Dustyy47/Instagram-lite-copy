import { State } from '../models/State'

export function resetState(state: State, initialState: State) {
    for (let field in state) {
        state[field as string] = initialState[field as string]
    }
}
