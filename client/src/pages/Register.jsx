import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Label, TextInput, Card, Alert, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import NotAuth from './NotAuth';
import { Check, X } from 'lucide-react';
import SmartButton from '../components/SmartButton';

export default function RegisterPage() {
  const { loading, register, isAuth, clearError, searchUser } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({ type: null, message: null });

  const [passwordError, setPasswordError] = useState(null);
  const [available, setAvailable] = useState(null);

  const navigate = useNavigate();

  // Handle form changes
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'confirmPassword' || name === 'password') {
      setPasswordError(null);
    }

    if (name === 'username' && value.trim() !== '') {
      const { data, error } = await searchUser(value);
      if (error) setStatus({ type: 'error', message: error });

      if (data?.available) {
        setStatus({ type: 'success', message: data.message });
        setAvailable(true);
      } else {
        setAvailable(false);
      }
    }
  };

  // Submit registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const { data, error } = await register({
      fname: form.firstName,
      lname: form.lastName,
      username: form.username,
      password: form.password,
    });

    if (error) {
      setStatus({ type: 'error', message: error });
      return;
    }

    if (data?.user) {
      setStatus({
        type: 'success',
        message: 'Account created! Logging you in...',
      });
      setTimeout(() => navigate('/', { replace: true }), 1500);
    }
  };

  if (isAuth && !status.type) {
    return (
      <NotAuth
        msg="You are logged in on this site!"
        link={{ text: 'Logout', id: 'logout' }}
      />
    );
  }

  return (
    <Card className="w-full m-auto max-w-md shadow-md">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        Create an Account
      </h2>

      {status.type === 'success' && (
        <Alert color="success" className="sticky top-16 z-50 mb-4 shadow-md">
          {status.message}
        </Alert>
      )}
      {status.type === 'error' && (
        <Alert color="failure" className="sticky top-16 z-50 mb-4 shadow-md">
          {status.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="firstName" className="mb-2 block">
            First Name
          </Label>
          <TextInput
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            type="text"
            placeholder="Your first name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="mb-2 block">
            Last Name
          </Label>
          <TextInput
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            type="text"
            placeholder="Your last name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="username" className="mb-2 block">
            Username
          </Label>
          <div className="flex items-center gap-2">
            <TextInput
              id="username"
              name="username"
              type="text"
              className="grow"
              autoComplete="username"
              placeholder="Your username"
              value={form.username}
              onChange={handleChange}
              required
            />
            {loading ? (
              <Spinner size="sm" />
            ) : available === true ? (
              <Check color="green" />
            ) : available === false ? (
              <X color="red" />
            ) : null}
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="mb-2 block">
            Password
          </Label>
          <TextInput
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="mb-2 block">
            Confirm password
          </Label>
          <TextInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          {passwordError && (
            <p className="text-red-600 text-sm mt-1">{passwordError}</p>
          )}
        </div>

        <SmartButton
          disabled={isAuth || !available}
          type="submit"
          className="btn-primary"
        >
          {isAuth ? 'Signing in...' : 'Register'}
        </SmartButton>
      </form>
    </Card>
  );
}
