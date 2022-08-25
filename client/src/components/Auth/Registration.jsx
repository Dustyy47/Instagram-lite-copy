import React, {useState} from 'react';
import Input from "../Input/Input";
import {AiOutlineMail, AiOutlineUser} from "react-icons/ai";
import {BsChatLeftText} from "react-icons/bs";
import {Link} from "react-router-dom";
import styles from './Auth.module.scss'
import HideIcon from "../HideIcon/HideIcon";
import Button from "../Button/Button";
import FileInput from "../Input/FileInput";

export const placeholderUrl = "https://ikiwi.website/alteks/wp-content/uploads/2020/11/avatar-placeholder.png";

function Registration({
                          email,
                          setEmail,
                          password,
                          setPassword,
                          fullName,
                          setFullName,
                          onRegister,
                          setAvatarImage,
                          nickName,
                          setNickName
                      }) {

    const [isPasswordHidden, setPasswordHidden] = useState(true);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState("");

    const loadAvatarPreview = e => {
        const img = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(img);
        reader.onloadend = () => {
            setAvatarPreviewUrl(reader.result);
            setAvatarImage(img);
        }
    }

    return (
        <form className={styles.auth}>
            <h1 className={styles.authTitle}>Регистрация</h1>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 150}}>
                <FileInput style={{fontSize: 18}} setSelectedFile={loadAvatarPreview}>Загрузить аватар</FileInput>
                {
                    avatarPreviewUrl ?
                        <img className={styles.avatarPreview} src={avatarPreviewUrl} alt=""/>
                        :
                        <img className={styles.avatarPreview} src={placeholderUrl} alt=""/>

                }
            </div>
            <Input onChange={value => setFullName(value)} value={fullName} name="Имя" placeholder="Введите полное имя">
                <AiOutlineUser style={{
                    marginRight: "10px",
                    fontSize: "23px",
                    transform: "translateY(2px)"
                }}/>
            </Input>
            <Input onChange={value => setNickName(value)} value={nickName} name="Псевдоним"
                   placeholder="Введите псевдоним">
                <BsChatLeftText style={{
                    marginRight: "10px",
                    fontSize: "23px",
                    transform: "translateY(2px)"
                }}/>
            </Input>
            <Input onChange={value => setEmail(value)} value={email} name="Почта" placeholder="Введите почту">
                <AiOutlineMail style={{
                    marginRight: "10px",
                    fontSize: "23px",
                    transform: "translateY(2px)"
                }}/>
            </Input>
            <Input onChange={value => setPassword(value)} value={password} type={isPasswordHidden ? "password" : "text"}
                   name="Пароль" placeholder="Введите пароль">
                <HideIcon toggleValue={isPasswordHidden} toggleAction={() => setPasswordHidden(!isPasswordHidden)}/>
            </Input>
            <div className={styles.buttons}>
                <Link className={styles.link}
                      to={"/auth/login"}>
                    {
                        <p>
                            У вас уже<br/> есть аккаунт ?
                        </p>
                    }
                </Link>
                <Button onClick={onRegister}>Регистрация</Button>
            </div>
        </form>
    );
}

export default Registration;