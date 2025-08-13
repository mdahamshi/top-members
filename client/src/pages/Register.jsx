import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Label, TextInput, Card, Alert, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import NotAuth from './NotAuth';
import { Check, X } from 'lucide-react';
import SmartButton from '../components/SmartButton';
export default function RegisterPage() {
  const { login, loading, error, register, isAuth, clearError, search } =
    useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [success, setSuccess] = useState(null);
  const [localErr, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [available, setAvailable] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    clearError();
  }, [isAuth]);
  const handleChange = async (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      setPasswordError(null);
    }
    if (e.target.name === 'username' && e.target.value !== '') {
      try {
        const res = await search(e.target.value);
        if (res.available) {
          setSuccess(res.message);
          setAvailable(true);
          setError(null);
        } else {
          setSuccess(null);
          setAvailable(false);
          if (res.error) setError(res.error);
        }
      } catch (err) {
        setSuccess(null);
        console.log(error);
      }
    }
  };
  if (isAuth && !success)
    return (
      <NotAuth
        msg="You are logged in on this site !"
        link={{ text: 'Logout', id: 'logout' }}
      />
    );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const res = await register({
      fname: form.firstName,
      lname: form.lastName,
      username: form.username,
      password: form.password,
    });
    if (!res.user) {
      setSuccess(null);
      throw new Error('Registration failed');
    }
    setSuccess('Account created! Logging you in...');
    setTimeout(() => navigate('/'), 1500);
  };
  return (
    <Card className="w-full m-auto max-w-md shadow-md">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        Create an Account
      </h2>

      {(error || localErr) && (
        <Alert color="failure" className="sticky  top-16 z-50 mb-4 shadow-md">
          {JSON.parse(error)?.errors?.msg ||
            JSON.parse(error)?.error ||
            error ||
            localErr}
        </Alert>
      )}
      {success && (
        <Alert color="success" className="sticky top-16 z-50 mb-4 shadow-md">
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="firstName">First Name</Label>
          </div>
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
          <div className="mb-2 block">
            <Label htmlFor="lastName">Last Name</Label>
          </div>
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
          <div className="mb-2 block">
            <Label htmlFor="username">Username</Label>
          </div>
          <div className="flex items-center gap-2 ">
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
          <div className="mb-2 block">
            <Label htmlFor="password">Password</Label>
          </div>
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
          <div className="mb-2 block">
            <Label htmlFor="confirmPassword">Confirm password</Label>
          </div>
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
