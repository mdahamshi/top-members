import { useState } from 'react';

export default function SmartButton({
  onClick,
  loading = false,
  disabled: disabledProp = false,
  children,
  className = '',
  ...props
}) {
  const [clicked, setClicked] = useState(false);

  const handleClick = async (e) => {
    if (clicked || disabledProp || loading) return;
    setClicked(true);
    try {
      await onClick(e);
      if (error) setClicked(false);
    } catch (err) {
      setClicked(false);
    } finally {
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      disabled={disabledProp || loading || clicked}
      className={`${className}`}
    >
      {(loading || clicked) && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
