import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavbarLink,
  Button,
} from 'flowbite-react';
import { useState, useRef, useEffect } from 'react';
import api from '../api/urls';
import Navbarsb from './Navbar';
import { SendHorizonal, Sun, Moon, CircleUser } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Component() {
  const { appName, theme, toggleTheme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const { user, isAuth } = useAuth();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <Navbar ref={navRef} className="sticky top-0 z-5 shadow-md">
      <NavbarBrand href="/" as={Link}>
        <SendHorizonal className="size-10 mr-5 stroke-primary" />
        <span className="hidden sm:block self-center text-primary whitespace-nowrap text-2xl font-semibold">
          {appName}
        </span>
      </NavbarBrand>

      <div className="flex items-center gap-4 md:order-2">
        <button onClick={toggleTheme} className="nav-link clickable">
          {theme === 'dark' ? (
            <Moon className="dark:stroke-white stroke-primary stroke-2" />
          ) : (
            <Sun className="dark:stroke-white stroke-primary stroke-2" />
          )}
        </button>
        {isAuth && (
          <NavLink
            className={({ isActive }) =>
              ['nav-link', isActive && 'font-bold !border-current']
                .filter(Boolean)
                .join(' ')
            }
            to={`/users/${user.id}/messages`}
          >
            <CircleUser />
          </NavLink>
        )}
        <NavbarToggle onClick={() => setIsOpen(!isOpen)} />{' '}
      </div>

      <NavbarCollapse className={isOpen ? 'block' : 'hidden'}>
        <Navbarsb onLinkClick={() => setIsOpen(false)} />
      </NavbarCollapse>
    </Navbar>
  );
}
