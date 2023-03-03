import { useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { useUserAuthRedirect } from '../../hooks/useUserAuthRedirect'
import { checks, useFormValidator, useValidator, Validation } from '../../hooks/validators'
import { login } from '../../http/authApi'
import { REGISTER_ROUTE } from '../../routes'
import { HideIcon } from '../HideIcon/HideIcon'
import { Button } from '../UI/Button/Button'
import { Input } from '../UI/Input/Input'
import styles from './Auth.module.scss'

export function Login() {
    const profileRedirect = useUserAuthRedirect()
    const [email, setEmail] = useState('dusteex@yandex.ru')
    const [password, setPassword] = useState('123456')
    const [error, setError] = useState('')

    function resetFields() {
        setEmail('')
        setPassword('')
        setError('')
    }

    async function submit() {
        try {
            const response = await login(email, password)
            setError('')
            profileRedirect(response.nickname || '')
        } catch (e) {
            let err = e as Error
            console.log(err.message)
            setError(err.message)
        }
    }

    const { checkLength, checkEmail } = checks
    const emailValidator = useValidator([new Validation(checkEmail, 'Неверный формат почты')])
    const passwordValidator = useValidator([
        new Validation(checkLength(6, 25), 'Пароль должен быть длиной от 6 до 25 символов'),
    ])

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
                className={styles.authInput}
                validationMessageClassName={styles.validationMessage}
                groupClassName={styles.authInputGroup}
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
                groupClassName={styles.authInputGroup}
                validationMessageClassName={styles.validationMessage}
                className={styles.authInput}
                placeholder="Введите пароль"
            >
                <HideIcon isHidden={isPasswordHidden} toggle={() => setPasswordHidden(!isPasswordHidden)} />
            </Input>
            {error}
            <div className={styles.buttons}>
                <Link className={styles.link} onClick={resetFields} to={REGISTER_ROUTE}>
                    У вас ещё нет аккаунта ?
                </Link>
                <Button className={styles.submit} disabled={loginFormValidator.hasErrors()} onClick={submit}>
                    Войти
                </Button>
            </div>
        </form>
    )
}
