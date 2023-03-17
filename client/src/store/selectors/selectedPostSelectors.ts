import { RootState } from './../index'
export const getSelectedPostInitialInfo = (state: RootState) => ({
    post: state.selectedPost.post,
    isOpen: state.selectedPost.isOpen,
})
