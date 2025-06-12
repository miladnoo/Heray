import HeroSection from '@/components/HeroSection'
import HeraySignupForm from '@/components/HeraySignupForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-200/30 to-yellow-400/30 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-blue-400/30 rounded-full blur-xl"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full border border-white/20">
          <HeroSection />
          <HeraySignupForm />
        </div>
      </div>
    </main>
  )
}
