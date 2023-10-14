export interface IReportedDeathIssues {
  issues: IReportedDeathIssue[]
}

export interface IReportedDeathIssue {
  no: number
  age: number
  gender: string
  date_vaccinated: Date
  date_occurred: Date
  lot_no: string
  count: string
  basic_disease: string
  cause: string
  PT: string
  method: string
  causual_relationship: string
  other_possibility: string
  evaluation1: string
  comment1: string
  evaluation2: string
  comment2: string
  document_no: string
  case_no: string
  maker: string
  vaccine_name: string
}
