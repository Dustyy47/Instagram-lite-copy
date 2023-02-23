import { getPostsMock } from 'mock/posts'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../helpers/getCorrectUrl'
import { useCombinedSelector } from '../../hooks/useCombinedSelector'
import { Status } from '../../models/LoadingStatus'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchProfileData } from '../../store/slices/profileSlice'
import { fetchSubscribe } from '../../store/slices/userSlice'
import { NotFound } from '../Errors/NotFound'
import { Loading } from '../UI/Loading/Loading'
import { CreatingPost } from '../Posts/CreatingPost'
import { PostsList } from '../Posts/PostsList'
import { SelectedPost } from '../SelectedPost/SelectedPost'
import styles from './Profile.module.scss'
import { ProfileButtons } from './ProfileButtons'
import { ProfileInfo } from './ProfileInfo'

export function Profile() {
    const [isCreatingPost, setCreatingPost] = useState(false)
    const isGuest = useAppSelector((state) => state.user.isGuest)
    const { profileOwnerInfo, loadingStatus, posts } = useCombinedSelector('profile', [
        'profileOwnerInfo',
        'loadingStatus',
        'posts',
    ])

    const dispatch = useAppDispatch()
    const { id: pathProfileId = '' } = useParams<string>()

    useEffect(() => {
        dispatch(fetchProfileData(pathProfileId))
    }, [pathProfileId, dispatch])

    const toggleSubscribe = useCallback(
        async function () {
            dispatch(fetchSubscribe(profileOwnerInfo._id))
        },
        [profileOwnerInfo._id]
    )

    if (loadingStatus === Status.loading) {
        return <Loading />
    }

    if (loadingStatus === Status.error) {
        return <NotFound />
    }

    return (
        <section className={styles.page}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <ProfileInfo
                        profileOwnerInfo={{
                            ...profileOwnerInfo,
                            avatarUrl: getCorrectAvatarUrl(profileOwnerInfo.avatarUrl),
                        }}
                        className={styles.profileInfo}
                    />
                    {!isGuest && <ProfileButtons setCreatingPost={setCreatingPost} toggleSubscribe={toggleSubscribe} />}
                </div>
                <PostsList posts={getPostsMock(20)} />
            </div>
            <SelectedPost />
            {/* <ExtendedPost
                authorInfo={profileOwnerInfo}
                postInfo={extendedPostData}
                setActive={closeExtendedPost}
                onLike={() => {}}
                isLiked={isPostLiked(extendedPostData?.postData._id, likedPosts)}
            /> */}
            <CreatingPost isActive={isCreatingPost} setActive={setCreatingPost} />
        </section>
    )
}
