import { createClient } from '../../utils/supabase-server'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Profile</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">ID:</span> {user.id}</p>
          <p><span className="font-medium">Last Sign In:</span> {new Date(user.last_sign_in_at || '').toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome to ChainReaction</h2>
        <p className="mb-4">
          You're now logged in to your ChainReaction account. Here you can play games, view your stats,
          and participate in tournaments.
        </p>
        <div className="flex space-x-4">
          <a 
            href="/game/daily" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Daily Challenge
          </a>
          <a 
            href="/game/practice" 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Practice Mode
          </a>
        </div>
      </div>
    </div>
  )
} 