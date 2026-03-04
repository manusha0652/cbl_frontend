import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, User, Mail, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { memberService } from '../../services/memberService';

const DEPARTMENTS = ['Finance','IT','HR','Operations','Marketing','Legal','Procurement','Audit','Administration','Engineering'];

export default function MemberRegistrationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    position: '',
    dateJoined: new Date().toISOString().split('T')[0],
    nextOfKin: '',
    nokPhone: '',
    nokRelationship: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.employeeId || !formData.department) {
      return toast.error('Please fill in all required fields (Name, ID, Department)');
    }

    setLoading(true);
    try {
      await memberService.create(formData as any);
      toast.success('Member registration successful');
      navigate('/members');
    } catch (err) {
      toast.error('Failed to register member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Module 1: Member Registration</h1>
          <p>Initial profiling and registration into the welfare society</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/members')}>
           <X size={16} /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-8">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          
          {/* Section 1: Basic Information */}
          <div className="form-section">
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <User size={18} className="text-primary-600" /> Basic Employee Information
            </h3>
            
            <div className="form-group mb-4">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" className="form-control" placeholder="e.g. Kasun Perera"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="form-row mb-4">
              <div className="form-group">
                <label className="form-label">Employee ID *</label>
                <input 
                  type="text" className="form-control" placeholder="CBL-1XXX"
                  value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Company Department *</label>
              <select className="form-control" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Position</label>
              <input 
                type="text" className="form-control" placeholder="e.g. Senior Accountant"
                value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})}
              />
            </div>
          </div>

          {/* Section 2: Contact & Dates */}
          <div className="form-section">
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
               <Mail size={18} className="text-secondary-600" /> Contact & Society Details
            </h3>

            <div className="form-group mb-4">
              <label className="form-label">Email Address</label>
              <input 
                type="email" className="form-control" placeholder="employee@cbl.lk"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" className="form-control" placeholder="077 ..."
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Home Address</label>
              <input 
                type="text" className="form-control" placeholder="Residential address"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date Joined Society</label>
              <input 
                type="date" className="form-control"
                value={formData.dateJoined} onChange={e => setFormData({...formData, dateJoined: e.target.value})}
              />
            </div>
          </div>

          {/* Section 3: Next of Kin (Profiling) */}
          <div className="form-section" style={{ gridColumn: '1 / -1' }}>
             <hr style={{ border: 0, borderTop: '1px solid var(--color-gray-100)', margin: '16px 0 32px' }} />
             <h3 style={{ fontSize: '1.1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Heart size={18} className="text-danger" /> Next of Kin Profiling (Welfare Requirement)
             </h3>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" className="form-control"
                    value={formData.nextOfKin} onChange={e => setFormData({...formData, nextOfKin: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <input 
                    type="text" className="form-control" placeholder="e.g. Spouse, Parent, Child"
                    value={formData.nokRelationship} onChange={e => setFormData({...formData, nokRelationship: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" className="form-control"
                    value={formData.nokPhone} onChange={e => setFormData({...formData, nokPhone: e.target.value})}
                  />
                </div>
             </div>
          </div>
        </div>

        <div style={{ marginTop: 48, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
           <button type="button" className="btn btn-ghost" onClick={() => navigate('/members')}>Cancel</button>
           <button type="submit" className="btn btn-primary" style={{ padding: '0 40px' }} disabled={loading}>
              <Save size={16} /> {loading ? 'Registering...' : 'Complete Registration'}
           </button>
        </div>
      </form>
    </div>
  );
}
