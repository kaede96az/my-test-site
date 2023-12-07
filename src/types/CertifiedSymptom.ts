export interface ICertifiedSymptom {
  name: string
  counts: ICounts
}

export interface ICounts {
  male: number
  female: number
  sum: number
}