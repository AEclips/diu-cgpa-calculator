import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Calculator, 
  BookOpen, 
  Heart,
  ShieldCheck
} from 'lucide-react';

export default function Footer() {
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Academic Knowledge & Formula Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-xs text-slate-600 dark:text-slate-400">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-200 mb-2">
              <Calculator className="w-4 h-4 text-emerald-500" />
              <span>SGPA Formula (Semester)</span>
            </div>
            <p className="leading-relaxed font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mb-1.5 text-emerald-600 dark:text-emerald-400">
              SGPA = Σ(Credit × Grade Point) / Σ(Credits)
            </p>
            <p>Calculates the weighted average for all courses within a single semester term.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-200 mb-2">
              <GraduationCap className="w-4 h-4 text-teal-500" />
              <span>CGPA Formula (Cumulative)</span>
            </div>
            <p className="leading-relaxed font-mono bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mb-1.5 text-teal-600 dark:text-teal-400">
              CGPA = Total Quality Points / Total Credits
            </p>
            <p>Aggregates all credit hours and grade points across your entire university degree duration.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center space-x-2 font-bold text-slate-800 dark:text-slate-200 mb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>100% Client-Side Privacy</span>
            </div>
            <p className="leading-relaxed">
              Your grades, course names, and personal academic information never leave your device. All calculations run strictly in your browser and sync instantly to LocalStorage.
            </p>
          </div>

        </div>

        {/* Collapsible FAQ Section */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mb-8">
          <button
            onClick={() => setFaqOpen(!faqOpen)}
            className="w-full px-5 py-3.5 bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 transition"
          >
            <span className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>Frequently Asked Questions & Grading Tips</span>
            </span>
            {faqOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {faqOpen && (
            <div className="p-5 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-4">
              
              <div className="pt-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  How are course credit hours weighted?
                </h4>
                <p className="leading-relaxed">
                  A 4-credit course has twice the impact on your GPA as a 2-credit course. Quality points for each course are calculated as <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600">Credits × Grade Point</code>.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  How does the Target CGPA calculator work?
                </h4>
                <p className="leading-relaxed">
                  It uses the algebraic target formula <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600">Required GPA = (Target Points - Current Points) / Remaining Credits</code>. If the required GPA exceeds your scale limit (e.g. &gt; 4.0), it will notify you that the target is mathematically unreachable with the given credits.
                </p>
              </div>

              <div className="pt-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Can I export and transfer my data to another laptop or phone?
                </h4>
                <p className="leading-relaxed">
                  Yes! Click the <strong>Backup (JSON)</strong> icon in the top header bar to download your data file, and use the Restore button on your other device to load all your semesters in one click.
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Brand Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-2">
          <div className="flex items-center space-x-1.5">
            <span>UniGrade CGPA Calculator Pro</span>
            <span>•</span>
            <span>Built for university students worldwide</span>
          </div>

          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for academic excellence</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
