import { useState } from 'react'
import { AiOutlineMail, AiOutlineUser } from 'react-icons/ai'
import { BsChatLeftText } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { getCorrectAvatarUrl } from '../../helpers/getCorrectUrl'
import { useUserAuthRedirect } from '../../hooks/useUserAuthRedirect'
import { checks, useFormValidator, useValidator, Validation } from '../../hooks/validators'
import { registration } from '../../http/authApi'
import { LOGIN_ROUTE } from '../../routes'
import { Button } from '../UI/Button/Button'
import { HideIcon } from '../HideIcon/HideIcon'
import { FileInput } from '../UI/Input/FileInput'
import { Input } from '../UI/Input/Input'
import styles from './Auth.module.scss'

interface RegistrationFormFields {
    email: string
    password: string
    passwordConfirm: string
    fullName: string
    nickName: string
    error: string
    avatarImage: File | undefined
    isPasswordHidden: boolean
    avatarPreviewUrl: string
}

const initialData: RegistrationFormFields = {
    email: '',
    password: '',
    passwordConfirm: '',
    fullName: '',
    nickName: '',
    error: '',
    avatarImage: undefined,
    isPasswordHidden: true,
    avatarPreviewUrl: '',
}

export function Registration() {
    const profileRedirect = useUserAuthRedirect()
    const [data, setData] = useState<RegistrationFormFields>({ ...initialData })
    const {
        email,
        password,
        passwordConfirm,
        fullName,
        nickName,
        error,
        avatarImage,
        isPasswordHidden,
        avatarPreviewUrl,
    } = data

    const { checkLength, checkEqual, checkName, checkEmail } = checks

    async function submit() {
        try {
            const data = new FormData()
            data.append('email', email)
            data.append('password', password)
            data.append('fullName', fullName)
            data.append('avatarImage', avatarImage as File)
            data.append('nickName', nickName)
            const response = await registration(data)
            profileRedirect(response.nickName as string)
        } catch (e) {
            const err = e as Error
            console.log(err.message)
            setData({ ...data, error: err.message })
        }
    }
    const userNameValidator = useValidator([
        new Validation(checkName, 'Неверный формат имени. Следуйте шаблону "Имя Фамилия"'),
    ])
    const nickNameValidator = useValidator([
        new Validation(checkLength(3, 25), 'Псевдоним должен быть длиной от 3 до 25 символов'),
    ])
    const emailValidator = useValidator([new Validation(checkEmail, 'Неверный формат почты')])
    const passwordValidator = useValidator([
        new Validation(checkLength(6, 25), 'Пароль должен быть длиной от 6 до 25 символов'),
    ])
    const passwordConfirmValidator = useValidator([
        new Validation(checkEqual(password, passwordConfirm), 'Введённые пароли не совпадают!'),
    ])

    const registerFormValidator = useFormValidator(
        userNameValidator,
        nickNameValidator,
        emailValidator,
        passwordValidator,
        passwordConfirmValidator
    )

    const loadAvatarPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const img = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onloadend = () => {
            setData({ ...data, avatarPreviewUrl: reader.result as string, avatarImage: img })
        }
    }

    return (
        <form className={styles.auth + ' ' + styles.registration}>
            <h1 className={styles.authTitle}>Регистрация</h1>
            <div className={styles.avatarLoadWrapper}>
                <FileInput
                    className={styles.avatarLoadButton}
                    style={{ fontSize: 18 }}
                    setSelectedFile={loadAvatarPreview}
                >
                    Загрузить аватар
                </FileInput>
                <img className={styles.avatarPreview} src={avatarPreviewUrl || getCorrectAvatarUrl('')} alt=" " />
            </div>
            <Input
                validator={userNameValidator}
                onChange={(value) => setData({ ...data, fullName: value })}
                value={fullName}
                name="Имя"
                validationMessageClassName={styles.validationMessage}
                groupClassName={styles.authInputGroup}
                className={styles.authInput}
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
                onChange={(value) => setData({ ...data, nickName: value })}
                value={nickName}
                name="Псевдоним"
                validationMessageClassName={styles.validationMessage}
                groupClassName={styles.authInputGroup}
                className={styles.authInput}
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
                onChange={(value) => setData({ ...data, email: value })}
                value={email}
                name="Почта"
                validationMessageClassName={styles.validationMessage}
                groupClassName={styles.authInputGroup}
                className={styles.authInput}
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
                onChange={(value) => setData({ ...data, password: value })}
                value={password}
                type={isPasswordHidden ? 'password' : 'text'}
                name="Пароль"
                validationMessageClassName={styles.validationMessage}
                groupClassName={styles.authInputGroup}
                className={styles.authInput}
                placeholder="Введите пароль"
            >
                <HideIcon
                    isHidden={isPasswordHidden}
                    toggle={() => setData({ ...data, isPasswordHidden: !data.isPasswordHidden })}
                />
            </Input>
            <Input
                validator={passwordConfirmValidator}
                onChange={(value) => setData({ ...data, passwordConfirm: value })}
                value={passwordConfirm}
                type={isPasswordHidden ? 'password' : 'text'}
                name="Подтвердить пароль"
                validationMessageClassName={styles.validationMessage}
                groupClassName={styles.authInputGroup}
                className={styles.authInput}
                placeholder="Введите пароль"
            >
                <HideIcon
                    isHidden={isPasswordHidden}
                    toggle={() => setData({ ...data, isPasswordHidden: !data.isPasswordHidden })}
                />
            </Input>
            {error}
            <div className={styles.buttons}>
                <Link className={styles.link} onClick={() => setData({ ...initialData })} to={LOGIN_ROUTE}>
                    У вас уже есть аккаунт ?
                </Link>
                <Button className={styles.submit} disabled={registerFormValidator.hasErrors()} onClick={submit}>
                    Регистрация
                </Button>
            </div>
        </form>
    )
}
