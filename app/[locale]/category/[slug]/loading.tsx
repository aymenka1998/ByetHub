export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80" />
          ))}
        </div>
      </div>
    </main>
  );
}