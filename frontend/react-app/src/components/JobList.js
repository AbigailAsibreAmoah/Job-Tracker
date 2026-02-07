import React, { useState } from 'react';

const JobList = ({ jobs, onEdit, onDelete, onStatusChange }) => {
  const [interviewRounds, setInterviewRounds] = useState({});

  if (!jobs || jobs.length === 0) {
    return (
      <div className="empty-state">
        <h3>No applications yet</h3>
        <p>Start tracking your job applications by adding your first one!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusChange = (jobId, newStatus) => {
    if (newStatus === 'Interview') {
      setInterviewRounds({ ...interviewRounds, [jobId]: interviewRounds[jobId] || 'x1' });
    }
    onStatusChange(jobId, newStatus, interviewRounds[jobId]);
  };

  const handleInterviewRoundChange = (jobId, round) => {
    setInterviewRounds({ ...interviewRounds, [jobId]: round });
    onStatusChange(jobId, 'Interview', round);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return '#fff9c4';
      case 'Interview': return '#bbdefb';
      case 'Offer': return '#c8e6c9';
      case 'Rejected': return '#ffcdd2';
      default: return '#fff9c4';
    }
  };

  return (
    <div className="job-table-container">
      <table className="job-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Company</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Applied Date</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.application_id} style={{ backgroundColor: getStatusColor(job.status) }}>
              <td>{job.position || 'Position'}</td>
              <td>{job.company || 'Company'}</td>
              <td>{job.location || 'Remote'}</td>
              <td>{job.salary || 'N/A'}</td>
              <td>{formatDate(job.created_at)}</td>
              <td>
                <div className="status-cell">
                  <select
                    value={job.status || 'Applied'}
                    onChange={(e) => handleStatusChange(job.application_id, e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  {job.status === 'Interview' && (
                    <select
                      value={interviewRounds[job.application_id] || 'x1'}
                      onChange={(e) => handleInterviewRoundChange(job.application_id, e.target.value)}
                      className="round-dropdown"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={`x${i + 1}`}>x{i + 1}</option>
                      ))}
                    </select>
                  )}
                </div>
              </td>
              <td className="notes-cell">{job.notes || '-'}</td>
              <td>
                <div className="action-buttons">
                  <button onClick={() => onEdit(job)} className="btn-edit">Edit</button>
                  <button onClick={() => onDelete(job.application_id)} className="btn-delete">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobList;