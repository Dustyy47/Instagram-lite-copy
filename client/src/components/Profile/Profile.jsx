import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../helpers/getCorrectAvatarUrl'
import { isPostLiked } from '../../helpers/isLikedPost'
import { useCombinedSelector } from '../../hooks/useCombinedSelector'
import { LoadingStatus } from '../../models/LoadingStatus'
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
    const [extendedPostData, setExtendedPostData] = useState({ postData: {} })

    const { likedPosts, isGuest } = useCombinedSelector('user', ['likedPosts', 'isGuest'])
    const { posts, profileOwnerInfo, loadingStatus } = useCombinedSelector('profile', [
        'posts',
        'profileOwnerInfo',
        'loadingStatus',
    ])

    const dispatch = useDispatch()
    const { id: pathProfileId } = useParams()
    console.log('render profile')

    useEffect(() => {
        dispatch(fetchProfileData(pathProfileId))
    }, [pathProfileId])

    async function toggleSubscribe() {
        dispatch(fetchSubscribe(profileOwnerInfo.id))
    }

    async function handlePostClick(data) {
        setExtendedPostData(data)
    }

    async function like(postId) {
        await dispatch(fetchLikePost(postId))
    }

    function closeExtendedPost() {
        setExtendedPostData({
            ...extendedPostData,
            isActive: false,
        })
    }

    if (loadingStatus === LoadingStatus.loading) {
        return <Loading />
    }

    if (loadingStatus === LoadingStatus.error) {
        return <NotFound />
    }

    //TODO Изменить пропсы для дочерних компонентов, получать данные из стора
    return (
        <section className={styles.page}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <ProfileInfo
                        fullName={profileOwnerInfo.fullName || ''}
                        email={profileOwnerInfo.email || ''}
                        avatarUrl={getCorrectAvatarUrl(profileOwnerInfo.avatarUrl)}
                        subscribesId={profileOwnerInfo.subscribes}
                        subscribersId={profileOwnerInfo.subscribers}
                    />
                    {!isGuest && (
                        <ProfileButtons
                            setCreatingPost={setCreatingPost}
                            toggleSubscribe={() => toggleSubscribe()}
                        />
                    )}
                </div>
                <PostsList
                    likedPosts={likedPosts}
                    posts={posts}
                    onLike={like}
                    onClickPost={handlePostClick}
                />
            </div>
            <ExtendedPost
                authorInfo={profileOwnerInfo}
                postInfo={extendedPostData}
                setActive={closeExtendedPost}
                likeInfo={{
                    onLike: like,
                    isLiked: isPostLiked(extendedPostData?.postData._id, likedPosts),
                }}
            />
            <CreatingPost isActive={isCreatingPost} setActive={setCreatingPost} />
        </section>
    )
}
