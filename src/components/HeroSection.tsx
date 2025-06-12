export default function HeroSection() {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-lg animate-pulse">
        🏛️
      </div>
      
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3" dir="rtl">
        انجمن هری
      </h1>
      
      {/* Subtitle */}
      <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-6">
        Heray Organization
      </h2>
      
      {/* Description */}
      <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
        Join our community organization dedicated to connecting Afghans from Herat. 
        Together, we preserve our heritage, support our community, and build a brighter future.
      </p>
    </div>
  )
} 