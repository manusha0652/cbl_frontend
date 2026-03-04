import { useState, useEffect } from 'react';
import { FileText, Upload, Download, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { meetingService } from '../../services/meetingService';
import { Modal } from '../../components/modals/Modal';
import type { Meeting } from '../../types';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', fileName: 'document.pdf', fileSize: '0 KB' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    meetingService.getAll().then(data => { setMeetings(data); setLoading(false); });
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.date) { toast.error('Title and date are required'); return; }
    setSubmitting(true);
    const newMeeting = await meetingService.create({
      ...form,
      uploadedBy: 'Musa Usman',
      fileUrl: '#',
    });
    setMeetings(prev => [newMeeting, ...prev]);
    setShowModal(false);
    setForm({ title: '', description: '', date: '', fileName: 'document.pdf', fileSize: '0 KB' });
    toast.success('Meeting minutes uploaded successfully');
    setSubmitting(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    await meetingService.delete(id);
    setMeetings(prev => prev.filter(m => m.id !== id));
    toast.success('Meeting minutes deleted');
  };

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Meeting Minutes</h1>
          <p>Upload and manage welfare committee meeting records</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Upload size={15} /> Upload Minutes
        </button>
      </div>

      {loading ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-gray-400)' }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {meetings.map(m => (
            <div key={m.id} className="card card-body" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ width: 52, height: 52, background: 'var(--color-primary-50)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-700)', flexShrink: 0 }}>
                <FileText size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-gray-900)', marginBottom: 4 }}>{m.title}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginBottom: 8 }}>
                  {new Date(m.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} &bull; Uploaded by {m.uploadedBy} &bull; {m.fileName} ({m.fileSize})
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', lineHeight: 1.5 }}>{m.description}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => toast('Preview coming soon')}><Eye size={14} /> Preview</button>
                <button className="btn btn-outline btn-sm" onClick={() => toast('Download started')}><Download size={14} /> Download</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(m.id, m.title)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Meeting Minutes" size="md"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Uploading...' : 'Upload'}</button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Title <span className="required">*</span></label>
          <input type="text" className="form-control" placeholder="Meeting title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div className="form-group" style={{ marginTop: 14 }}>
          <label className="form-label">Date <span className="required">*</span></label>
          <input type="date" className="form-control" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
        </div>
        <div className="form-group" style={{ marginTop: 14 }}>
          <label className="form-label">Description</label>
          <textarea className="form-control" placeholder="Meeting agenda and key decisions" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </div>
        <div className="form-group" style={{ marginTop: 14 }}>
          <label className="form-label">PDF File</label>
          <div className="dropzone" style={{ padding: '24px 16px' }} onClick={() => toast('File picker coming soon')}>
            <Upload size={28} />
            <p style={{ fontSize: '0.875rem' }}>Click to upload PDF file</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
