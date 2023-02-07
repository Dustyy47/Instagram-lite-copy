import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../helpers/getCorrectAvatarUrl'
import { isPostLiked } from '../../helpers/isLikedPost'
import { useCombinedSelector } from '../../hooks/useCombinedSelector'
import { Status } from '../../models/LoadingStatus'
import { ExtendedPostModel } from '../../models/PostModel'
import { useAppDispatch } from '../../store/hooks'
import { fetchProfileData } from '../../store/slices/profileSlice'
import { fetchLikePost, fetchSubscribe } from '../../store/slices/userSlice'
import { NotFound } from '../Errors/NotFound'
import { Loading } from '../Loading/Loading'
import { CreatingPost } from '../Posts/CreatingPost'
import { ExtendedPost } from '../Posts/ExtendedPost'
import { PostsList } from '../Posts/PostsList'
import styles from './Profile.module.scss'
import { ProfileButtons } from './ProfileButtons'
import { ProfileInfo } from './ProfileInfo'

export function Profile() {
    const [isCreatingPost, setCreatingPost] = useState(false)
    const [extendedPostData, setExtendedPostData] = useState<ExtendedPostModel>({
        postData: {
            _id: '',
            title: '',
            description: '',
            imageUrl: '',
        },
        isActive: false,
        likesCountWithoutUser: 0,
    })

    const { likedPosts, isGuest } = useCombinedSelector('user', ['likedPosts', 'isGuest'])
    const { profileOwnerInfo, loadingStatus } = useCombinedSelector('profile', ['profileOwnerInfo', 'loadingStatus'])

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

    const handlePostClick = useCallback(async function (data: ExtendedPostModel) {
        setExtendedPostData(data)
    }, [])

    const like = useCallback(async function (postId: string) {
        await dispatch(fetchLikePost(postId))
    }, [])

    const closeExtendedPost = useCallback(
        function () {
            setExtendedPostData({
                ...extendedPostData,
                isActive: false,
            })
        },
        [extendedPostData]
    )

    if (loadingStatus === Status.loading) {
        return <Loading />
    }

    if (loadingStatus === Status.error) {
        return <NotFound />
    }

    //TODO Изменить пропсы для дочерних компонентов, получать данные из стора
    return (
        <section className={styles.page}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    {}{' '}
                    <ProfileInfo
                        fullName={profileOwnerInfo.fullName || ''}
                        email={profileOwnerInfo.email || ''}
                        avatarUrl={getCorrectAvatarUrl(profileOwnerInfo.avatarUrl)}
                        subscribes={profileOwnerInfo.subscribes}
                        subscribers={profileOwnerInfo.subscribers}
                    />
                    {!isGuest && <ProfileButtons setCreatingPost={setCreatingPost} toggleSubscribe={toggleSubscribe} />}
                </div>
                <PostsList likedPosts={likedPosts} onLike={like} onClickPost={handlePostClick} />
            </div>
            <ExtendedPost
                authorInfo={profileOwnerInfo}
                postInfo={extendedPostData}
                setActive={closeExtendedPost}
                onLike={like}
                isLiked={isPostLiked(extendedPostData?.postData._id, likedPosts)}
            />
            <CreatingPost isActive={isCreatingPost} setActive={setCreatingPost} />
        </section>
    )
}
