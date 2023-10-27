export interface IReportedPfizerIssues {
  issues: IReportedPfizerIssue[]
}

export interface IReportedPfizerIssue {
  no: number
  age: number
  gender: string
  date_vaccinated: string
  date_occurred: string
  diff: string
  vaccine_name: string
  same: string
  maker: string
  lot_no: string
  PT_name: string
  causual: string
  severity: string
  result_date: string
  result: string
  source: string
}
