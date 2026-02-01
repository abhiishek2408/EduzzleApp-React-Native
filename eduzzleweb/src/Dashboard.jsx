import React, { useState } from 'react';
import { 
  Flame, 
  Target, 
  Trophy, 
  Award, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Star,
  Zap,
  ShieldCheck,
  Globe,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Users,
  Code,
  Gamepad2,
  Calculator,
  PlayCircle,
  TrendingUp,
  BrainCircuit,
  Lock,
  ArrowRight,
  Mail,
  SmartphoneNfc
} from 'lucide-react';

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const categories = [
    { name: 'Data Structures', icon: <Code />, color: 'bg-blue-500' },
    { name: 'Mathematics', icon: <Calculator />, color: 'bg-emerald-500' },
    { name: 'Gaming Logic', icon: <Gamepad2 />, color: 'bg-orange-500' },
    { name: 'Daily IQ', icon: <Zap />, color: 'bg-purple-500' },
  ];

  const faqs = [
    { q: "Is Eduzzle free to use?", a: "Yes! Eduzzle offers a generous free tier that includes daily quests and basic leaderboards. We also have a Premium plan for ad-free learning and advanced analytics." },
    { q: "Can I play offline?", a: "Absolutely. You can download specific quiz packs while online and solve them anywhere, even without an internet connection." },
    { q: "Is it available for iOS?", a: "Currently, Eduzzle is an Android exclusive to provide the best native performance. We are exploring iOS development for late 2026." },
    { q: "How do I earn badges?", a: "Badges are earned by completing specific challenges, maintaining long streaks, or ranking in the top 3 of your weekly leaderboard." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tight text-purple-700">Eduzzle</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-bold text-slate-600">
            <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-purple-600 transition-colors">How it Works</a>
            <a href="#categories" className="hover:text-purple-600 transition-colors">Quizzes</a>
            <a href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</a>
            <a href="#download" className="px-6 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 text-sm">
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-purple-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-black tracking-wide">
              <Smartphone className="w-4 h-4" />
              EXCLUSIVELY ON ANDROID
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-slate-900">
              Master Any Skill <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500">
                Through Play.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Join 50,000+ learners solving daily puzzles, competing on global leaderboards, and earning real-world knowledge.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all transform hover:scale-105 shadow-xl">
                <Download className="w-6 h-6" />
                <span>Get it on Google Play</span>
              </button>
              <div className="flex items-center gap-2 text-slate-500">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="font-bold">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* App Preview Mockup */}
          <div className="relative mx-auto lg:ml-auto">
            <div className="relative z-10 w-[280px] h-[580px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-[8px] border-slate-800 overflow-hidden">
              <div className="w-full h-full bg-slate-50 rounded-[2rem] overflow-hidden relative flex flex-col">
                <div className="p-4 bg-purple-600 text-white pb-8">
                  <p className="text-[10px] font-bold opacity-80 uppercase">Training Level 12</p>
                  <p className="font-bold">Binary Search Challenge</p>
                </div>
                <div className="p-4 -mt-6 flex-1 space-y-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-purple-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-bold text-slate-700">5 Day Streak</span>
                    </div>
                    <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Hot!</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rank</p>
                    <div className="h-20 bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-[10px]">JD</div>
                         <div className="text-[10px] font-bold">You</div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">#1,245</p>
                        <p className="text-xs font-black text-purple-600">+120 XP</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-200/40 rounded-full blur-3xl -z-0"></div>
          </div>
        </div>
      </section>

      {/* Feature Showcase: Interactive Quiz Preview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-12 items-center overflow-hidden relative">
          <div className="lg:w-1/2 space-y-6 relative z-10">
            <h2 className="text-4xl font-black text-white leading-tight">Can You Solve This?</h2>
            <p className="text-slate-400 text-lg">We don't just ask questions. We challenge your logic. Every correct answer builds your mental muscle.</p>
            <div className="flex flex-wrap gap-4">
              <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-bold">#Algorithms</span>
              <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-bold">#BinaryTrees</span>
            </div>
          </div>
          <div className="lg:w-1/2 w-full relative z-10">
            <div className="bg-white rounded-3xl p-6 shadow-2xl transform rotate-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                  <span>Question 4/10</span>
                  <span className="text-purple-600">Time: 00:45</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 leading-snug">What is the worst-case time complexity of searching for an element in a binary search tree?</h4>
                <div className="space-y-2">
                  {['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'].map((opt, i) => (
                    <div key={i} className={`p-4 border-2 rounded-2xl flex items-center justify-between group cursor-pointer transition-all ${opt === 'O(n)' ? 'border-purple-500 bg-purple-50' : 'border-slate-100 hover:border-purple-200'}`}>
                      <span className="font-bold text-slate-700">{opt}</span>
                      {opt === 'O(n)' && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
                    </div>
                  ))}
                </div>
                <div className="pt-4 flex items-center gap-2 text-purple-600 text-xs font-bold">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Explanation: In a skewed tree, it behaves like a linked list.</span>
                </div>
              </div>
            </div>
          </div>
          {/* Abstract background */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-transparent"></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">How Eduzzle Works</h2>
            <p className="text-slate-500 text-lg">Three steps to becoming a subject master.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Pick Your Topic', desc: 'Choose from hundreds of curated quiz packs in DSA, Math, or Trivia.' },
              { step: '02', title: 'Solve & Learn', desc: 'Interactive puzzles that explain the "why" behind every correct answer.' },
              { step: '03', title: 'Claim Rewards', desc: 'Earn badges, move up the leaderboard, and unlock new difficult tiers.' }
            ].map((s, i) => (
              <div key={i} className="relative group">
                <div className="text-8xl font-black text-purple-100 absolute -top-8 -left-4 group-hover:text-purple-200 transition-colors">{s.step}</div>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">{s.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Mastery Path Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-16">The Mastery Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-purple-100 -z-10"></div>
            {[
              { level: 'Novice', icon: <Target />, xp: '0 XP', color: 'bg-slate-100 text-slate-500' },
              { level: 'Specialist', icon: <TrendingUp />, xp: '5,000 XP', color: 'bg-blue-100 text-blue-600' },
              { level: 'Master', icon: <BrainCircuit />, xp: '25,000 XP', color: 'bg-purple-100 text-purple-600' },
              { level: 'Grandmaster', icon: <Trophy />, xp: '100,000 XP', color: 'bg-yellow-100 text-yellow-600' },
            ].map((tier, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-4 hover:scale-105 transition-all">
                <div className={`w-16 h-16 ${tier.color} rounded-full flex items-center justify-center`}>
                  {React.cloneElement(tier.icon, { size: 32 })}
                </div>
                <div>
                  <h4 className="font-black text-xl">{tier.level}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1">{tier.xp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Plan Comparison */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Choose Your Focus</h2>
            <p className="text-slate-500">Free forever, or upgrade for the ultimate edge.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-purple-200 transition-all">
              <h3 className="text-2xl font-black mb-2 text-slate-800">Free Scholar</h3>
              <p className="text-slate-500 text-sm mb-8">Essential learning for everyone.</p>
              <div className="text-4xl font-black mb-8">$0<span className="text-lg text-slate-400">/mo</span></div>
              <ul className="space-y-4 mb-10">
                {['Daily Quest Access', 'Global Leaderboards', 'Standard Badges', 'Basic Statistics'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 border-2 border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50">Get Started</button>
            </div>
            {/* Premium Plan */}
            <div className="bg-purple-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-purple-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md border border-white/20">MOST POPULAR</div>
              </div>
              <h3 className="text-2xl font-black mb-2">Grandmaster</h3>
              <p className="text-purple-100 text-sm mb-8">Advanced tools for serious learners.</p>
              <div className="text-4xl font-black mb-8">$4.99<span className="text-lg text-purple-200">/mo</span></div>
              <ul className="space-y-4 mb-10">
                {['Unlimited Quiz Packs', 'Detailed Performance IQ', 'Exclusive "Pro" Badges', 'No Advertisements', 'Offline Mode Access'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-purple-50 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-purple-300" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-white text-purple-600 rounded-2xl font-black hover:bg-purple-50 shadow-xl">Upgrade Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section id="categories" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl font-black text-slate-900 leading-tight">Diversity in Learning. <br/><span className="text-purple-600">Zero Boredom.</span></h2>
            <p className="text-slate-600 text-lg leading-relaxed">Whether you're prepping for a coding interview or just want to keep your brain sharp, we have a category for you.</p>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-all cursor-default">
                  <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white`}>
                    {React.cloneElement(cat.icon, { size: 20 })}
                  </div>
                  <span className="font-bold text-slate-700">{cat.name}</span>
                </div>
              ))}
            </div>
            <button className="flex items-center gap-2 text-purple-700 font-black hover:gap-4 transition-all">
              Browse 50+ More Categories <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
             <div className="space-y-4 pt-12">
                <div className="aspect-square bg-purple-100 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center p-8">
                  <PlayCircle className="text-purple-400 w-16 h-16" />
                </div>
                <div className="aspect-square bg-slate-100 rounded-3xl p-6 flex items-end">
                   <Lock className="text-slate-300 w-10 h-10" />
                </div>
             </div>
             <div className="space-y-4">
                <div className="aspect-square bg-slate-900 rounded-3xl flex items-center justify-center">
                  <Flame className="text-orange-500 w-20 h-20" />
                </div>
                <div className="aspect-square bg-purple-600 rounded-3xl flex items-center justify-center">
                   <Trophy className="text-yellow-400 w-20 h-20" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-black">Trusted by Students</h2>
              <p className="text-slate-400">See what our community has to say about their journey.</p>
            </div>
            <div className="flex gap-2">
              <div className="p-3 border border-slate-700 rounded-full text-slate-500 cursor-not-allowed"><ChevronLeft /></div>
              <div className="p-3 bg-purple-600 rounded-full text-white cursor-pointer hover:bg-purple-500"><ChevronRight /></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Alex Rivera', role: 'CS Student', quote: 'The DSA puzzles helped me land my internship. It makes boring concepts actually fun to solve.' },
              { name: 'Sarah Chen', role: 'High Schooler', quote: 'I have a 45-day streak! Eduzzle is the first app that actually kept me motivated for math.' },
              { name: 'Marcus Todd', role: 'Game Dev', quote: 'The Gaming Logic category is surprisingly deep. Great for warming up before a coding session.' }
            ].map((t, i) => (
              <div key={i} className="p-8 bg-slate-800 rounded-3xl border border-slate-700 space-y-6">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg italic text-slate-300">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Early Access */}
      <section className="py-24 px-6 bg-purple-50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mx-auto">
            <Mail className="text-purple-600 w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-slate-900">Be the First to Know</h2>
          <p className="text-slate-500 text-lg">We're launching 10 new categories next month. Get notified and receive a special "Alpha" badge on signup.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-purple-600 outline-none font-bold"
            />
            <button className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 transition-all">Notify Me</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500">Everything you need to know about the Eduzzle experience.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold hover:bg-slate-50 transition-colors"
                >
                  <span className="text-slate-800">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="text-purple-600" /> : <ChevronDown className="text-slate-400" />}
                </button>
                {openFaq === i && (
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="download" className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-5xl font-black text-slate-900 leading-tight">Your Brain <br/>Deserves Better.</h2>
          <p className="text-xl text-slate-500">Turn your screen time into skill time. Download Eduzzle for free today on the Google Play Store.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-3">
              <Download className="w-6 h-6" />
              Download for Android
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 pt-8">
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800">4.9</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stars</span>
             </div>
             <div className="w-px h-8 bg-slate-200"></div>
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800">50k+</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Installs</span>
             </div>
             <div className="w-px h-8 bg-slate-200"></div>
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800">12MB</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Size</span>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-6">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                 <Zap className="text-white w-5 h-5 fill-current" />
               </div>
               <span className="text-xl font-bold text-purple-700">Eduzzle</span>
             </div>
             <p className="text-slate-500 text-sm leading-relaxed">The only app that makes learning as addictive as gaming. Made for the modern student.</p>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-4 uppercase text-xs tracking-widest">App</h4>
            <ul className="space-y-2 text-sm text-slate-500 font-medium">
              <li><a href="#features" className="hover:text-purple-600">Features</a></li>
              <li><a href="#categories" className="hover:text-purple-600">Quizzes</a></li>
              <li><a href="#download" className="hover:text-purple-600">Download</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-4 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-2 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-purple-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-600">Terms of Use</a></li>
              <li><a href="#" className="hover:text-purple-600">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-slate-900 mb-4 uppercase text-xs tracking-widest">Connect</h4>
            <ul className="space-y-2 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-purple-600">Twitter</a></li>
              <li><a href="#" className="hover:text-purple-600">Instagram</a></li>
              <li><a href="#" className="hover:text-purple-600">Discord</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">© 2026 Eduzzle App. All rights reserved.</p>
          <div className="flex items-center gap-4 grayscale opacity-50">
             <SmartphoneNfc className="w-5 h-5" />
             <div className="w-8 h-8 bg-slate-300 rounded-lg"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components for layout
const ChevronLeft = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRight = ({ className }) => <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>;

export default LandingPage;