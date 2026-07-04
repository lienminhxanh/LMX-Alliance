export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loader-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes loader-pulse {
            0%, 100% { transform: scale(0.9); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          .animate-loader-spin {
            animation: loader-spin 1.2s linear infinite;
          }
          .animate-loader-pulse {
            animation: loader-pulse 2s ease-in-out infinite;
          }
        `}} />
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Circular progress track */}
          <svg className="absolute inset-0 w-full h-full animate-loader-spin" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="22"
              fill="none"
              stroke="#defbbc" // light mint green
              strokeWidth="2.5"
              className="opacity-40"
            />
            <circle
              cx="25"
              cy="25"
              r="22"
              fill="none"
              stroke="#8ec63f" // brand green
              strokeWidth="2.5"
              strokeDasharray="35 150"
              strokeLinecap="round"
            />
          </svg>
          {/* Beautiful realistic leaf in center */}
          <div className="animate-loader-pulse">
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
            >
              <defs>
                <linearGradient id="loader-leaf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8ec63f" />
                  <stop offset="100%" stopColor="#015231" />
                </linearGradient>
              </defs>
              {/* Main leaf blade */}
              <path
                d="M16 2 C10 5, 4 11, 5 18 C6 24, 10 28, 16 30 C22 28, 26 24, 27 18 C28 11, 22 5, 16 2Z"
                fill="url(#loader-leaf-grad)"
              />
              {/* Midrib */}
              <path
                d="M16 3 C15.5 12, 15.8 22, 16 29"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
              />
              {/* Side veins */}
              <path
                d="M16 12 C12 10, 8 11, 7 14 M16 17 C12 15, 9 16, 8 19 M16 12 C20 10, 24 11, 25 14 M16 17 C20 15, 23 16, 24 19"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
