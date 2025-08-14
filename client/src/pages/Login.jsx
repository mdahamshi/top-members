import { Button, Label, TextInput, Card, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import SmartButton from '../components/SmartButton';
export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login, error: globalErr, isAuth, clearError, loading } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  useEffect(() => {
    if (isAuth) {
      setSuccess('Signed in successfully !');
      setTimeout(() => navigate('/', { replace: true }), 1500);
    }
  }, [isAuth]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await login(formData);
    if (error) setError((prev) => error);
    else {
      if (isAuth) setTimeout(() => navigate('/'), 1500);
      setSuccess('Signed in successfully !');
      setError(null);
    }
  };

  return (
    <Card className="w-full m-auto max-w-md">
      <h1 className="text-2xl self-start font-bold text-center text-gray-800 dark:text-white">
        Login
      </h1>
      {success && (
        <Alert color="success" className="sticky top-16 z-50 mb-4 shadow-md">
          {success}
        </Alert>
      )}
      {error && (
        <Alert
          color="failure"
          className="sticky  top-16 z-50 mb-4 shadow-md"
          aria-live="assertive"
        >
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username">Username</Label>
          </div>
          <TextInput
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password">Password</Label>
          </div>{' '}
          <TextInput
            id="password"
            name="password"
            autoComplete="current-password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <SmartButton
          disabled={isAuth || loading}
          type="submit"
          className="btn-primary"
        >
          {isAuth ? 'Signing in...' : 'Sign in'}
        </SmartButton>
      </form>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Don’t have an account?{' '}
        <a
          href="/register"
          className="text-primary hover:underline dark:text-primary-400"
        >
          Sign up
        </a>
      </p>
    </Card>
  );
}
