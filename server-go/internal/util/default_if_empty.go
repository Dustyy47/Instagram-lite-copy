package util

func DefaultIfEmpty (input, defaultStr string) string {
	if input == "" {
		return defaultStr
	}
	
	return input
}