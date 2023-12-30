import type { ISourceInfo } from "./General"

export interface IMedicalInstitutionReport {
	no: number
	age: number
	gender: string
	vaccinated_dates: string[]
	onset_dates: string[]
	days_to_onset: number[]
	vaccine_name: string
	manufacturer: string
	lot_no: string
	PT_names: string[]
	causal_relationship: string
	severity: string
	gross_result_dates: string
	gross_results: string
	source: ISourceInfo
}