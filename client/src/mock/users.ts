import { generateMocks } from 'helpers/generateMocks'
import { UserModel } from 'models/ProfileOwnerModel'

const mockTemplate = {
    userID: 1,
    nickname: 'mock',
    fullname: 'ha ha',
    avatarUrl: '',
}

export const generateMockUsers = (count: number) =>
    generateMocks<UserModel>(mockTemplate, count, (mock, key) => ({ ...mock, userID: key }))
