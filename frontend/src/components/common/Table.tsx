import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table = ({ headers, children }: TableProps) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left'
      }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            {headers.map((header, index) => (
              <th key={index} style={{
                padding: '12px 16px',
                fontWeight: '600',
                color: 'var(--secondary)',
                fontSize: '0.85rem',
                textTransform: 'uppercase'
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr style={{ 
    borderBottom: '1px solid var(--border)',
    transition: 'background-color 0.1s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    {children}
  </tr>
);

export const TableCell = ({ children, style, colSpan, colspan }: { 
  children: React.ReactNode, 
  style?: React.CSSProperties, 
  colSpan?: number,
  colspan?: number
}) => (
  <td 
    style={{ padding: '16px', fontSize: '0.9rem', ...style }} 
    colSpan={colSpan || colspan}
  >
    {children}
  </td>
);
