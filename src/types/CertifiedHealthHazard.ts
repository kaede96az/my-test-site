export interface ICertifiedHealthHazardIssue {
  certified_date: string
  gender: string
  age: number[]
  vaccine_name: string
  description_of_claim: string
  symptoms: string[]
  judgment_result: string
  pre_existing_conditions: string[]
  reasons_for_repudiation: string[]
  remarks: string
  source_url: string
}
