export interface IReportedMyocarditisIssues{
  issues: IReportedMyocarditisIssue[]
}

export interface IReportedMyocarditisIssue {
  no: number
  age: number
  gender: string
  date_vaccinated: string
  date_occurred: string
  diff: string
  vaccine_name: string
  maker: string
  lot_no: string
  count: string
  basic_disease: string
  PT: string
  result_date: string
  result: string
  PT_by_expert: string
  evaluation: string
  level: string
  opinion: string
  remarks: string
}
