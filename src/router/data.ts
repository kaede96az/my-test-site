import axios from 'axios'
import type { ISummaryItems } from '../types/Summary'
import type { IReportedDeathIssues } from '../types/ReportedDeath'
import type { IReportedMyocarditisIssues } from '@/types/ReportedMyocarditis'

const summaryRes = await axios.get<ISummaryItems>(
  'https://gist.githubusercontent.com/kaede96az/b9102295771f6c4bf0f3e98ea2d2e6f2/raw/50897adfbc7cf21466502490df976a5619c25247/summary.json'
)
export const SummaryItems = summaryRes.data

const reportedDeathRes = await axios.get<IReportedDeathIssues>(
  'https://gist.githubusercontent.com/kaede96az/88e2090c0a0f81615cd37abbfb5474d0/raw/4e865fb0a6a686116e720eb4c549aed02c1f3a21/reported-death-issues.json'
)
export const ReportedDeathIssues = reportedDeathRes.data

const reportedMyocarditisRes = await axios.get<IReportedMyocarditisIssues>(
  'https://gist.githubusercontent.com/kaede96az/4a8008d80d5e36840e89021918cfa27e/raw/e1ec3da421d78fe1efe096ee90b27502010a769a/myocarditis.json'
)
export const ReportedMyocarditisIssues = reportedMyocarditisRes.data
