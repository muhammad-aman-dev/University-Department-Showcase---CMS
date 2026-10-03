"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NewsEventsNoticesSection({ news, events, notices }) {
  const hasContent = (news && news.length > 0) || (events && events.length > 0) || (notices && notices.length > 0);
  if (!hasContent) return null;

  return (
    <section className="bg-slate-100/60 py-24 border-t border-slate-200/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Latest News */}
          {news && news.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Latest News</h3>
                <Link href="/news" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {news.slice(0, 3).map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5"
                  >
                    <span className="text-[11px] font-semibold text-blue-600">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.excerpt}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {events && events.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Upcoming Events</h3>
                <Link href="/events" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {events.slice(0, 3).map((ev, idx) => (
                  <motion.div
                    key={ev._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5"
                  >
                    <span className="text-[11px] font-semibold text-emerald-600">
                      {ev.eventDate ? new Date(ev.eventDate).toLocaleDateString() : ""} {ev.startTime && `• ${ev.startTime}`}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{ev.title}</h4>
                    <p className="text-xs text-slate-600 mt-2">{ev.location || "Campus Venue"}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Notices */}
          {notices && notices.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Notices</h3>
                <Link href="/notices" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {notices.slice(0, 3).map((notice, idx) => (
                  <motion.div
                    key={notice._id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 border-l-4 border-blue-600"
                  >
                    <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">{notice.category}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{notice.title}</h4>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{notice.content}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}