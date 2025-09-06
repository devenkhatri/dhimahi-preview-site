'use client';

export default function HeroAnimation() {
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-2xl">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating tech icons */}
        <div className="absolute top-8 left-8 animate-bounce delay-100">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💻</span>
          </div>
        </div>
        
        <div className="absolute top-16 right-16 animate-bounce delay-300">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-20 animate-bounce delay-500">
          <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
        </div>
        
        <div className="absolute bottom-12 right-12 animate-bounce delay-700">
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
        </div>
        
        {/* Animated lines/connections */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7cc0ba" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#215b6f" stopOpacity="0.3"/>
            </linearGradient>
          </defs>
          
          <path 
            d="M50,50 Q200,100 350,50" 
            stroke="url(#lineGradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse"
          />
          <path 
            d="M50,150 Q200,200 350,150" 
            stroke="url(#lineGradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse delay-1000"
          />
          <path 
            d="M50,250 Q200,200 350,250" 
            stroke="url(#lineGradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse delay-2000"
          />
        </svg>
        
        {/* Central focus area */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-3xl">🚀</span>
            </div>
            <div className="mt-4 text-lg font-semibold text-gray-700 animate-fade-in">
              Digital Transformation
            </div>
          </div>
        </div>
        
        {/* Particle effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-primary/30 rounded-full animate-float`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}