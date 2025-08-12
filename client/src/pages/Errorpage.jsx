import { useRouteError } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Errorpage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="text-primary flex flex-col items-center justify-center p-8 font-sans text-cente dark:text-white">
      <h1 className="text-8xl mb-4 font-bold">404</h1>
      <p className="text-2xl mb-2">
        {' '}
        <i>{error.statusText || error.message}</i>
      </p>
      <p className="mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/" className="text-white link-btn button">
        Go Home
      </Link>
    </div>
  );
}
