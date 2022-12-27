import React, {useEffect, useState} from 'react';
import Modal from "../Modal/Modal";
import styles from './Post.module.scss'
import LikeBtn from "../LikeBtn/LikeBtn";
import Input from "../Input/Input";
import Button from "../Button/Button";
import {getComments, sendComment} from "../../http/userApi";
import Comments from "../Comments/Comments";
import Avatar from "../../Avatar/Avatar";
import {getCorrectAvatarUrl} from "../../utils/getCorrectAvatarUrl";
import auth from "../Auth/Auth";

const ExtendedPost = ({
                          isActive,
                          setActive,
                          postData,
                          authorInfo,
                          likeInfo: {onLike, isLiked}
                      }) => {
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const like = e => {
        console.log(e)
        onLike(postData?._id);
    }

    async function fetchSendComment(e) {
        await sendComment(commentText, postData._id);
        setCommentText("");
    }

    async function fetchComments() {
        if (!postData) return;
        let fetchedComments = await getComments(postData?._id);
        console.log('COMMENTS', fetchedComments);
        setComments(fetchedComments);
    }

    useEffect(() => {
        fetchComments();
    }, [postData])

    return (
        <Modal isActive={isActive} setActive={() => setActive()} modalStyles={{maxWidth: 1500, minHeight: 800}}>
            <div className={styles.extended}>
                <img className={styles.photo} src={`${process.env.REACT_APP_API_URL}/${postData?.imageUrl}`} alt=""/>
                <div className={styles.info}>
                    <div className={styles.header}>
                        <div className={styles.profileInfo}>
                            <Avatar url={getCorrectAvatarUrl(authorInfo.avatarUrl)}/>
                            <p className={styles.nickName}>{authorInfo?.nickName}</p>
                        </div>
                        <LikeBtn isLiked={isLiked} onLike={like} likesCount={postData?.likesCountWithoutUser + +isLiked}
                                 className={styles.likeBtn}/>
                    </div>
                    <div className={styles.content}>
                        <h3 className={styles.title}>{postData?.title}</h3>
                        <p>{postData?.description}</p>
                    </div>
                    <Comments comments={comments}/>
                    <form className={styles.sendForm}>
                        <Input className={styles.commentInput} value={commentText} onChange={v => setCommentText(v)}/>
                        <Button className={styles.sendCommentBtn} onClick={fetchSendComment}>Отправить</Button>
                    </form>
                    <div>

                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ExtendedPost;