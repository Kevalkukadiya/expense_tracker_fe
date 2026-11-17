import { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { Button, Input, Select, Spinner } from '../components/ui';
import { budgetService } from '../services/budgetService';
import { getApiErrorMessage } from '../services/apiClient';
import { CATEGORY_OPTIONS, MONTH_OPTIONS } from '../utils/constants';

export default function BudgetsPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [search, setSearch] = useState('');

  // form fields
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [category, setCategory] = useState('');

  async function loadList() {
    setLoading(true);
    setError('');
    try {
      const res = await budgetService.getAll(page, search);
      setList(res.data || []);
      setHasNext(!!res.next);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
    setLoading(false);
  }

  useEffect(() => {
    loadList();
  }, [page]);

  function clearForm() {
    setName('');
    setAmount('');
    setMonth(String(new Date().getMonth() + 1));
    setYear(String(new Date().getFullYear()));
    setCategory('');
    setEditId(null);
  }

  function openAdd() {
    clearForm();
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    setName(item.name);
    setAmount(item.amount);
    setMonth(String(item.month));
    setYear(String(item.year));
    setCategory(item.category || '');
    setShowForm(true);
  }

  async function handleSave(e: any) {
    e.preventDefault();

    if (!name || !amount || !month || !year) {
      setError('Please fill all required fields');
      return;
    }

    const data = {
      name: name,
      amount: amount,
      month: Number(month),
      year: Number(year),
      category: category ? category : null,
    };

    try {
      if (editId) {
        await budgetService.update(editId, data);
      } else {
        await budgetService.create(data);
      }
      setShowForm(false);
      clearForm();
      loadList();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleDelete(id: number) {
    const ok = window.confirm('Delete this budget?');
    if (!ok) return;

    try {
      await budgetService.remove(id);
      loadList();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  function handleSearch(e: any) {
    e.preventDefault();
    if (page === 1) {
      loadList();
    } else {
      setPage(1);
    }
  }

  function getMonthName(num: number) {
    const found = MONTH_OPTIONS.find((m) => m.value === String(num));
    return found ? found.label : num;
  }

  function getCategoryLabel(value: string | null) {
    if (!value) return 'Overall';
    const found = CATEGORY_OPTIONS.find((item) => item.value === value);
    return found ? found.label : value;
  }

  const categoryOptions = [
    { value: '', label: 'Overall (no category)' },
    ...CATEGORY_OPTIONS,
  ];

  return (
    <AppLayout title="Budgets">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
          <button className="ml-2 underline" onClick={() => setError('')}>
            close
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
        <Button onClick={openAdd}>Add Budget</Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">
            {editId ? 'Edit Budget' : 'New Budget'}
          </h2>
          <form onSubmit={handleSave} className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Amount"
              required
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Select
              label="Month"
              required
              options={MONTH_OPTIONS}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <Input
              label="Year"
              required
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <div className="sm:col-span-2">
              <Select
                label="Category (optional)"
                placeholder=""
                options={categoryOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">{editId ? 'Update' : 'Save'}</Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  clearForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border bg-white">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : list.length === 0 ? (
          <p className="py-12 text-center text-slate-500">No budgets found.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.amount}</td>
                  <td className="px-4 py-3">
                    {getMonthName(item.month)} {item.year}
                  </td>
                  <td className="px-4 py-3">{getCategoryLabel(item.category)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between border-t px-4 py-3">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500">Page {page}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={!hasNext}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
