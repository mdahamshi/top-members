import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotAuth from '../pages/NotAuth';

import { Card, Label, TextInput, Button, Alert } from 'flowbite-react';
import SmartButton from './SmartButton';
import { useAuth } from '../context/AuthContext';
import { Frown } from 'lucide-react';
export default function Unjoin() {
  const { joinClub, isAuth, loading, isMember } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const res = await joinClub();
    if (res) {
      setMessage(res.data.message);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setError('Failed to unsubscribe');
    }
  };
  if (!isAuth)
    return (
      <NotAuth
        msg="You are not logged in on this site !"
        link={{ text: 'Login', id: 'login' }}
      />
    );
  if (!isMember && !message)
    return (
      <NotAuth
        msg="You are not a member!"
        link={{ text: 'Join', id: 'join' }}
      />
    );
  return (
    <div className="flex self-center items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <Frown size={40} className="self-center text-primary" />
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Are you sure you want to leave us ?
        </h1>
        {message && <Alert color="success">{message}</Alert>}
        {error && <Alert color="failure">{error}</Alert>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <SmartButton
            disabled={error === null && message}
            onClick={handleSubmit}
            className="btn-primary"
          >
            {error === null && message ? 'Leaving...' : 'Unsubscribe'}
          </SmartButton>
        </form>
      </Card>
    </div>
  );
}
