import React, { useEffect, useState } from 'react';
import { Heart, CheckCircle } from 'lucide-react';
import { welfareService } from '../../services/welfareService';
import type { WelfareBenefit } from '../../types';

export default function WelfarePage() {
  const [benefits, setBenefits] = useState<WelfareBenefit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    welfareService.getBenefits().then(data => { setBenefits(data); setLoading(false); });
  }, []);

  const TYPE_COLOR: Record<string, string> = { Loan: 'badge-primary', Donation: 'badge-danger', Grant: 'badge-teal' };

  return (
    <div>
      <div className="page-header">
        <h1>Welfare Benefits</h1>
        <p>Overview of all welfare support programs offered to society members</p>
      </div>

      {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-400)' }}>Loading...</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {benefits.map(b => (
            <div key={b.id} className={`card ${!b.active ? 'benefit-inactive' : ''}`} style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, background: 'var(--color-primary-50)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-700)' }}>
                  <Heart size={24} />
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <span className={`badge ${TYPE_COLOR[b.type]}`}>{b.type}</span>
                  <span className={`badge ${b.active ? 'badge-success' : 'badge-danger'}`}>{b.active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-gray-900)', marginBottom: 8 }}>{b.name}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', marginBottom: 16, lineHeight: 1.6 }}>{b.description}</p>
              <div style={{ background: 'var(--color-gray-50)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Eligibility Criteria</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-600)', lineHeight: 1.5 }}>{b.eligibilityCriteria}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-gray-400)', fontWeight: 600, textTransform: 'uppercase' }}>Maximum Amount</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-700)', fontFamily: 'var(--font-heading)' }}>Rs.{b.maxAmount.toLocaleString()}</p>
                </div>
                {b.active && <CheckCircle size={20} style={{ color: 'var(--color-success)' }} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
