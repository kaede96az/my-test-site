export const SplitWithArrow = (value: string): string[] => {
	return value.replaceAll('\n', '').split('→')
}