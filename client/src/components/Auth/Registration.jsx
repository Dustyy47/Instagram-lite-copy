import React, { useState } from 'react'
import { AiOutlineMail, AiOutlineUser } from 'react-icons/ai'
import { BsChatLeftText } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { checkEmail, checkLength, checkName, useFormValidator, useValidator, Validation } from '../../utils/Validation'
import Button from '../Button/Button'
import HideIcon from '../HideIcon/HideIcon'
import FileInput from '../Input/FileInput'
import Input from '../Input/Input'
import styles from './Auth.module.scss'

export const placeholderUrl = 'https://ikiwi.website/alteks/wp-content/uploads/2020/11/avatar-placeholder.png'

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
    setNickName,
    resetFields,
    error,
}) {
    const userNameValidator = useValidator([new Validation(checkName, 'Неверный формат имени. Следуйте шаблону "Имя Фамилия"')])
    const nickNameValidator = useValidator([new Validation(checkLength(3, 25), 'Псевдоним должен быть длиной от 3 до 25 символов')])
    const emailValidator = useValidator([new Validation(checkEmail, 'Неверный формат почты')])
    const passwordValidator = useValidator([new Validation(checkLength(6, 25), 'Пароль должен быть длиной от 6 до 25 символов')])

    const registerFormValidator = useFormValidator(userNameValidator, nickNameValidator, emailValidator, passwordValidator)

    const [isPasswordHidden, setPasswordHidden] = useState(true)
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('')

    const loadAvatarPreview = (e) => {
        const img = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onloadend = () => {
            setAvatarPreviewUrl(reader.result)
            setAvatarImage(img)
        }
    }

    return (
        <form className={styles.auth}>
            <h1 className={styles.authTitle}>Регистрация</h1>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: 150,
                    marginBottom: 70,
                }}
            >
                <FileInput style={{ fontSize: 18 }} setSelectedFile={loadAvatarPreview}>
                    Загрузить аватар
                </FileInput>
                {avatarPreviewUrl ? (
                    <img className={styles.avatarPreview} src={avatarPreviewUrl} alt="" />
                ) : (
                    <img className={styles.avatarPreview} src={placeholderUrl} alt="" />
                )}
            </div>
            <Input
                validator={userNameValidator}
                onChange={(value) => setFullName(value)}
                value={fullName}
                name="Имя"
                placeholder="Введите полное имя"
            >
                <AiOutlineUser
                    style={{
                        marginRight: '10px',
                        fontSize: '23px',
                        transform: 'translateY(2px)',
                    }}
                />
            </Input>
            <Input
                validator={nickNameValidator}
                onChange={(value) => setNickName(value)}
                value={nickName}
                name="Псевдоним"
                placeholder="Введите псевдоним"
            >
                <BsChatLeftText
                    style={{
                        marginRight: '10px',
                        fontSize: '23px',
                        transform: 'translateY(2px)',
                    }}
                />
            </Input>
            <Input
                validator={emailValidator}
                onChange={(value) => setEmail(value)}
                value={email}
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
                <Link className={styles.link} onClick={resetFields} to={'/auth/login'}>
                    {
                        <p>
                            У вас уже
                            <br /> есть аккаунт ?
                        </p>
                    }
                </Link>
                <Button disabled={registerFormValidator.hasErrors()} onClick={onRegister}>
                    Регистрация
                </Button>
            </div>
        </form>
    )
}

export default Registration
