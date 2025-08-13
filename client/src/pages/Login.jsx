import { Button, Label, TextInput, Card, Alert } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login, error, isAuth, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  useEffect(() => {
    if (isAuth) navigate('/', { replace: true });
    clearError();
  }, [isAuth]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(formData);
  };

  return (
    <div className="flex  items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl self-start font-bold text-center text-gray-800 dark:text-white">
          Login
        </h1>
        {error && (
          <Alert
            color="failure"
            className="sticky  top-16 z-50 mb-4 shadow-md"
            aria-live="assertive"
          >
            {JSON.parse(error)?.error}
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
          <Button type="submit" className="w-full btn-primary">
            Sign in
          </Button>
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
    </div>
  );
}
