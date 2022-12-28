import React from 'react'
import Button from '../Button/Button'

function ProfileButtons({ isUserProfile, setCreatingPost, isSubscribed, toggleSubscribe }) {
    return isUserProfile ? (
        <Button onClick={() => setCreatingPost(true)}>Создать пост</Button>
    ) : (
        <div style={{ display: 'flex', alignItems: 'top' }}>
            <Button style={{ margin: '0 20px' }}>Чат</Button>
            {isSubscribed ? (
                <Button onClick={toggleSubscribe}>Отписаться</Button>
            ) : (
                <Button onClick={toggleSubscribe}>Подписаться</Button>
            )}
        </div>
    )
}

export default ProfileButtons
