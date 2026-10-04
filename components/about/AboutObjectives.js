import {
    Target,
    CheckCircle2,
  } from "lucide-react";
  
  export default function AboutObjectives({ objectives }) {
    if (!objectives?.length) {
      return null;
    }
  
    return (
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 md:py-20">
          
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950 text-amber-400">
                <Target size={20} />
              </div>
  
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                  Our Goals
                </p>
  
                <h2 className="mt-1 text-2xl font-black text-blue-950 sm:text-3xl">
                  Objectives
                </h2>
              </div>
            </div>
  
            <div className="mt-8 space-y-3">
              {objectives.map((objective, index) => (
                <div
                  key={`${objective}-${index}`}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-900"
                  />
  
                  <p className="text-sm leading-6 text-gray-600">
                    {objective}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }