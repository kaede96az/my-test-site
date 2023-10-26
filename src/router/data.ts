import axios from 'axios'
import type { ISummaryItems } from '../types/Summary'
import type { IReportedDeathIssues } from '../types/ReportedDeath'
import type { IReportedMyocarditisIssues } from '@/types/ReportedMyocarditis'
import { shallowRef } from 'vue'
import type { ICertifiedHealthHazardIssues } from '@/types/CertifiedHealthHazard'
import type { ICertifiedSymptoms } from '@/types/CertifiedSymptom'
import type { IReportedModernaIssues } from '@/types/Moderna'

const summaryRes = await axios.get<ISummaryItems>(
  'https://gist.githubusercontent.com/kaede96az/b9102295771f6c4bf0f3e98ea2d2e6f2/raw/d9b5e6504034581b0ef9963b5272df9eb1780441/summary.json'
)
export const SummaryItems = summaryRes.data

const reportedModernaRes = await axios.get<IReportedModernaIssues>(
  'https://gist.githubusercontent.com/kaede96az/c7c5e78406ca40ac23b4931492e44ec4/raw/8476396299a29af7e32c1293b08a62ddf2792bcd/moderna.json'
)
export const ReportedModernaIssues = reportedModernaRes.data

const reportedDeathRes = await axios.get<IReportedDeathIssues>(
  'https://gist.githubusercontent.com/kaede96az/88e2090c0a0f81615cd37abbfb5474d0/raw/4e865fb0a6a686116e720eb4c549aed02c1f3a21/reported-death-issues.json'
)
export const ReportedDeathIssues = reportedDeathRes.data

const reportedMyocarditisRes = await axios.get<IReportedMyocarditisIssues>(
  'https://gist.githubusercontent.com/kaede96az/4a8008d80d5e36840e89021918cfa27e/raw/e1ec3da421d78fe1efe096ee90b27502010a769a/myocarditis.json'
)
export const ReportedMyocarditisIssues = reportedMyocarditisRes.data

const certifiedHealthHazardRes = await axios.get<ICertifiedHealthHazardIssues>(
  'https://gist.githubusercontent.com/kaede96az/982f47e9e6613c77af9ba49acf818b7e/raw/d26623eda3724ed36dc41da508ba67d45736d184/certified-health-hazards.json'
)
export const CertifiedHealthHazardIssues = certifiedHealthHazardRes.data

const certifiedSymptomsRes = await axios.get<ICertifiedSymptoms>(
  'https://gist.githubusercontent.com/kaede96az/25e3d9708055f37b2d1fa01c0d0bb4f5/raw/17da725f66a1aa59844fb6d807cdfc97be61dbc7/certified-symptoms.json'
)
export const CertifiedSymptoms = certifiedSymptomsRes.data

export const AppBarTitle = shallowRef('副反応ダッシュボード')
export const AppBarColor = shallowRef('white')
