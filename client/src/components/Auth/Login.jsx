import React, {useState} from 'react';
import Input from "../Input/Input";
import {AiOutlineMail} from "react-icons/ai";
import {Link} from "react-router-dom";
import styles from './Auth.module.scss'
import HideIcon from "../HideIcon/HideIcon";
import Button from "../Button/Button";

function Login({email, setEmail, password, setPassword , onLogin}) {

    const [isPasswordHidden, setPasswordHidden] = useState(true);

    return (
        <form className={styles.auth}>
            <h1 className={styles.authTitle}>Авторизация</h1>
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
                      to="/auth/register">
                    <p>
                        У вас ещё<br/> нет аккаунта ?
                    </p>
                </Link>
                <Button onClick = {onLogin}>Войти</Button>
            </div>
        </form>
    );
}

export default Login;