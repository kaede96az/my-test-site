const factorMillisecondsToDay = 24*60*60*1000

export const ElapsedDays = (vaccinatedDate: string, targetDate: string): number | undefined => {
	const vDate = new Date(vaccinatedDate.replaceAll(' ', '').replaceAll('\n', ''))
	const tDate = new Date(targetDate.replaceAll(' ', '').replaceAll('\n', ''))
	if(Number.isNaN(vDate.getTime()) || Number.isNaN(tDate.getTime())) return undefined

	const diffOnMilliseconds = Math.abs( (tDate as any) - (vDate as any) )
	if(Number.isNaN(diffOnMilliseconds)) return undefined

	return diffOnMilliseconds / factorMillisecondsToDay
}