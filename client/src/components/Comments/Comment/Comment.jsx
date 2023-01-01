import { Avatar } from '../../Avatar/Avatar'
import styles from './Comment.module.scss'

export function Comment({ authorInfo, commentInfo }) {
    return (
        <div className={styles.wrapper}>
            <Avatar
                nickName={authorInfo.nickName}
                url={authorInfo.avatarUrl}
                style={{ width: 45, height: 45, marginLeft: 10 }}
            />
            <div className={styles.infoWrapper}>
                <span className={styles.nickName}>{authorInfo.nickName}</span>
                <p className={styles.text}>
                    {' '}
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias consequatur
                    iure modi, quibusdam quod sapiente vel. Ab accusantium dolorem earum fugiat, in
                    neque nihil reiciendis similique soluta tempore tenetur. Lorem ipsum dolor sit
                    amet consectetur adipisicing elit. Repudiandae deserunt excepturi obcaecati
                    tenetur, hic molestiae. Ea, sequi cum! Officia deleniti possimus nobis eos
                    distinctio recusandae architecto aliquid nam, quae incidunt, odit mollitia vel,
                    veniam inventore adipisci labore quibusdam eum ex. Impedit aperiam, pariatur
                    odit amet molestias accusantium unde perspiciatis consequuntur reprehenderit
                    consequatur voluptatem id dolor debitis officia laudantium natus numquam nulla
                    qui voluptatum temporibus nostrum, est saepe. Adipisci dignissimos odio saepe
                    commodi quas doloribus autem quod asperiores debitis quidem architecto facere
                    veniam porro reiciendis tempore aliquam, rem error magnam, laudantium libero
                    deleniti! Deserunt, tenetur? Iste inventore facilis repudiandae iure repellat.
                </p>
            </div>
        </div>
    )
}
