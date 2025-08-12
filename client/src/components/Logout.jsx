import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Logout() {
  const { logout, isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout();
      } catch (err) {
        console.error('Logout failed:', err);
      }
      navigate('/', { replace: true });
    };
    if (isAuth) doLogout();
  }, []);

  return null;
}
