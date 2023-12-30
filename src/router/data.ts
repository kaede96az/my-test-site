import { shallowRef } from 'vue'

export const AppBarTitle = shallowRef('副反応ダッシュボード')
export const AppBarColor = shallowRef('white')

const DatasetsURL = import.meta.env.VITE_DATASETS_URL

export const MedicalInstitutionReportsURL = DatasetsURL + 'medical-institution-reports.json'
export const MedicalInstitutionSummaryURL = DatasetsURL + 'medical-institution-summary-from-reports.json'

export const CarditisReportsURL = DatasetsURL + 'carditis-reports.json'
export const CarditisSummaryURL = DatasetsURL + 'carditis-summary.json'

export const DeathReportsURL = DatasetsURL + 'death-reports.json'
export const DeathSummaryURL = DatasetsURL + 'death-summary.json'
export const DeathSummaryFromReportsURL = DatasetsURL + 'death-summary-from-reports.json'

export const CertifiedHealthHazardDataURL = DatasetsURL + 'certified-reports.json'
export const CertifiedSymptomsDataURL = DatasetsURL + 'certified-symptoms.json'
export const CertifiedSummaryURL = DatasetsURL + 'certified-summary.json'
