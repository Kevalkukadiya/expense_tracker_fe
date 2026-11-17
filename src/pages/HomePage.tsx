import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  PieChart,
  Receipt,
  Target,
  Bell,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button, Spinner } from '../components/ui';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    document.title = 'ExpenseTracker — Smart Financial Management';
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner size="lg" />
      </div>
    );
  }

  // Logged-in users should not stay on the landing/index page
  if (isAuthenticated) {
    return <Navigate to="/expenses" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Expense<span className="text-indigo-600">Tracker</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-50 to-slate-50" />
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Take control of your
              <span className="mt-2 block text-indigo-600">everyday spending</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              ExpenseTracker helps you record expenses, set clear budgets, and understand where
              your money goes — so you can make better financial decisions.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" fullWidth>
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200/80 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Everything you need to stay on top of your money
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                Simple tools that give you clarity and control without the complexity.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Receipt className="h-5 w-5" />}
                iconBg="bg-indigo-50 text-indigo-600"
                title="Effortless Expense Tracking"
                description="Log expenses in seconds. Categorize spending and keep a clean record of every transaction."
              />
              <FeatureCard
                icon={<Target className="h-5 w-5" />}
                iconBg="bg-emerald-50 text-emerald-600"
                title="Smart Budgets"
                description="Set monthly budgets for categories that matter. Get clear visibility when you’re approaching your limits."
              />
              <FeatureCard
                icon={<PieChart className="h-5 w-5" />}
                iconBg="bg-purple-50 text-purple-600"
                title="Clear Insights"
                description="See exactly where your money goes with simple charts and spending summaries."
              />
              <FeatureCard
                icon={<Bell className="h-5 w-5" />}
                iconBg="bg-rose-50 text-rose-600"
                title="Helpful Alerts"
                description="Stay informed with timely notifications when budgets are close to being exceeded."
              />
              <FeatureCard
                icon={<Smartphone className="h-5 w-5" />}
                iconBg="bg-amber-50 text-amber-600"
                title="Works Everywhere"
                description="Access your finances from any device. Fully responsive and designed for both desktop and mobile."
              />
              <FeatureCard
                icon={<TrendingUp className="h-5 w-5" />}
                iconBg="bg-sky-50 text-sky-600"
                title="Better Habits"
                description="Build healthier spending habits with clear feedback and progress over time."
              />
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200/80 bg-slate-50 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Start tracking with confidence
            </h2>
            <p className="mt-3 text-slate-600">
              Create your free account and begin organizing your expenses in just a few minutes.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-700">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-700">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
