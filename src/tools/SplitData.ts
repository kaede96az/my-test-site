const delimiters = /[,、）\n]+/

export const SplitValue = (value: string): string[] => {
	return value.replaceAll("/", ",").split(delimiters).filter( n => n != '' && n != ' ')
}

export const SplitDate = (date: string): string[] => {
	return date.split(delimiters).filter( n => n != '' && n != ' ')
}

export const SplitWithSemicolon = (value: string): string[] => {
	return value.replaceAll(";", ",").split(delimiters).filter( n => n != '' && n != ' ')
}

export const SplitWithArrow = (value: string): string[] => {
	return value.replaceAll('\n', '').split('→')
}