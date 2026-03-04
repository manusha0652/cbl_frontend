import React, { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, X, RefreshCcw, PlusCircle, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { contributionService } from '../../services/contributionService';
import { Modal } from '../../components/modals/Modal';
import type { ContributionUploadRow } from '../../types';
import './Contributions.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEARS  = [2023, 2024, 2025];

// Mock CSV parse – generate sample rows
function parseCsv(_content: string, month: number, year: number): ContributionUploadRow[] {
  return [
    { employeeId: 'CBL-1001', memberName: 'Kasun Perera', amount: 5000, month, year },
    { employeeId: 'CBL-1002', memberName: 'Dilani Silva', amount: 5000, month, year },
    { employeeId: 'CBL-1003', memberName: 'Niroshan Fernando', amount: 0, month, year, hasError: true, errorMessage: 'Amount is 0' },
    { employeeId: 'CBL-1004', memberName: 'Sanduni Jayasuriya', amount: 5000, month, year },
    { employeeId: 'INVALID', memberName: 'Unknown Employee', amount: 5000, month, year, hasError: true, errorMessage: 'Employee ID not found' },
    { employeeId: 'CBL-1006', memberName: 'Anura Kumara', amount: 5000, month, year },
    { employeeId: 'CBL-1007', memberName: 'Kavinda Rajapaksha', amount: 5000, month, year },
    { employeeId: 'CBL-1008', memberName: 'Lakshani Siriwardena', amount: 5000, month, year },
  ];
}

export default function ContributionsPage() {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ContributionUploadRow[]>([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear]   = useState(new Date().getFullYear());
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.csv') || f.name.endsWith('.xlsx'))) {
      setFile(f);
      setPreview(parseCsv('', month, year));
      setConfirmed(false);
    } else {
      toast.error('Please upload a CSV or Excel file');
    }
  }, [month, year]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(parseCsv('', month, year));
      setConfirmed(false);
    }
  };

  const handleConfirm = async () => {
    setUploading(true);
    const result = await contributionService.uploadBatch(preview);
    setUploading(false);
    setConfirmed(true);
    toast.success(`Upload complete: ${result.success} records saved, ${result.errors} errors skipped`);
  };

  const clearUpload = () => { setFile(null); setPreview([]); setConfirmed(false); };

  const handleSyncPayroll = () => {
    setSyncing(true);
    toast.loading('Connecting to payroll system...', { id: 'sync' });
    setTimeout(() => {
       setSyncing(false);
       toast.success('Successfully synced 1,482 records from payroll!', { id: 'sync' });
       // Mock loading some data from payroll
       setPreview(parseCsv('', month, year).map(r => ({...r, hasError: false})));
       setFile(new File([], "payroll_sync_data.xlsx")); 
    }, 2500);
  };

  const errorRows  = preview.filter(r => r.hasError).length;
  const validRows  = preview.filter(r => !r.hasError).length;

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
           <h1>Contributions Management</h1>
           <p>Section 2: Automated payroll sync or manual entry (Single/Bulk)</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <button className="btn btn-outline" onClick={handleSyncPayroll} disabled={syncing}>
             <RefreshCcw size={16} className={syncing ? 'spin' : ''} /> Sync with Payroll
           </button>
           <button className="btn btn-primary" onClick={() => setShowManualModal(true)}>
             <PlusCircle size={16} /> Manual Single Entry
           </button>
        </div>
      </div>

      {/* Upload Area */}
      {!file ? (
        <div className="card card-body" style={{ marginBottom: 20 }}>
          <div className="form-row" style={{ marginBottom: 20, maxWidth: 500 }}>
            <div className="form-group">
              <label className="form-label">Month</label>
              <select className="form-control" value={month} onChange={e => setMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year</label>
              <select className="form-control" value={year} onChange={e => setYear(Number(e.target.value))}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div
            className={`dropzone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <UploadCloud size={48} />
            <p><strong>Drag & drop</strong> bulk Excel/CSV for manual entry or <strong style={{ color: 'var(--color-primary-600)' }}>browse</strong></p>
            <span>Supported formats: .xlsx, .csv — Max 5MB</span>
            <input id="file-input" type="file" accept=".csv,.xlsx" style={{ display: 'none' }} onChange={handleFileInput} />
          </div>
        </div>
      ) : (
        <div>
          {/* File Info + Stats */}
          <div className="card card-body flex items-center justify-between" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="upload-file-icon"><Database size={20} /></div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-gray-900)' }}>{file.name || 'Synced Data'}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)' }}>
                  {MONTHS[month - 1]} {year} &bull; {preview.length} total records detected
                </p>
              </div>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={clearUpload}><X size={16} /></button>
          </div>

          {/* Validation Summary */}
          <div className="upload-summary" style={{ marginBottom: 16 }}>
            <div className="upload-stat upload-stat--success"><CheckCircle size={16} />{validRows} Valid Records</div>
            {errorRows > 0 && <div className="upload-stat upload-stat--error"><AlertCircle size={16} />{errorRows} Errors Found</div>}
          </div>

          {/* Preview Table */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><h3>Preview Data</h3><span className="badge badge-primary">{preview.length} rows</span></div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>Employee ID</th><th>Member Name</th><th>Amount (Rs.)</th><th>Month</th><th>Year</th><th>Validation</th></tr></thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className={row.hasError ? 'row-error' : ''}>
                      <td>{row.employeeId}</td>
                      <td>{row.memberName}</td>
                      <td>Rs.{row.amount.toLocaleString()}</td>
                      <td>{MONTHS[row.month - 1]}</td>
                      <td>{row.year}</td>
                      <td>
                        {row.hasError
                          ? <span className="badge badge-danger"><AlertCircle size={10} /> {row.errorMessage}</span>
                          : <span className="badge badge-success"><CheckCircle size={10} /> Valid</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action */}
          {!confirmed && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={clearUpload}>Cancel</button>
              <button className="btn btn-primary" onClick={handleConfirm} disabled={uploading || validRows === 0}>
                {uploading ? 'Finalizing Sync...' : `Confirm & Save (${validRows} valid records)`}
              </button>
            </div>
          )}

          {confirmed && (
            <div className="upload-success-banner">
              <CheckCircle size={20} />
              <p>Welfare records successfully updated for {MONTHS[month - 1]} {year}!</p>
              <button className="btn btn-primary btn-sm" onClick={clearUpload}>New Batch</button>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showManualModal} onClose={() => setShowManualModal(false)} title="Manual Contribution Entry" size="md">
         <div style={{ padding: 10, textAlign: 'center' }}>
            <PlusCircle size={40} style={{ color: 'var(--color-primary-200)', marginBottom: 16 }} />
            <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>One-by-one manual entry form is being optimized for current payroll database.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 20 }} onClick={() => setShowManualModal(false)}>Close</button>
         </div>
      </Modal>
    </div>
  );
}
