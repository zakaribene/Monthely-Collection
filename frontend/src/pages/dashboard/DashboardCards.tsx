import React from 'react';
import { Users, CreditCard, Clock, DollarSign } from 'lucide-react';

const DashboardCards = ({ cards }: { cards: any }) => {
  const cardData = [
    { title: 'Total Members', value: cards?.totalMembers || 0, icon: <Users size={24} />, color: '#3b82f6' },
    { title: 'Total Paid', value: cards?.totalPaid || 0, icon: <CreditCard size={24} />, color: '#10b981' },
    { title: 'Total Pending', value: cards?.totalPending || 0, icon: <Clock size={24} />, color: '#f59e0b' },
    { title: 'Total Collected', value: `$${(cards?.totalMoneyCollected || 0).toLocaleString()}`, icon: <DollarSign size={24} />, color: '#6366f1' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
      {cardData.map((item, index) => (
        <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: `${item.color}15`,
            color: item.color,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {item.icon}
          </div>
          <div>
            <p style={{ color: 'var(--secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>{item.title}</p>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{item.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
