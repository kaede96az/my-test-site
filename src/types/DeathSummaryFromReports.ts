export interface IDeathSummaryFromReportsRoot {
	death_summary_from_reports: IDeathSummaryFromReports
}

export interface IDeathSummaryFromReports {
	date: string
	sum_by_age: I2DItem[]
}

export interface I2DItem {
	x: string
	y: number
}