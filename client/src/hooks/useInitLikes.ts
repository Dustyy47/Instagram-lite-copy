import { WithLikes } from 'models/Generics'
import { PostModel } from 'models/PostModel'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'store/hooks'
import { likesActions, LikesMeta, LikeTarget } from 'store/slices/likesSlice'
import { CommentModel } from './../models/CommentModel'

export function useInitLikes<T extends PostModel | CommentModel>(target: WithLikes<T>, type: LikeTarget) {
    const dispatch = useAppDispatch()

    const likesMeta: LikesMeta = useMemo(
        () => ({
            id: target.data.id,
            isLikedMe: target.isLikedMe,
            numLikes: target.numLikes,
        }),
        [target.data.id]
    )

    useEffect(() => {
        dispatch(likesActions.addLikesMeta({ type, likesMeta }))
    }, [])
}
