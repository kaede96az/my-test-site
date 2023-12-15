import type { ISourceInfo } from "./General"

export interface ICarditisSummaryRoot {
	carditis_summary: ICarditisSummary
	carditis_issues: {
		date: string
		issues_with_vaccine_name: ICarditisIssue[]
	}
}

export interface ICarditisSummary {
	date: string
	total: number
	myocarditis: number
	pericarditis: number
	source: ISourceInfo
}

export interface ICarditisIssue {
	vaccine_name: string
	myocarditis_count: number
	pericarditis_count: number
}