import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import './AuthForm.css';

const AuthForm = ({ onSignIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    newPassword: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (resetPassword) {
        // Confirm password reset
        await Auth.forgotPasswordSubmit(formData.email, formData.verificationCode, formData.newPassword);
        setResetPassword(false);
        setForgotPassword(false);
        setError('Password reset successful! Please sign in.');
      } else if (forgotPassword) {
        // Send password reset code
        await Auth.forgotPassword(formData.email);
        setResetPassword(true);
        setError('Password reset code sent to your email');
      } else if (needsVerification) {
        // Confirm sign up with verification code
        await Auth.confirmSignUp(formData.email, formData.verificationCode);
        setNeedsVerification(false);
        setError('Account verified! Please sign in.');
        setIsSignUp(false);
      } else if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        await Auth.signUp({
          username: formData.email,
          password: formData.password,
          attributes: {
            email: formData.email,
            given_name: formData.firstName,
            family_name: formData.lastName
          }
        });
        setNeedsVerification(true);
        setError('Please check your email for verification code');
      } else {
        const user = await Auth.signIn(formData.email, formData.password);
        onSignIn(user);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
    setLoading(false);
  };

  const resendCode = async () => {
    try {
      if (needsVerification) {
        await Auth.resendSignUp(formData.email);
      } else if (resetPassword) {
        await Auth.forgotPassword(formData.email);
      }
      setError('Code resent to your email');
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    }
  };

  const resetForm = () => {
    setIsSignUp(false);
    setNeedsVerification(false);
    setForgotPassword(false);
    setResetPassword(false);
    setError('');
    setFormData({ email: '', password: '', confirmPassword: '', verificationCode: '', newPassword: '', firstName: '', lastName: '' });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Job Tracker</h1>
          <p>
            {resetPassword
              ? 'Enter reset code and new password'
              : forgotPassword
              ? 'Enter your email to reset password'
              : needsVerification 
              ? 'Enter verification code' 
              : isSignUp 
              ? 'Create your account' 
              : 'Welcome back'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {resetPassword ? (
            <>
              <div className="form-field">
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="Enter reset code"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-field">
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="button" onClick={resendCode} className="resend-button">
                Resend Code
              </button>
            </>
          ) : forgotPassword ? (
            <div className="form-field">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          ) : needsVerification ? (
            <>
              <div className="form-field">
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="Enter verification code"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="button" onClick={resendCode} className="resend-button">
                Resend Code
              </button>
            </>
          ) : (
            <>
              <div className="form-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {isSignUp && (
                <>
                  <div className="form-field">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field">
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              {!isSignUp && (
                <button 
                  type="button" 
                  onClick={() => setForgotPassword(true)}
                  className="forgot-password-button"
                >
                  Forgot Password?
                </button>
              )}
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading 
              ? 'Please wait...' 
              : resetPassword
              ? 'Reset Password'
              : forgotPassword
              ? 'Send Reset Code'
              : needsVerification 
              ? 'Verify Account' 
              : isSignUp 
              ? 'Sign Up' 
              : 'Sign In'
            }
          </button>
        </form>

        {!needsVerification && !forgotPassword && !resetPassword && (
          <div className="auth-switch">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setFormData({ email: '', password: '', confirmPassword: '', verificationCode: '', newPassword: '', firstName: '', lastName: '' });
                }}
                className="switch-button"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        )}

        {(forgotPassword || resetPassword) && (
          <div className="auth-switch">
            <button
              type="button"
              onClick={resetForm}
              className="switch-button"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;