import React from 'react';

function ProfileInfo({fullName,email,avatarUrl}) {
    return (
        <div className="page-header">
            <img className="page-avatar"
                 src={avatarUrl}
                 alt="avatar"/>
            <div className="page-header__content">
                <h3 className="page-header__name">{fullName}</h3>
                <p className="page-header__email">{email}</p>
            </div>
        </div>
    );
}

export default ProfileInfo;