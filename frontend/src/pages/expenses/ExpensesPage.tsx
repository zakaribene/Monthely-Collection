import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Receipt, DollarSign, Calendar, CreditCard, Filter, X, CheckCircle, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import * as expenseService from '../../services/expenseService';
import * as paymentService from '../../services/paymentsService';
import { usePermissions } from '../../hooks/usePermissions';

const CATEGORIES = ['Stationery', 'Rent', 'Salaries', 'Utilities', 'Maintenance', 'Entertainment', 'Others'];

const ExpensesPage = () => {
  const { hasPermission } = usePermissions();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  
  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [saving, setSaving] = useState(false);

  // New UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedViewExpense, setSelectedViewExpense] = useState<any>(null);

  // Derived states
  const filteredExpenses = expenses.filter(e => 
    e.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.paymentMethod?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleView = (expense: any) => {
    setSelectedViewExpense(expense);
    setShowViewModal(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const methRes = await paymentService.getPaymentMethods();
      setMethods(methRes.data);
      if (methRes.data.length > 0) setPaymentMethod(methRes.data[0]._id);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }

    try {
      const expRes = await expenseService.getExpenses();
      setExpenses(expRes.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (expense: any) => {
    setSelectedExpense(expense);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(new Date(expense.date).toISOString().split('T')[0]);
    setPaymentMethod(expense.paymentMethod?._id || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        fetchData();
      } catch (error) {
        alert('Error deleting expense');
      }
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { description, amount: Number(amount), category, date, paymentMethod };
      if (selectedExpense) {
        await expenseService.updateExpense(selectedExpense._id, payload);
      } else {
        await expenseService.createExpense(payload);
      }
      setShowForm(false);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving expense');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedExpense(null);
    setDescription('');
    setAmount('');
    setCategory(CATEGORIES[0]);
    setDate(new Date().toISOString().split('T')[0]);
    if (methods.length > 0) setPaymentMethod(methods[0]._id);
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--foreground)', marginBottom: '0.5rem' }}>Expenses</h1>
          <p style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>Track and manage your organization expenditures.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--secondary)" style={{ position: 'absolute', left: '14px', top: '11px' }} />
            <input 
              type="text" 
              placeholder="Search expenses..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ ...inputStyle, width: '260px', paddingLeft: '44px', padding: '10px 16px 10px 44px', margin: 0, height: '42px', borderRadius: '12px' }}
            />
          </div>
          {hasPermission('expenses', 'create') && (
            <Button onClick={() => { resetForm(); setShowForm(true); }} style={{ borderRadius: '12px', height: '42px', padding: '0 24px', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>
              <Plus size={18} style={{ marginRight: '8px' }} /> Add New
            </Button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border)' }}>
        {loading ? <div style={{ padding: '4rem' }}><Loader /></div> : (
          <Table headers={['Date', 'Description', 'Category', 'Method', 'Amount', 'Actions']}>
            {paginatedExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center', padding: '4rem', color: 'var(--secondary)' }}>
                  <Receipt size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p>{searchTerm ? 'No expenses match your search.' : 'No expenses found. Click "Add New" to get started.'}</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedExpenses.map((exp) => (
                <TableRow key={exp._id}>
                  <TableCell style={{ color: '#64748b', fontWeight: '500' }}>
                    {new Date(exp.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell style={{ fontWeight: '700', color: 'var(--foreground)' }}>{exp.description}</TableCell>
                  <TableCell>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      fontWeight: '700'
                    }}>
                      {exp.category}
                    </span>
                  </TableCell>
                  <TableCell style={{ color: '#64748b' }}>{exp.paymentMethod?.name || 'N/A'}</TableCell>
                  <TableCell style={{ fontWeight: '800', color: 'var(--danger)', fontSize: '1.1rem' }}>
                    -${exp.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button variant="outline" size="sm" onClick={() => handleView(exp)} style={{ borderRadius: '10px', color: '#64748b', borderColor: '#e2e8f0' }}>
                        <Eye size={16} />
                      </Button>
                      {hasPermission('expenses', 'update') && (
                        <Button variant="outline" size="sm" onClick={() => handleEdit(exp)} style={{ borderRadius: '10px' }}>
                          <Edit2 size={16} />
                        </Button>
                      )}
                      {hasPermission('expenses', 'delete') && (
                        <Button variant="outline" size="sm" onClick={() => handleDelete(exp._id)} style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '10px' }}>
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </Table>
        )}
        
        {!loading && filteredExpenses.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', backgroundColor: '#f8fafc' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: 500 }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length} entries
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={{ padding: '6px' }}>
                <ChevronLeft size={16} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => {
                if (totalPages > 5 && i !== 0 && i !== totalPages - 1 && Math.abs(currentPage - 1 - i) > 1) {
                  if (Math.abs(currentPage - 1 - i) === 2) return <span key={i} style={{ padding: '4px 8px', color: '#94a3b8' }}>...</span>;
                  return null;
                }
                return (
                  <Button key={i + 1} variant={currentPage === i + 1 ? 'primary' : 'outline'} size="sm" onClick={() => handlePageChange(i + 1)} style={{ padding: '4px 12px', fontWeight: 600 }}>
                    {i + 1}
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: '6px' }}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={selectedExpense ? 'Edit Expense Record' : 'Create New Expense'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>
              <Receipt size={14} style={{ marginRight: '6px' }} />
              DESCRIPTION
            </label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              style={inputStyle} 
              placeholder="e.g. Office Supplies, Monthly Rent" 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={labelStyle}>
                <DollarSign size={14} style={{ marginRight: '6px' }} />
                AMOUNT ($)
              </label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                style={inputStyle} 
                placeholder="0.00" 
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Filter size={14} style={{ marginRight: '6px' }} />
                CATEGORY
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
            <div>
              <label style={labelStyle}>
                <Calendar size={14} style={{ marginRight: '6px' }} />
                DATE
              </label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>
                <CreditCard size={14} style={{ marginRight: '6px' }} />
                PAYMENT METHOD
              </label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required style={inputStyle}>
                {methods.length === 0 ? <option value="">No methods available</option> : 
                  methods.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)} style={{ borderRadius: '12px' }}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || methods.length === 0} style={{ 
              borderRadius: '12px', 
              padding: '12px 32px',
              backgroundColor: 'var(--primary)',
              color: 'white'
            }}>
              {saving ? 'Processing...' : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} />
                  {selectedExpense ? 'Update Record' : 'Confirm Expense'}
                </div>
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Expense Details">
        {selectedViewExpense && (
          <div style={{ padding: '0.5rem 0 1.5rem' }}>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Description</span>
                <span style={{ fontWeight: 800, color: 'var(--foreground)', fontSize: '1.05rem' }}>{selectedViewExpense.description}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Amount</span>
                <span style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '1.25rem' }}>-${selectedViewExpense.amount.toLocaleString()}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Category</span>
                <span style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem' }}>{selectedViewExpense.category}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Payment Method</span>
                <span style={{ fontWeight: 700, color: '#334155' }}>{selectedViewExpense.paymentMethod?.name || '-'}</span>
              </div>
              <div style={detailRowStyle}>
                <span style={detailLabelStyle}>Transaction Date</span>
                <span style={{ fontWeight: 600, color: '#64748b' }}>{new Date(selectedViewExpense.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div style={{ ...detailRowStyle, borderBottom: 'none', paddingBottom: 0 }}>
                <span style={detailLabelStyle}>Created By</span>
                <span style={{ fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                    {(selectedViewExpense.createdBy?.fullName || selectedViewExpense.createdBy?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  {selectedViewExpense.createdBy?.fullName || selectedViewExpense.createdBy?.username || '-'}
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowViewModal(false)} style={{ borderRadius: '12px', padding: '10px 24px' }}>
                Close Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const labelStyle = { 
  display: 'flex', 
  alignItems: 'center', 
  fontSize: '0.75rem', 
  fontWeight: '800', 
  marginBottom: '8px', 
  color: '#64748b', 
  letterSpacing: '0.05em' 
};

const inputStyle = { 
  width: '100%', 
  padding: '0.85rem 1rem', 
  borderRadius: '14px', 
  border: '2px solid #e2e8f0', 
  outline: 'none',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: 'border-color 0.2s',
  backgroundColor: '#f8fafc'
};

const detailRowStyle = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  borderBottom: '1px solid #e2e8f0', 
  paddingBottom: '1rem'
};

const detailLabelStyle = { 
  color: 'var(--secondary)', 
  fontSize: '0.9rem',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em'
};

export default ExpensesPage;
