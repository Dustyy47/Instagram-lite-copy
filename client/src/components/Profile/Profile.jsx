import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { subscribe } from '../../http/userApi'
import { LoadingStatuses } from '../../models/LoadingStatuses'
import { fetchProfileData as fetchData, fetchProfileData } from '../../store/slices/profileSlice'
import { fetchLikePost, fetchUserData } from '../../store/slices/userSlice'
import { getCorrectAvatarUrl } from '../../utils/getCorrectAvatarUrl'
import { isPostLiked } from '../../utils/isLikedPost'
import { NotFound } from '../Errors/NotFound'
import { Loading } from '../Loading/Loading'
import { ExtendedPost } from '../Posts/ExtendedPost'
import { PostsList } from '../Posts/PostsList'
import { CreatingPost } from './CreatingPost'
import './Profile.scss'
import { ProfileButtons } from './ProfileButtons'
import { ProfileInfo } from './ProfileInfo'

export function Profile() {
    const [isCreatingPost, setCreatingPost] = useState(false)
    const [extendedPostData, setExtendedPostData] = useState(undefined)
    const [isExtendedPostOpen, setExtendedPostOpen] = useState(false)

    const { likedPosts, isGuest } = useSelector((state) => state.user)
    const { posts, profileInfo, isUserSubscribed, loadingStatus } = useSelector(
        (state) => state.profile
    )

    const dispatch = useDispatch()
    const { id: profileId } = useParams()

    useEffect(() => {
        dispatch(fetchData(profileId))
    }, [profileId])

    const toggleSubscribe = async () => {
        try {
            await subscribe(profileId)
            await dispatch(fetchUserData())
            //setSubscribe(!isSubscribed)
        } catch (e) {
            console.log(e)
        }
    }

    const handlePostClick = async (data) => {
        setExtendedPostData(data)
        setExtendedPostOpen(true)
    }

    const like = async (postId) => {
        await dispatch(fetchLikePost(postId))
    }

    console.log('render profile')

    if (loadingStatus === LoadingStatuses.loading) {
        return <Loading />
    }

    if (loadingStatus === LoadingStatuses.error) {
        return <NotFound />
    }

    //TODO Изменить пропсы для дочерних компонентов, получать данные из стора
    return (
        <section className="page">
            <div className="page-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ProfileInfo
                        fullName={profileInfo.fullName || ''}
                        email={profileInfo.email || ''}
                        avatarUrl={getCorrectAvatarUrl(profileInfo.avatarUrl)}
                        subscribesId={profileInfo.subscribes}
                        subscribersId={profileInfo.subscribers}
                    />
                    {!isGuest && (
                        <ProfileButtons
                            isUserProfile={profileInfo.isUserProfile}
                            isSubscribed={isUserSubscribed}
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
                authorInfo={profileInfo}
                postData={extendedPostData}
                isActive={isExtendedPostOpen}
                setActive={() => setExtendedPostOpen(false)}
                likeInfo={{
                    onLike: like,
                    isLiked: isPostLiked(extendedPostData?._id, likedPosts),
                }}
            />
            <CreatingPost
                isActive={isCreatingPost}
                setActive={setCreatingPost}
                onPostAdded={() => dispatch(fetchProfileData(profileId))}
            />
        </section>
    )
}
