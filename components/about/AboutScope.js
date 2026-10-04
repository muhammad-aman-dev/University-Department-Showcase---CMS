export default function AboutScope({ scope }) {
    return (
      <section className="bg-[#0c3559] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              Academic & Professional Reach
            </p>
  
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Scope of the Department
            </h2>
  
            <div className="mx-auto mt-6 h-1 w-14 rounded-full bg-amber-400" />
  
            <p className="mt-8 text-sm leading-8 text-blue-100 sm:text-base">
              {scope}
            </p>
          </div>
        </div>
      </section>
    );
  }