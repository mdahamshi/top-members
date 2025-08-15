import { useState } from 'react';

export default function ConfirmBlock({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  ConfirmButton,
  CancelButton,
  children,
}) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      await Promise.resolve(onConfirm?.());
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="m-auto w-full max-w-md p-4 bg-white rounded-lg shadow dark:bg-primaryDark">
      {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}

      {message && <p className="mb-4">{message}</p>}
      {children}

      <div className="flex justify-end gap-3 mt-4">
        {CancelButton ? (
          <CancelButton onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </CancelButton>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 dark:text-white py-2 rounded  bg-gray-200 dark:bg-gray-700"
          >
            {cancelLabel}
          </button>
        )}

        {ConfirmButton ? (
          <ConfirmButton onClick={handleConfirm} disabled={loading}>
            {loading ? 'Loading…' : confirmLabel}
          </ConfirmButton>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 rounded btn-primary text-white"
          >
            {loading ? 'Loading…' : confirmLabel}
          </button>
        )}
      </div>
    </div>
  );
}
