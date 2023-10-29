export interface ISummaryItems {
  suspected_issues: {
    source_info: ISourceInfo
    summary_items: ISummaryItem[]
  }
  certified_issues: {
    source_info: ISourceInfo
    summary_items: ISummaryItem[]
  }
  number_of_deaths_reported_by_age_group: IChartItem
  number_of_deaths_reported_by_vaccinated_times_group: IChartItem
}

export interface ISourceInfo {
  name: string
  date: string
  description: string
  url: string
}

export interface ISummaryItem {
  title: string
  data: string
  unit: string
}

export interface IChartItem {
  x_axis: IAxisData
  y_axis: IAxisData
}

export interface IAxisData {
  name: string
  data: number[]
}
