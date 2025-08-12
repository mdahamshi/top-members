import { Link } from 'react-router-dom';

export default function NotAuth({ msg, link, title }) {
  return (
    <div className="text-primary flex flex-col items-center justify-center p-8 font-sans text-cente dark:text-white">
      <h1 className="text-4xl mb-4 font-bold">{title || 'Hey :)'}</h1>

      <p className="text-black mb-4">{msg}</p>
      {link && (
        <Link to={`/${link.id}`} className="text-white link-btn min-w-22">
          {link.text}
        </Link>
      )}
    </div>
  );
}
