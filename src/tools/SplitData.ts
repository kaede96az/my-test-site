const delimiters = /[,、）\n]+/

export const SplitValue = (value: string): string[] => {
	return value.replaceAll("/", ",").split(delimiters)
}

export const SplitDate = (date: string): string[] => {
	return date.split(delimiters)
}