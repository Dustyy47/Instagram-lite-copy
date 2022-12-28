import React, { useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { checkEmail, checkLength, useFormValidator, useValidator, Validation } from '../../utils/Validation'
import Button from '../Button/Button'
import HideIcon from '../HideIcon/HideIcon'
import Input from '../Input/Input'
import styles from './Auth.module.scss'

function Login({ email, setEmail, password, setPassword, onLogin, resetFields, error }) {
    const emailValidator = useValidator([new Validation(checkEmail, 'Неверный формат почты')])
    const passwordValidator = useValidator([new Validation(checkLength(6, 25), 'Пароль должен быть длиной от 6 до 25 символов')])

    const loginFormValidator = useFormValidator(emailValidator, passwordValidator)

    const [isPasswordHidden, setPasswordHidden] = useState(true)

    return (
        <form className={styles.auth}>
            <h1 className={styles.authTitle}>Авторизация</h1>
            <Input
                validator={emailValidator}
                onChange={(value) => setEmail(value)}
                value={email}
                type="email"
                name="Почта"
                placeholder="Введите почту"
            >
                <AiOutlineMail
                    style={{
                        marginRight: '10px',
                        fontSize: '23px',
                        transform: 'translateY(2px)',
                    }}
                />
            </Input>
            <Input
                validator={passwordValidator}
                onChange={(value) => setPassword(value)}
                value={password}
                type={isPasswordHidden ? 'password' : 'text'}
                name="Пароль"
                placeholder="Введите пароль"
            >
                <HideIcon toggleValue={isPasswordHidden} toggleAction={() => setPasswordHidden(!isPasswordHidden)} />
            </Input>
            {error}
            <div className={styles.buttons}>
                <Link className={styles.link} onClick={resetFields} to="/auth/register">
                    <p>
                        У вас ещё
                        <br /> нет аккаунта ?
                    </p>
                </Link>
                <Button disabled={loginFormValidator.hasErrors()} onClick={onLogin}>
                    Войти
                </Button>
            </div>
        </form>
    )
}

export default Login
