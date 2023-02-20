package db

import (
	"context"
)

const findUsersByNickname = `-- name: FindUsersByNickname :many
SELECT id, nickname, fullname, avatar_url
FROM (
  SELECT id, nickname, fullname, avatar_url,
         ROW_NUMBER() OVER (ORDER BY id) as rownum
  FROM users
  WHERE nickname ILIKE '%' || $1 || '%'
) as subq
WHERE subq.rownum > $2
ORDER BY subq.rownum
LIMIT $3;
`

type FindUsersByNicknameParams struct {
	Nickname string `json:"nickname"`
	Offset   int32  `json:"offset"`
	Limit    int32  `json:"limit"`
}

func (q *Queries) FindUsersByNickname(ctx context.Context, arg FindUsersByNicknameParams) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, findUsersByNickname, arg.Nickname, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Nickname,
			&i.Fullname,
			&i.AvatarUrl,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return items, nil
}
