import { RootState } from './../index'
export const getSelectedPostInitialInfo = (state: RootState) => ({
    post: state.extendedPost.post,
    isOpen: state.extendedPost.isOpen,
})
