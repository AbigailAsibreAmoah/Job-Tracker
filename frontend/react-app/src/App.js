import React, { useState, useEffect, useCallback } from 'react';
import { Amplify, Auth, API } from 'aws-amplify'; // 
import AuthForm from './components/AuthForm';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import Analytics from './components/Analytics';
import './App.css';

// Configure Amplify
Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: 'JobTrackerAPI',
        endpoint: process.env.REACT_APP_API_URL,
        region: process.env.REACT_APP_AWS_REGION,
      },
    ],
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      const response = await API.get('JobTrackerAPI', '/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }, []);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);
        await fetchJobs();
      } catch {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuthState();
  }, [fetchJobs]);

  const getAuthHeaders = async () => {
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();
    return { Authorization: `Bearer ${token}` };
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
      setJobs([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddJob = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const headers = await getAuthHeaders();
      await API.del('JobTrackerAPI', `/applications/${jobId}`, { headers });
      await fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleStatusChange = async (jobId, status, interviewRound) => {
    try {
      const headers = await getAuthHeaders();
      const updateData = { status };
      if (status === 'Interview' && interviewRound) {
        updateData.interview_round = interviewRound;
      }
      await API.put('JobTrackerAPI', `/applications/${jobId}`, { body: updateData, headers });
      await fetchJobs();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleFormSubmit = async (jobData) => {
    try {
      const headers = await getAuthHeaders();
      if (editingJob) {
        await API.put(
          'JobTrackerAPI',
          `/applications/${editingJob.application_id}`,
          { body: jobData, headers }
        );
      } else {
        await API.post('JobTrackerAPI', '/applications', { body: jobData, headers });
      }
      setShowForm(false);
      setEditingJob(null);
      localStorage.removeItem('jobFormDraft');
      await fetchJobs();
    } catch {
      alert('Error saving application. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <AuthForm onSignIn={setUser} />;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Job Tracker</h1>
        <div className="header-actions">
          <span>
            Welcome, {user.attributes?.given_name && user.attributes?.family_name
              ? `${user.attributes.given_name} ${user.attributes.family_name}`
              : user.attributes?.email}
          </span>
          <button onClick={handleSignOut} className="btn-secondary">Sign Out</button>
        </div>
      </header>

      <nav className="app-nav">
        <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>
          Applications
        </button>
        <button className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
          Analytics
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'jobs' && (
          <>
            <div className="actions-bar">
              <h2>My Applications</h2>
              <button onClick={handleAddJob} className="btn-primary">Add Application</button>
            </div>
            <JobList jobs={jobs} onEdit={handleEditJob} onDelete={handleDeleteJob} onStatusChange={handleStatusChange} />
          </>
        )}

        {activeTab === 'analytics' && <Analytics />}

        {showForm && (
          <JobForm
            job={editingJob}
            onSubmit={handleFormSubmit}
            onCancel={() => { setShowForm(false); setEditingJob(null); }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
