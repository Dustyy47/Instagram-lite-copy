import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getPosts, getProfileInfo, subscribe } from '../../http/userApi'
import { fetchLikePost, fetchUserData } from '../../store/userSlice'
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
    const [isLoading, setLoading] = useState(true)
    const [isSubscribed, setSubscribe] = useState(true)
    const [profileInfo, setProfileInfo] = useState(null)
    const [posts, setPosts] = useState([])
    const [isCreatingPost, setCreatingPost] = useState(false)
    const [extendedPostData, setExtendedPostData] = useState(undefined)
    const [isExtendedPostOpen, setExtendedPostOpen] = useState(false)

    const { likedPosts, subscribes: userSubscribes, isGuest } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const { id: profileId } = useParams()

    const fetchProfileData = async () => {
        setLoading(true)
        try {
            const profileInfo = await getProfileInfo(profileId)
            if (!profileInfo) {
                setLoading(false)
                return
            }
            const posts = await getPosts(profileId)
            document.title = profileInfo.fullName
            setProfileInfo(profileInfo)
            if (userSubscribes === null && !isGuest) {
                return
            }
            const isUserSubscribedOnProfile = isGuest
                ? false
                : !!userSubscribes.find((subscribe) => subscribe === profileInfo.profileId)
            setSubscribe(isUserSubscribedOnProfile)
            setPosts(posts)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        console.log('changed profileId or subscribes in profile')
        fetchProfileData()
    }, [profileId, userSubscribes])

    const toggleSubscribe = async () => {
        try {
            await subscribe(profileId)
            await dispatch(fetchUserData())
            setSubscribe(!isSubscribed)
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

    if (isLoading) {
        return <Loading />
    }

    if (!profileInfo) {
        return <NotFound />
    }

    return (
        <section className="page">
            <div className="page-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ProfileInfo
                        fullName={profileInfo.fullName || ''}
                        email={profileInfo.email || ''}
                        avatarUrl={`${process.env.REACT_APP_API_URL}/avatars/${profileInfo.avatarUrl}`}
                        subscribesId={profileInfo.subscribes}
                        subscribersId={profileInfo.subscribers}
                    />
                    {!isGuest && (
                        <ProfileButtons
                            isUserProfile={profileInfo.isUserProfile}
                            isSubscribed={isSubscribed}
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
                onPostAdded={fetchProfileData}
            />
        </section>
    )
}
