import Link from 'next/link'
import { createClient } from '../utils/supabase-server'
import { redirect } from 'next/navigation'
import DemoSection from '../components/landing/DemoSection'
import TestComponent from '../components/landing/TestComponent'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to ChainReaction</h1>
        
        <p className="text-xl mb-8">
          A competitive word puzzle game where players complete chains by finding connecting words
          that differ by exactly one letter.
        </p>
        
        {/* Test Component */}
        <TestComponent />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Sign In
          </Link>
          <Link 
            href="/signup"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Create Account
          </Link>
        </div>
        
        {/* Demo Section */}
        <DemoSection />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Daily Challenges</h2>
            <p>
              Test your skills with a new word chain puzzle every day and compete 
              on the global leaderboard.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Multiple Game Modes</h2>
            <p>
              Play timed challenges, endless mode, or compete against other players
              in head-to-head battles.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Tournaments</h2>
            <p>
              Join competitive tournaments with brackets and prizes for the ultimate
              word chain champions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 