import React, { useState, useEffect } from 'react';
import DashboardCards from './DashboardCards';
import RecentPayments from './RecentPayments';
import api from '../../services/api';
import { Loader } from '../../components/common/Loader';

const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardCards cards={stats?.cards} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <RecentPayments payments={stats?.recentPayments} />
        
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Payment Methods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.methodTotals && Object.entries(stats.methodTotals).map(([method, amount]: any) => (
              <div key={method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{method}</span>
                <span style={{ fontWeight: '600' }}>${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
