export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Leaf spinner */}
        <svg
          width="48" height="48" viewBox="0 0 24 24" fill="#5a9e1a"
          style={{ animation: 'leaf-spin-slow 1.8s linear infinite' }}
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 19.15L5.71 21l1-.91C7.39 19.41 8.1 19 9 19c2 0 2 2 4 2s2-2 4-2 2 2 4 2v-2c-1 0-1.5-.5-2-1-1-1-1.5-2.5-3-2.5-1 0-1.33.33-2 1-.67.67-1 1.5-2 1.5-1 0-1.5-.5-2-1A12.5 12.5 0 0 1 17 8z" />
        </svg>
        <p className="text-sm" style={{ color: '#6B7280' }}>Đang tải...</p>
      </div>
    </div>
  );
}
