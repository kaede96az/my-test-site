import type { ISourceInfo } from "./General"

export interface IReportedMyocarditisIssue {
  no: number
  age: string
  gender: string
  vaccinated_date: string
  onset_dates: string[]
  days_to_onset: string
  vaccine_name: string
  manufacturer: string
  lot_no: string
  vaccinated_times: string
  pre_existing_disease_names: string[]
  PT_names: string[]
  gross_result_dates: string[]
  gross_results: string[]
  evaluated_PT: string
  evaluated_result: string
  brighton_classification: string
  expert_opinion: string
  remarks: string
  source: ISourceInfo
}
