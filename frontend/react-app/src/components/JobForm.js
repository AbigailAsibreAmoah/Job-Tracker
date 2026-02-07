import React, { useState, useEffect, useRef } from 'react';

const JobForm = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    location: '',
    salary: '',
    status: 'applied',
    notes: '',
    application_date: ''
  });
  const formRef = useRef(null);

  useEffect(() => {
    if (job) {
      setFormData({
        position: job.position || '',
        company: job.company || '',
        location: job.location || '',
        salary: job.salary || '',
        status: job.status || 'applied',
        notes: job.notes || '',
        application_date: job.application_date || ''
      });
    } else {
      // Load draft from localStorage if available
      const draft = localStorage.getItem('jobFormDraft');
      if (draft) {
        setFormData(JSON.parse(draft));
      }
    }
  }, [job]);

  // Save draft whenever form data changes
  useEffect(() => {
    if (!job) { // Only save drafts for new applications
      localStorage.setItem('jobFormDraft', JSON.stringify(formData));
    }
  }, [formData, job]);

  // Handle click outside to close form
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onCancel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.position || !formData.company) {
      alert('Please fill in Position and Company fields');
      return;
    }
    
    onSubmit(formData);
  };

  const handleButtonClick = () => {
    if (!formData.position || !formData.company) {
      alert('Please fill in Position and Company fields');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="job-form-overlay">
      <div className="job-form" ref={formRef}>
        <h2>{job ? 'Edit Application' : 'Add New Application'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="position">Position *</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company *</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Remote, New York, NY"
            />
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., $80,000 - $100,000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="application_date">Application Date</label>
            <input
              type="date"
              id="application_date"
              name="application_date"
              value={formData.application_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this application..."
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button 
              type="button"
              className="btn-primary"
              onClick={handleButtonClick}
            >
              {job ? 'Update' : 'Add'} Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;