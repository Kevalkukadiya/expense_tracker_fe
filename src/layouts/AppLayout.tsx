import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui';

export function AppLayout({ children, title }: { children: any; title: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/expenses" className="font-bold text-slate-900">
              Expense<span className="text-indigo-600">Tracker</span>
            </Link>
            <nav className="flex gap-2 text-sm">
              <NavLink
                to="/expenses"
                className={({ isActive }) =>
                  isActive ? 'text-indigo-600 font-medium' : 'text-slate-600'
                }
              >
                Expenses
              </NavLink>
              <NavLink
                to="/incomes"
                className={({ isActive }) =>
                  isActive ? 'text-indigo-600 font-medium' : 'text-slate-600'
                }
              >
                Incomes
              </NavLink>
              <NavLink
                to="/budgets"
                className={({ isActive }) =>
                  isActive ? 'text-indigo-600 font-medium' : 'text-slate-600'
                }
              >
                Budgets
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">
              {user?.first_name || user?.email}
            </span>
            <Button size="sm" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">{title}</h1>
        {children}
      </main>
    </div>
  );
}
