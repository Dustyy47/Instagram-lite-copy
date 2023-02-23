import { PostModel } from './../models/PostModel'

const postMock: PostModel = {
    likes: [],
    _id: '1',
    imageUrl: 'https://www.pokepedia.fr/images/thumb/7/76/Pikachu-DEPS.png/800px-Pikachu-DEPS.png',
    title: 'test',
    description: 'test',
    postedBy: 'me',
}

export function getPostsMock(count: number) {
    const mock: PostModel[] = []
    for (let i = 1; i < count + 1; i++) {
        mock.push({ ...postMock, _id: `${i}` })
    }
    return mock
}
