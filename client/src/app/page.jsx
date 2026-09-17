"use client";

import React from 'react';
import Link from 'next/link';
import { Shield, Zap, Users, MessageSquare, ArrowRight, CheckCircle2, LayoutDashboard, Clock, FileText, BellRing, PieChart } from 'lucide-react';
import MeteorLogo from '../components/MeteorLogo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)] font-sans selection:bg-[var(--color-brand-primary)] selection:text-[var(--color-brand-primary-foreground)]">
      
      {/* Navbar */}
      <nav className="py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="CampusConnect" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold tracking-tight">CampusConnect</span>
        </div>
        
        <div className="hidden md:flex gap-8 items-center text-sm font-medium text-[var(--color-text-secondary)]">
          <a href="#features" className="hover:text-[var(--color-text-primary)] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[var(--color-text-primary)] transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-[var(--color-text-primary)] transition-colors">Testimonials</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
            Sign in
          </Link>
          <Link href="/login" className="flex items-center gap-2 bg-[var(--color-bg-elevated)] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-all shadow-md hover:shadow-lg">
            Get started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <div className="space-y-8 relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[var(--color-brand-soft)] text-[var(--color-brand-primary)] px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide">
              <Zap size={14} className="fill-current" /> AI-Powered Campus Management
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Campus issues, <br/>
              <span className="bg-[var(--color-brand-primary)] text-white px-2 rounded-lg inline-block mt-2 mb-2 shadow-sm">resolved</span> before <br/>
              they escalate.
            </h1>
            
            <p className="text-lg sm:text-xl text-[var(--color-text-muted)] leading-relaxed max-w-lg">
              CampusConnect digitises your campus complaint pipeline — from submission to resolution. NLP classification, smart staff assignment, SLA enforcement, and real-time analytics, out of the box.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/login" className="flex items-center justify-center gap-2 bg-[var(--color-bg-elevated)] text-white px-8 py-4 rounded-full text-base font-medium hover:bg-black transition-all shadow-md hover:shadow-xl w-full sm:w-auto">
                Start for free <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="flex items-center justify-center gap-2 bg-white text-[var(--color-text-primary)] border border-[var(--color-border-default)] px-8 py-4 rounded-full text-base font-medium hover:bg-[var(--color-bg-subtle)] transition-all w-full sm:w-auto">
                Sign in
              </Link>
            </div>
          </div>

          <div className="relative z-10 lg:pl-10">
            {/* Mock Floating Ticket Card */}
            <div className="bg-white border border-[var(--color-border-default)] p-6 sm:p-8 rounded-[32px] shadow-2xl relative">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-semibold text-[var(--color-text-muted)] tracking-wider">#CC-A3F2-9K1M</span>
                <span className="bg-[var(--color-brand-soft)] text-[var(--color-brand-primary)] px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">In Progress</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-4">Lights not working — Block A, 2nd Floor</h3>
              
              <div className="flex gap-2 mb-8">
                <span className="border border-[var(--color-border-default)] text-[var(--color-text-muted)] text-[11px] font-semibold px-2.5 py-1 rounded-md">ELECTRICAL</span>
                <span className="bg-red-50 text-red-600 text-[11px] font-bold px-2.5 py-1 rounded-md">HIGH</span>
              </div>
              
              <div className="bg-[var(--color-bg-subtle)] rounded-2xl p-4 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary)] text-white flex items-center justify-center text-xs font-bold shrink-0">K</div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">Assigned to Kartik Sharma · <span className="text-[var(--color-text-muted)] font-normal">SLA: 4h remaining</span></p>
              </div>

              <div className="space-y-4 pl-2 relative before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-[var(--color-border-default)]">
                <div className="flex justify-between items-center relative">
                  <div className="flex items-center gap-0.5 -ml-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 ring-4 ring-white relative z-10"></div>
                    <span className="text-sm font-medium text-[var(--color-text-muted)]">PENDING</span>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">9:00 AM</span>
                </div>
                <div className="flex justify-between items-center relative">
                  <div className="flex items-center gap-0.5 -ml-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] ring-4 ring-white relative z-10"></div>
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">IN PROGRESS</span>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">9:12 AM</span>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[var(--color-brand-soft)] to-transparent rounded-full -z-10 blur-3xl opacity-60"></div>
          </div>
        </div>

        {/* Stats Pill */}
        <div className="mt-20 border border-[var(--color-border-default)] rounded-full bg-white p-2 sm:p-4 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[var(--color-border-default)] shadow-sm">
          <div className="px-6 py-4 lg:py-2">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-1">&lt; 2 min</p>
            <p className="text-sm text-[var(--color-text-muted)]">Avg. assignment time</p>
          </div>
          <div className="px-6 py-4 lg:py-2">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-1">11</p>
            <p className="text-sm text-[var(--color-text-muted)]">Complaint categories</p>
          </div>
          <div className="px-6 py-4 lg:py-2">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-1">98%</p>
            <p className="text-sm text-[var(--color-text-muted)]">SLA compliance rate</p>
          </div>
          <div className="px-6 py-4 lg:py-2">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-1">24 / 7</p>
            <p className="text-sm text-[var(--color-text-muted)]">Monitoring & escalation</p>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20" id="features">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[var(--color-brand-soft)] text-[var(--color-brand-primary)] px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6">
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Four steps.<br/>Zero missed tickets.
            </h2>
          </div>
          <p className="text-[var(--color-text-muted)] text-right max-w-sm">
            Every complaint moves through a structured pipeline — automated at every stage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="border border-[var(--color-border-default)] rounded-[32px] p-8 sm:p-12 relative overflow-hidden group hover:shadow-lg transition-all bg-white">
            <div className="absolute top-8 right-8 text-6xl font-bold text-gray-100 group-hover:text-[var(--color-brand-soft)] transition-colors">01</div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-subtle)] flex items-center justify-center mb-8 border border-[var(--color-border-default)]">
              <FileText className="text-[var(--color-text-primary)]" size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Submit a Complaint</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed relative z-10">
              Students report issues through a clean web form — attach photos, specify the exact location, and describe the problem. No email chains, no confusion.
            </p>
          </div>

          {/* Card 2 - Accent */}
          <div className="border border-[var(--color-brand-primary-hover)] bg-[var(--color-brand-primary)] rounded-[32px] p-8 sm:p-12 relative overflow-hidden group hover:shadow-lg transition-all text-white shadow-[0_8px_30px_rgb(79,70,229,0.2)]">
            <div className="absolute top-8 right-8 text-6xl font-bold text-white/20 transition-colors">02</div>
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/30">
              <Zap className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">AI Auto-Classifies</h3>
            <p className="text-white/90 leading-relaxed relative z-10 font-medium">
              Our NLP engine reads the title and description, detects urgency and category automatically (electrical, plumbing, IT, security...) and suggests priority.
            </p>
          </div>

          {/* Card 3 - Dark */}
          <div className="border border-slate-700 bg-[var(--color-bg-elevated)] rounded-[32px] p-8 sm:p-12 relative overflow-hidden group hover:shadow-lg transition-all text-white">
            <div className="absolute top-8 right-8 text-6xl font-bold text-slate-800 transition-colors">03</div>
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-8 border border-slate-700">
              <Users className="text-[var(--color-brand-primary)]" size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Smart Assignment</h3>
            <p className="text-slate-400 leading-relaxed relative z-10">
              The system matches the complaint to the right department and the least-loaded staff member — no manual dispatching, no bottlenecks.
            </p>
          </div>

          {/* Card 4 */}
          <div className="border border-[var(--color-border-default)] rounded-[32px] p-8 sm:p-12 relative overflow-hidden group hover:shadow-lg transition-all bg-white">
            <div className="absolute top-8 right-8 text-6xl font-bold text-gray-100 group-hover:text-[var(--color-brand-soft)] transition-colors">04</div>
            <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-subtle)] flex items-center justify-center mb-8 border border-[var(--color-border-default)]">
              <CheckCircle2 className="text-[var(--color-text-primary)]" size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Resolved & Notified</h3>
            <p className="text-[var(--color-text-muted)] leading-relaxed relative z-10">
              Staff update the status. Students get instant email and push notifications. Admins see real-time analytics. Everyone knows what happened and when.
            </p>
          </div>
        </div>
      </section>

      {/* Dark Section (How it works) */}
      <section className="bg-[var(--color-bg-elevated)] text-white py-24" id="how-it-works">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-[var(--color-brand-primary)] px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-8 border border-slate-700">
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-20">
            Up and running<br/>in 3 steps.
          </h2>

          {/* Timeline */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 relative">
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px bg-slate-700"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center text-white font-bold text-lg mb-8 shadow-lg shadow-[var(--color-brand-primary)]/20 mx-auto md:mx-0">
                01
              </div>
              <h3 className="text-xl font-bold mb-4 text-center md:text-left">Register & Log In</h3>
              <p className="text-slate-400 leading-relaxed text-center md:text-left">
                Students and staff sign up with their campus email. Roles (student, staff, admin) are assigned automatically — no approval queues.
              </p>
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center text-white font-bold text-lg mb-8 shadow-lg shadow-[var(--color-brand-primary)]/20 mx-auto md:mx-0">
                02
              </div>
              <h3 className="text-xl font-bold mb-4 text-center md:text-left">Submit, Track & Escalate</h3>
              <p className="text-slate-400 leading-relaxed text-center md:text-left">
                Students submit issues in under 60 seconds. If a ticket stays unresolved past its SLA deadline, the system auto-escalates and alerts admins.
              </p>
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center text-white font-bold text-lg mb-8 shadow-lg shadow-[var(--color-brand-primary)]/20 mx-auto md:mx-0">
                03
              </div>
              <h3 className="text-xl font-bold mb-4 text-center md:text-left">Analyse & Improve</h3>
              <p className="text-slate-400 leading-relaxed text-center md:text-left">
                Admins access live dashboards — category trends, peak submission hours, department performance. Catch recurring issues before they become crises.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-10 border-t border-slate-800">
            <div className="bg-slate-800/50 border border-slate-700 rounded-[24px] p-6 flex flex-col items-start gap-4 hover:bg-slate-800 transition-colors">
              <BellRing className="text-[var(--color-brand-primary)]" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-2">Real-time Notifications</h4>
                <p className="text-sm text-slate-400">Firebase Firestore push + email via Resend — students always know their status.</p>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-[24px] p-6 flex flex-col items-start gap-4 hover:bg-slate-800 transition-colors">
              <PieChart className="text-[var(--color-brand-primary)]" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-2">Admin Analytics</h4>
                <p className="text-sm text-slate-400">Trend charts, peak-hour graphs, department performance tables. All built-in.</p>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-[24px] p-6 flex flex-col items-start gap-4 hover:bg-slate-800 transition-colors">
              <Shield className="text-[var(--color-brand-primary)]" size={24} />
              <div>
                <h4 className="font-bold text-lg mb-2">Enterprise Security</h4>
                <p className="text-sm text-slate-400">Helmet.js headers, rate limiting, bcrypt hashing, JWT expiry, input sanitization.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24" id="testimonials">
        <div className="inline-flex items-center gap-2 bg-[var(--color-brand-soft)] text-[var(--color-brand-primary)] px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6">
          Testimonials
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-16">
          What the campus says.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: "Before CampusConnect, we'd get 40 emails a day about the same broken lights. Now it's one ticket, auto-assigned, resolved in hours.",
              name: "Maintenance Head",
              role: "Electrical Dept."
            },
            {
              quote: "I submitted a complaint at 9 AM and got a notification at 11 AM that it was fixed. That's never happened before on campus.",
              name: "Priya S.",
              role: "B.Tech, 3rd Year"
            },
            {
              quote: "The analytics dashboard showed us that 60% of IT complaints come in on Monday mornings. We now staff up proactively.",
              name: "IT Manager",
              role: "IT Support Dept."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-[var(--color-border-default)] rounded-[32px] p-8 sm:p-10 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex gap-1 text-[var(--color-brand-primary)] mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-lg italic text-[var(--color-text-secondary)] leading-relaxed mb-8">"{item.quote}"</p>
              </div>
              <div>
                <p className="font-bold text-[var(--color-text-primary)]">{item.name}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto pb-24">
        <div className="bg-[var(--color-bg-elevated)] rounded-[40px] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Ready to fix campus maintenance?</h2>
            <p className="text-slate-400">No setup fee. No per-user cost. Just working software.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <Link href="/login" className="flex items-center justify-center gap-2 bg-[var(--color-brand-primary)] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[var(--color-brand-primary-hover)] transition-all">
              Get started free <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-2 bg-transparent text-white border border-slate-700 px-8 py-4 rounded-full text-base font-medium hover:bg-slate-800 transition-all">
              Sign in
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[var(--color-bg-elevated)] text-white pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.jpg" alt="CampusConnect" className="w-9 h-9 object-contain" />
                <span className="text-xl font-bold tracking-tight">CampusConnect</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Campus complaint management — automated, transparent, and fast.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">X</a>
                <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">In</a>
                <a href="#" className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400 hover:text-white">Git</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Admin Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2026 CampusConnect. All rights reserved.</p>
            <p>Built with Node.js · MongoDB · Next.js · Firebase</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
