export function resetState(state, initialState) {
    for (let field in state) {
        state[field] = initialState[field]
    }
}
