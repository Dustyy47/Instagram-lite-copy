package util

import "database/sql"

func NullString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{}
	}
	
	return sql.NullString{String: s, Valid: true}
}