export interface ICertifiedHealthHazardIssues {
  issues: ICertifiedHealthHazardIssue[]
}

export interface ICertifiedHealthHazardIssue {
  gender: string
  age: number
  vaccine_name: string
  type: string
  basic_disease: string
  name: string
  result: string
  reason: string
  approved_date: string
}
