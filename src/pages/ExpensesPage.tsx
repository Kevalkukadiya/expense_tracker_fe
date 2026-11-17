import { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { Button, Input, Select, Spinner } from '../components/ui';
import { expenseService } from '../services/expenseService';
import { getApiErrorMessage } from '../services/apiClient';
import { CATEGORY_OPTIONS, PAYMENT_METHOD_OPTIONS } from '../utils/constants';

export default function ExpensesPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [search, setSearch] = useState('');

  // form fields
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [expenseDate, setExpenseDate] = useState('');
  const [description, setDescription] = useState('');

  async function loadList() {
    setLoading(true);
    setError('');
    try {
      const res = await expenseService.getAll(page, search);
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
    setTitle('');
    setAmount('');
    setCategory('food');
    setPaymentMethod('cash');
    setExpenseDate('');
    setDescription('');
    setEditId(null);
  }

  function openAdd() {
    clearForm();
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    setTitle(item.title);
    setAmount(item.amount);
    setCategory(item.category || 'food');
    setPaymentMethod(item.payment_method || 'cash');
    setExpenseDate(item.expense_date);
    setDescription(item.description || '');
    setShowForm(true);
  }

  async function handleSave(e: any) {
    e.preventDefault();

    if (!title || !amount || !category || !expenseDate) {
      setError('Please fill all required fields');
      return;
    }

    const data = {
      title: title,
      amount: amount,
      category: category,
      payment_method: paymentMethod,
      expense_date: expenseDate,
      description: description,
    };

    try {
      if (editId) {
        await expenseService.update(editId, data);
      } else {
        await expenseService.create(data);
      }

      setShowForm(false);
      clearForm();
      loadList();
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  async function handleDelete(id: number) {
    const ok = window.confirm('Delete this expense?');
    if (!ok) return;

    try {
      await expenseService.remove(id);
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

  function getCategoryLabel(value: string) {
    const found = CATEGORY_OPTIONS.find((item) => item.value === value);
    return found ? found.label : value;
  }

  return (
    <AppLayout title="Expenses">
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
        <Button onClick={openAdd}>Add Expense</Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">
            {editId ? 'Edit Expense' : 'New Expense'}
          </h2>
          <form onSubmit={handleSave} className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              label="Category"
              required
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Select
              label="Payment Method"
              options={PAYMENT_METHOD_OPTIONS}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Input
              label="Date"
              required
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
            <Input
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
          <p className="py-12 text-center text-slate-500">No expenses found.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="border-b bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{item.amount}</td>
                  <td className="px-4 py-3">{getCategoryLabel(item.category)}</td>
                  <td className="px-4 py-3">{item.expense_date}</td>
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
