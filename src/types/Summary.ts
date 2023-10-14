export interface ISummaryItem {
  title: string
  data: string
  unit: string
}

export interface ISummaryItems {
  reported_items: ISummaryItem[]
  certified_items: ISummaryItem[]
}
