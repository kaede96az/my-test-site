export interface ICertifiedSymptoms {
  issues: ICertifiedSymptom[]
}

export interface ICertifiedSymptom {
  symptom_name: string
  male_count: number
  female_count: number
  sum_count: number
}
