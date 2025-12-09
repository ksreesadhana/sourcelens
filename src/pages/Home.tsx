export default function Home() {
  const bgImageUrl = new URL('../assets/Web1-Scrape-bg.png', import.meta.url).href;
  
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background Image with Opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to SourceLens
        </h1>
        <p className="text-2xl text-gray-700 mb-8">
          Turn any webpage into instant intelligence
        </p>
      </div>
    </div>
  );
}
