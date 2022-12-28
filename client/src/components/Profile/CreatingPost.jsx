import { useEffect, useState } from 'react'
import { addPost } from '../../http/userApi'
import { checkLength, useFormValidator, useValidator, Validation } from '../../utils/Validation'
import { Button } from '../Button/Button'
import { FileInput } from '../Input/FileInput'
import { Input } from '../Input/Input'
import { Modal } from '../Modal/Modal'
import './Profile.scss'

export function CreatingPost({ isActive, setActive, onPostAdded }) {
    const [newPostImageUrl, setNewPostImageUrl] = useState('')
    const [newPostImage, setNewPostImage] = useState(null)
    const [newPostTitle, setNewPostTitle] = useState('')
    const [newPostDescription, setNewPostDescription] = useState('')

    const titleValidator = useValidator([
        new Validation(checkLength(1, 30), 'Длина заголовка должна быть от 1 до 30 символов'),
    ])
    const descriptionValidator = useValidator([
        new Validation(checkLength(1, 300), 'Длина описания должна быть от 1 до 300 символов'),
    ])

    const photoValidator = useValidator([new Validation((file) => !!file, 'Загрузите файл!')])

    const formValidator = useFormValidator(titleValidator, descriptionValidator, photoValidator)

    useEffect(() => {
        if (!isActive) {
            setNewPostImageUrl('')
            setNewPostTitle('')
            setNewPostDescription('')
            setNewPostImage(null)
        }
    }, [isActive])

    const loadFile = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setNewPostImageUrl(reader.result)
        }
        setNewPostImage(file)
    }
    const createPost = async () => {
        setActive(false)
        const data = new FormData()
        data.append('title', newPostTitle)
        data.append('description', newPostDescription)
        data.append('img', newPostImage)
        await addPost(data)
        onPostAdded()
    }

    return (
        <Modal isActive={isActive} setActive={setActive}>
            <h3>Создание поста</h3>
            <hr />
            <Input
                validator={titleValidator}
                needToValidate={isActive}
                styleWrapper={{ marginTop: 50 }}
                value={newPostTitle}
                onChange={(value) => setNewPostTitle(value)}
                isColumn
                name="Заголовок"
            ></Input>
            <Input
                validator={descriptionValidator}
                needToValidate={isActive}
                value={newPostDescription}
                onChange={(value) => setNewPostDescription(value)}
                isColumn
                name="Описание"
            ></Input>
            <FileInput
                validator={photoValidator}
                needToValidate={isActive}
                setSelectedFile={loadFile}
            />
            {newPostImageUrl && <img className="preview" src={newPostImageUrl} alt="" />}
            <div className="buttons">
                <Button disabled={formValidator.hasErrors()} onClick={createPost}>
                    Создать
                </Button>
                <Button onClick={() => setActive(false)}>Отменить</Button>
            </div>
        </Modal>
    )
}
