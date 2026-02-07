import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Unable to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error || !analytics) {
    return <div>{error || 'Unable to load analytics data.'}</div>;
  }

  return (
    <div>
      <h2>Application Analytics</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Applications</h3>
          <div className="number">{analytics.total || 0}</div>
        </div>

        <div className="analytics-card">
          <h3>Recent (30 days)</h3>
          <div className="number">{analytics.recent || 0}</div>
        </div>

        <div className="analytics-card">
          <h3>Pending</h3>
          <div className="number">{analytics.pending || 0}</div>
        </div>

        <div className="analytics-card">
          <h3>Response Rate</h3>
          <div className="number">
            {analytics.total > 0
              ? Math.round(
                  (((analytics.byStatus?.interview || 0) +
                    (analytics.byStatus?.offer || 0)) /
                    analytics.total) *
                    100
                )
              : 0}
            %
          </div>
        </div>
      </div>

      {analytics.byStatus && (
        <div className="analytics-section">
          <h3>Applications by Status</h3>
          <div className="analytics-grid">
            {Object.entries(analytics.byStatus).map(
              ([status, count]) => (
                <div key={status} className="analytics-card">
                  <h3>
                    {status.charAt(0).toUpperCase() +
                      status.slice(1)}
                  </h3>
                  <div className="number">{count}</div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
