import { useState, useEffect } from 'react';
import { FileText, Download, Search } from 'lucide-react';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import api from '../../services/api';
import * as XLSX from 'xlsx';
import { usePermissions } from '../../hooks/usePermissions';

const ReportsPage = () => {
  const { hasPermission } = usePermissions();
  const [data, setData] = useState<any[]>([]);
  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'payments' | 'expenses'>('payments');
  const [filters, setFilters] = useState<any>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: '',
    paymentMethod: '',
    search: ''
  });
  const [methods, setMethods] = useState<any[]>([]);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const { data } = await api.get('/payment-methods');
        setMethods(data);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };
    fetchInit();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/reports', { 
        params: {
          ...filters,
          search: filters.search || undefined
        } 
      });
      setData(data.data);
      setExpensesData(data.expenses || []);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReport();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const exportToExcel = () => {
    const exportData = data.map(p => ({
      'Member Name': p.member?.fullName,
      'Month': p.month,
      'Year': p.year,
      'Amount': p.amount,
      'Status': p.status,
      'Method': p.paymentMethod?.name || 'N/A',
      'Date Paid': p.datePaid ? new Date(p.datePaid).toLocaleDateString() : 'N/A',
      'Received By': p.receivedBy || 'N/A'
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Collection Report");
    XLSX.writeFile(wb, `Report_${filters.month}_${filters.year}.xlsx`);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '200px', flex: '1' }}>
            <Search size={18} color="var(--secondary)" style={{ position: 'absolute', marginLeft: '12px' }} />
            <input 
              type="text" 
              placeholder="Search member..." 
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ ...selectStyle, width: '100%', paddingLeft: '40px' }}
            />
          </div>
          
          <select value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value ? Number(e.target.value) : '' })} style={selectStyle}>
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>

          <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value ? Number(e.target.value) : '' })} style={selectStyle}>
            <option value="">All Years</option>
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} style={selectStyle}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>

          <select value={filters.paymentMethod} onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })} style={selectStyle}>
            <option value="">All Methods</option>
            {methods.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>

          <div style={{ display: 'flex', gap: '10px' }}>
            {hasPermission('reports', 'export') && (
              <>
                <Button variant="outline" size="sm" onClick={exportToExcel}>
                  <Download size={16} /> Excel
                </Button>
                <Button variant="primary" size="sm" onClick={() => window.print()}>
                  <FileText size={16} /> Print PDF
                </Button>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
          <SummaryCard title="Total Paid" value={`$${summary?.totalCollected || 0}`} />
          <SummaryCard title="Total Expenses" value={`$${summary?.totalExpenses || 0}`} />
          <SummaryCard title="Net Balance" value={`$${summary?.netBalance || 0}`} />
          <SummaryCard title="Paid Count" value={summary?.totalPaid || 0} />
          <SummaryCard title="Pending" value={summary?.totalPending || 0} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
        <button 
          onClick={() => setActiveTab('payments')}
          style={{ padding: '12px 24px', position: 'relative', top: '2px', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'payments' ? '3px solid var(--primary)' : '3px solid transparent', fontSize: '1rem', fontWeight: activeTab === 'payments' ? 800 : 500, color: activeTab === 'payments' ? 'var(--primary)' : 'var(--secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Payment Collections
        </button>
        <button 
          onClick={() => setActiveTab('expenses')}
          style={{ padding: '12px 24px', position: 'relative', top: '2px', backgroundColor: 'transparent', border: 'none', borderBottom: activeTab === 'expenses' ? '3px solid var(--danger)' : '3px solid transparent', fontSize: '1rem', fontWeight: activeTab === 'expenses' ? 800 : 500, color: activeTab === 'expenses' ? 'var(--danger)' : 'var(--secondary)', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Expenditures
        </button>
      </div>

      <div className="card">
        {loading ? <Loader /> : activeTab === 'payments' ? (
          <Table headers={['Member', 'Month/Year', 'Amount', 'Status', 'Method', 'Date Paid']}>
            {data.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.member?.fullName}</TableCell>
                <TableCell>{p.month}/{p.year}</TableCell>
                <TableCell>${p.amount}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell>{p.paymentMethod?.name || '-'}</TableCell>
                <TableCell>{p.datePaid ? new Date(p.datePaid).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))}
          </Table>
        ) : (
          <Table headers={['Date', 'Description', 'Category', 'Method', 'Amount']}>
            {expensesData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--secondary)' }}>
                  No expenses found for the selected period.
                </TableCell>
              </TableRow>
            ) : (
              expensesData.map((exp) => (
                <TableRow key={exp._id}>
                  <TableCell style={{ color: '#64748b' }}>{new Date(exp.date).toLocaleDateString()}</TableCell>
                  <TableCell style={{ fontWeight: 700, color: 'var(--foreground)' }}>{exp.description}</TableCell>
                  <TableCell>
                    <span style={{ padding: '4px 12px', borderRadius: '20px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700 }}>
                      {exp.category}
                    </span>
                  </TableCell>
                  <TableCell style={{ color: '#64748b' }}>{exp.paymentMethod?.name || '-'}</TableCell>
                  <TableCell style={{ color: 'var(--danger)', fontWeight: 800, fontSize: '1.05rem' }}>-${exp.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </Table>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value }: any) => (
  <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
    <p style={{ fontSize: '0.8rem', color: 'var(--secondary)', marginBottom: '4px' }}>{title}</p>
    <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{value}</h4>
  </div>
);

const StatusBadge = ({ status }: any) => (
  <span style={{
    padding: '4px 8px',
    borderRadius: '6px',
    backgroundColor: status === 'paid' ? '#d1fae5' : '#fee2e2',
    color: status === 'paid' ? '#065f46' : '#991b1b',
    fontSize: '0.75rem',
    fontWeight: '600'
  }}>
    {status}
  </span>
);

const selectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' };

export default ReportsPage;
