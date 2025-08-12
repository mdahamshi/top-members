import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNavbarLinks } from '../utils/getNavbarLinks.js';

export default function Navbar({ inLinks = null, onLinkClick }) {
  const { isAuth, user } = useAuth();
  const menuLinks = getNavbarLinks(isAuth, user, inLinks);

  return (
    menuLinks.length > 0 && (
      <ul className="flex gap-4 flex-col md:flex-row">
        {menuLinks.map((link) => (
          <li key={link.id}>
            <NavLink
              onClick={onLinkClick}
              to={`/${link.id === 'home' ? '' : link.id}`}
              className={({ isActive }) =>
                [
                  'clickable p-2 dark:text-white text-primary hover:font-bold hover:border',
                  isActive ? 'font-bold border' : '',
                ].join(' ')
              }
            >
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>
    )
  );
}
