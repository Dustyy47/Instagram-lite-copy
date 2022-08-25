import React, {useEffect, useState} from 'react';
import Input from "../Input/Input";
import FileInput from "../Input/FileInput";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import {addPost} from "../../http/userApi";

function CreatingPost({isActive , setActive , onPostAdded}) {
    const [newPostImageUrl, setNewPostImageUrl] = useState("");
    const [newPostImage,setNewPostImage] = useState(null);
    const [newPostTitle,setNewPostTitle] = useState("");

    useEffect(()=>{
        if(!isActive){
            setNewPostImageUrl("");
            setNewPostTitle("");
            setNewPostImage(null);
        }
    },[isActive])

    const loadFile = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setNewPostImageUrl(reader.result);
        }
        setNewPostImage(file);
    }
    const createPost = async () => {
        setActive(false)
        const data = new FormData();
        data.append('title',newPostTitle);
        data.append('img',newPostImage);
        await addPost(data);
        onPostAdded();
    }

    return (
        <Modal isActive = {isActive}  setActive = {setActive}>
            <h3>Создание поста</h3>
            <hr/>
            <Input value={newPostTitle} onChange={value => setNewPostTitle(value)} isColumn name="Заголовок"></Input>
            <FileInput setSelectedFile={loadFile}/>
            {
                newPostImageUrl &&
                <img className="preview" src={newPostImageUrl} alt=""/>
            }
            <div className="buttons">
                <Button onClick={createPost}>Создать</Button>
                <Button onClick={() => setActive(false)}>Отменить</Button>
            </div>
        </Modal>
    );
}

export default CreatingPost;