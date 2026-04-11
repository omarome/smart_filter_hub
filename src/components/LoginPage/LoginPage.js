import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
  Link,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, Tooltip } from '@mui/material';
import { LucideKanban, LucideFilter, LucideZap, LucideBell } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { useThemeControl } from '../../context/ThemeContext';
import '../../styles/LoginPage.less';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const FEATURES = [
  { icon: LucideKanban, title: 'Sales Pipeline', desc: 'Visual Kanban & tracking for every deal.' },
  { icon: LucideFilter, title: 'Segmentation', desc: 'Advanced nested logic with Query Builder.' },
  { icon: LucideZap, title: 'Automation', desc: 'No-code triggers for effortless workflows.' },
  { icon: LucideBell, title: 'FCM Ready', desc: 'Real-time alerts for the whole team.' },
];

/**
 * LoginPage – email/password login with optional social sign-in.
 */
export default function LoginPage({ onSwitchToRegister }) {
  const { login, loginWithGoogle } = useAuth();
  const { mode, toggleTheme } = useThemeControl();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
        <IconButton onClick={toggleTheme} className="login-theme-toggle">
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>

      {/* Main scrollable area — centers content vertically when space allows */}
      <div className="login-main">
        {/* Brand header — product name + tagline above the card */}
        <div className="login-brand">
          <div className="login-brand-logo">
            <LockOutlinedIcon style={{ fontSize: 20, color: '#fff' }} />
          </div>
          <div className="login-brand-text">
            <h1 className="login-brand-name">HumintFlow</h1>
            <p className="login-brand-tagline">Your sales team's unified workspace</p>
          </div>
        </div>

        <Paper className="login-card" elevation={0}>
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to continue</p>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <TextField
              id="login-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoFocus
              variant="outlined"
              className="login-field"
            />
            <TextField
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              variant="outlined"
              className="login-field"
            />
            <Button
              id="login-submit"
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              className="login-button"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Divider className="login-divider">or</Divider>

          <Button
            id="login-google"
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            className="login-google-button"
          >
            Sign in with Google
          </Button>

          <p className="login-footer">
            Don't have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={onSwitchToRegister}
              id="switch-to-register"
            >
              Create one
            </Link>
          </p>
        </Paper>

        {/* Feature highlights below the card */}
        <div className="login-about-anchor">
          <span className="login-about-label">Why HumintFlow?</span>
          <div className="login-info-grid">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="login-info-card">
                <div className="info-card-icon">
                  <Icon size={15} />
                </div>
                <div className="info-card-body">
                  <span className="info-card-title">{title}</span>
                  <span className="info-card-desc">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer — in normal document flow, never overlaps content */}
      <footer className="auth-page-footer">
        <span className="auth-page-footer-copy">
          © {new Date().getFullYear()} HumintFlow. All rights reserved.
        </span>
        <div className="auth-page-footer-links">
          <a href="#" className="auth-page-footer-link">Privacy Policy</a>
          <span className="auth-page-footer-sep">·</span>
          <a href="#" className="auth-page-footer-link">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
