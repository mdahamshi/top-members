import { useState } from 'react';
import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SmartButton from '../components/SmartButton';
export default function Join() {
  const [passcode, setPasscode] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { joinClub, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const res = await joinClub(passcode);
    if (res) {
      setMessage(res.message);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError('Failed to join. Please check your passcode.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Join Club
        </h1>
        {message && <Alert color="success">{message}</Alert>}
        {error && <Alert color="failure">{error}</Alert>}

        <form className="flex flex-col gap-4 mt-4">
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
            onClick={handleSubmit}
            className="btn-primary"
          >
            {error === null && message ? 'Loading...' : 'Join'}
          </SmartButton>
        </form>
      </Card>
    </div>
  );
}
