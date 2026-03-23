import { getMyClubs } from '@/actions/clubs'
import DashboardClient from './components/dashboard-client'

export default async function DashboardPage() {
  const { clubs } = await getMyClubs()

  return <DashboardClient initialClubs={clubs} />
}