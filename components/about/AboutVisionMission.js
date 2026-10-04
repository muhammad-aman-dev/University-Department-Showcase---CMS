export default function AboutVisionMission({
    vision,
    mission,
  }) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-20">
          
          <div className="mb-10 text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
              Our Direction
            </p>
  
            <h2 className="mt-2 text-2xl font-black text-blue-950 sm:text-3xl">
              Vision & Mission
            </h2>
          </div>
  
          <div className="grid gap-6 md:grid-cols-2">
            
            {vision && (
              <article className="rounded-2xl border border-blue-100 bg-blue-50/50 p-7">
                <h3 className="text-xl font-black text-blue-950">
                  Vision
                </h3>
  
                <div className="mt-4 text-sm leading-7 text-gray-600">
                  {vision}
                </div>
              </article>
            )}
  
            {mission && (
              <article className="rounded-2xl border border-amber-100 bg-amber-50/50 p-7">
                <h3 className="text-xl font-black text-blue-950">
                  Mission
                </h3>
  
                <div className="mt-4 text-sm leading-7 text-gray-600">
                  {mission}
                </div>
              </article>
            )}
  
          </div>
        </div>
      </section>
    );
  }