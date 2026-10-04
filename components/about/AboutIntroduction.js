export default function AboutIntroduction({ content }) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                Introduction
              </p>
  
              <h2 className="mt-2 text-2xl font-black tracking-tight text-blue-950 sm:text-3xl">
                About Our Department
              </h2>
            </div>
  
            <div className="text-sm leading-8 text-gray-600 sm:text-base">
              {content}
            </div>
          </div>
        </div>
      </section>
    );
  }