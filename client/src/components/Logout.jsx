import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotAuth from '../pages/NotAuth';

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
      setTimeout(() => navigate('/', { replace: true }), 1500);
    };
    if (isAuth) doLogout();
  }, []);

  return <NotAuth title="Bye !" msg="Logging you out, come back soon :)" />;
}
