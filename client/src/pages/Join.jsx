import { useState } from 'react';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SmartButton from '../components/SmartButton';
import NotAuth from './NotAuth';
export default function Join() {
  const [passcode, setPasscode] = useState('');
  const [message, setMessage] = useState(null);
  const { joinClub, loading, error: globalErr, isAuth, isMember } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const { data, error } = await joinClub(passcode);
    if (data) {
      setMessage(data.message);
      setTimeout(() => navigate('/'), 1500);
    }
    if (error) setError((prev) => error);
    else setError(null);
  };
  if (!isAuth)
    return (
      <NotAuth
        msg="You are not logged in on this site !"
        link={{ text: 'Login', id: 'login' }}
      />
    );
  if (isMember && !message)
    return (
      <NotAuth
        msg="You are already a member !"
        link={{ text: 'Home', id: '' }}
      />
    );
  return (
    <div className="flex  items-center justify-center">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Join Club
        </h1>
        {message && <Alert color="success">{message}</Alert>}
        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <Label htmlFor="passcode" value="Passcode" />
            <TextInput
              id="passcode"
              name="passcode"
              type="text"
              placeholder="Enter your passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Hint: 'stop the war on gaza'
          </p>

          <SmartButton
            disabled={error === null && message}
            type="submit"
            className="btn-primary"
          >
            {error === null && message ? 'Loading...' : 'Join'}
          </SmartButton>
        </form>
      </Card>
    </div>
  );
}
