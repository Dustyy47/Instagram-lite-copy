-- name: FindUsersByNickname :many
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
