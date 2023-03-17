import { useEffect, useState } from 'react'
import { checks, useFormValidator, useValidator, Validation } from '../../hooks/validators'
import { useAppDispatch } from '../../store/hooks'
import { profileActions } from '../../store/slices/profileSlice'
import { Modal } from '../Modal/Modal'
import { Button } from '../UI/Button/Button'
import { FileInput } from '../UI/Input/FileInput'
import { Input } from '../UI/Input/Input'
import styles from './CreatingPost.module.scss'

//FIX PHOTO VALIDATION AND LAYOUT

interface CreatingPostProps {
    isActive: boolean
    setActive: (value: boolean) => any
}

export function CreatingPost({ isActive, setActive }: CreatingPostProps) {
    const { checkLength } = checks

    const [newPostTitle, setNewPostTitle] = useState('')
    const [newPostDescription, setNewPostDescription] = useState('')
    const [newPostImageUrl, setNewPostImageUrl] = useState('')
    const [newPostImage, setNewPostImage] = useState<File | null>(null)

    const titleValidator = useValidator([new Validation(checkLength(1, 30), 'Длина заголовка должна быть от 1 до 30 символов')])
    const descriptionValidator = useValidator([
        new Validation(checkLength(1, 300), 'Длина описания должна быть от 1 до 300 символов'),
    ])

    //const photoValidator = useValidator([new Validation((file) => !!file, 'Загрузите файл!')])
    const formValidator = useFormValidator(titleValidator, descriptionValidator)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isActive) {
            setNewPostImageUrl('')
            setNewPostTitle('')
            setNewPostDescription('')
            setNewPostImage(null)
            formValidator.hideAll()
        }
    }, [isActive])

    const loadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setNewPostImageUrl(reader.result as string)
        }
        setNewPostImage(file)
    }
    const createPost = async () => {
        setActive(false)
        const data = new FormData()
        data.append('title', newPostTitle)
        data.append('description', newPostDescription)
        data.append('img', newPostImage as Blob)
        dispatch(profileActions.addPost(data))
    }

    return (
        <Modal isActive={isActive} setActive={setActive} className={styles.modal}>
            <>
                <h3>Создание поста</h3>
                <hr />
                <Input
                    validator={titleValidator}
                    validationMessageClassName={styles.validationMessage}
                    className={styles.inputWrapper}
                    value={newPostTitle}
                    onChange={(value) => setNewPostTitle(value)}
                    isColumn
                    name="Заголовок"
                ></Input>
                <Input
                    validator={descriptionValidator}
                    validationMessageClassName={styles.validationMessage}
                    value={newPostDescription}
                    className={styles.inputWrapper}
                    onChange={(value) => setNewPostDescription(value)}
                    isColumn
                    name="Описание"
                ></Input>
                <FileInput
                    className={styles.addFileInputWrapper}
                    style={{ marginTop: 50 }}
                    needToValidate={isActive}
                    setSelectedFile={loadFile}
                />
                {newPostImageUrl && <img className={styles.preview} src={newPostImageUrl} alt="" />}
                <div className={styles.buttons}>
                    <Button className={styles.button} disabled={formValidator.hasErrors()} onClick={createPost}>
                        Создать
                    </Button>
                    <Button className={styles.button} onClick={() => setActive(false)}>
                        Отменить
                    </Button>
                </div>
            </>
        </Modal>
    )
}
