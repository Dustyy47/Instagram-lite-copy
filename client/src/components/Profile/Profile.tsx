import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { extendedPostActions } from 'store/slices/extendedPostSlice'
import { getPostsWithCorrectImage } from '../../helpers/getCorrectUrl'
import { Status } from '../../models/LoadingStatus'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchProfileData } from '../../store/slices/profileSlice'
import { fetchSubscribe } from '../../store/slices/userSlice'
import { NotFound } from '../Errors/NotFound'
import { CreatingPost } from '../Posts/CreatingPost'
import { PostsList } from '../Posts/PostsList'
import { SelectedPost } from '../SelectedPost/SelectedPost'
import { Loading } from '../UI/Loading/Loading'
import styles from './Profile.module.scss'
import { ProfileButtons } from './ProfileButtons'
import { ProfileInfo } from './ProfileInfo'

export function Profile() {
    const [isCreatingPost, setCreatingPost] = useState(false)
    const isGuest = useAppSelector((state) => state.user.isGuest)
    const { profileOwnerInfo, loadingStatus, posts } = useAppSelector((state) => state.profile)

    const dispatch = useAppDispatch()
    const { nickname: pathProfileId = '' } = useParams<string>()

    useEffect(() => {
        dispatch(fetchProfileData({ nickname: pathProfileId }))
        dispatch(extendedPostActions.reset())
    }, [pathProfileId, dispatch])

    const toggleSubscribe = useCallback(
        async function () {
            dispatch(fetchSubscribe(profileOwnerInfo?.userID || 0))
        },
        [profileOwnerInfo?.userID]
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
                    <ProfileInfo className={styles.profileInfo} />
                    {!isGuest && <ProfileButtons setCreatingPost={setCreatingPost} toggleSubscribe={toggleSubscribe} />}
                </div>
                <PostsList posts={getPostsWithCorrectImage(posts)} />
                {/* <PostsList posts={getPostsMock(20)} /> */}
            </div>
            <SelectedPost />
            <CreatingPost isActive={isCreatingPost} setActive={setCreatingPost} />
        </section>
    )
}
