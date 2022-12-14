import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { LoadingStatuses } from '../../models/LoadingStatuses'
import { useCombinedSelector } from '../../selectors/selectors'
import { fetchProfileData } from '../../store/slices/profileSlice'
import { fetchLikePost, fetchSubscribe } from '../../store/slices/userSlice'
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

    const toggleSubscribe = async () => {
        dispatch(fetchSubscribe(profileOwnerInfo.id))
    }

    const handlePostClick = async (data) => {
        setExtendedPostData(data)
        setExtendedPostOpen(true)
    }

    const like = async (postId) => {
        await dispatch(fetchLikePost(postId))
    }

    if (loadingStatus === LoadingStatuses.loading) {
        return <Loading />
    }

    if (loadingStatus === LoadingStatuses.error) {
        return <NotFound />
    }

    //TODO ???????????????? ???????????? ?????? ???????????????? ??????????????????????, ???????????????? ???????????? ???? ??????????
    return (
        <section className="page">
            <div className="page-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                postData={extendedPostData}
                isActive={isExtendedPostOpen}
                setActive={() => setExtendedPostOpen(false)}
                likeInfo={{
                    onLike: like,
                    isLiked: isPostLiked(extendedPostData?._id, likedPosts),
                }}
            />
            <CreatingPost isActive={isCreatingPost} setActive={setCreatingPost} />
        </section>
    )
}
