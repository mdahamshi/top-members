import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash, SquarePen, Pin, FileVideo } from 'lucide-react';
import { Button } from 'flowbite-react';
import MessageEdit from './MessageEdit';
import { Link } from 'react-router-dom';
import api from '../api/urls';
import ConfirmBlock from './ConfirmBlock';
import { useAuth } from '../context/AuthContext';
const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : ': )');

const MessageBubble = ({
  onSave,
  removeMessage,
  msg,
  avatarColor = '#6C63FF',
}) => {
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const { created_at, editable, title } = { ...msg };
  const username = msg?.user?.username;
  const isMember = !!msg?.user?.username;
  const name = msg?.user?.fname;
  const { user, isAuth, clearError, loading } = useAuth();
  const messageDeleteConfirm = () => {
    setRemove(true);
  };
  if (remove)
    return (
      <ConfirmBlock
        onConfirm={async () => await removeMessage(msg.id)}
        onCancel={() => setRemove(false)}
        confirmLabel="Delete"
        message="Are you sure you want to delete this message ?"
        title="Delete"
      />
    );
  if (edit)
    return (
      <MessageEdit
        msg={msg}
        onCancelSave={(id, data) => {
          setEdit(false);
          if (data) {
            onSave(id, data);
          }
        }}
      />
    );
  return (
    <div className="dark:text-white  flex flex-col justify-between gap-3 py-2">
      <div
        className={
          user && msg.user_id === user?.id
            ? 'flex flex-row-reverse gap-3'
            : 'flex gap-3 '
        }
      >
        <div
          className={`${!isMember ? 'rotate-90' : ''} w-12 text-2xl h-12 rounded-full shrink-0 flex items-center justify-center text-white font-bold `}
          style={{ backgroundColor: avatarColor }}
        >
          {getInitials(name)}
        </div>
        <div className="flex flex-col w-full">
          <div className="flex border dark:border-0 bg-white  border-gray-200 box-border mb-2 flex-col p-4 rounded-md shadow-md  dark:bg-primaryDark">
            <div className="flex mb-1 gap-3 justify-between  items-center">
              <div className="flex items-center gap-4">
                {title && (
                  <h2 className="first-letter:uppercase text-md font-bold  whitespace-break-spaces">
                    {title}
                  </h2>
                )}
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {created_at
                    ? format(new Date(created_at), 'dd/MM HH:mm')
                    : '(Date)'}
                </span>
              </div>
              <div className="flex gap-4 justify-end">
                {msg.pinned && <Pin />}
              </div>
            </div>

            <div className="tracking-wide first-letter:uppercase">
              {msg.content}
            </div>
          </div>
          <div className="flex justify-between items-end">
            {username && user.id !== msg.user_id && (
              <div className="dark:text-white text-sm ">
                by:
                <strong className="dark:text-white text-primary">
                  <Link to={`/users/${msg.user_id}/messages`}>
                    {' '}
                    @{username}
                  </Link>
                </strong>
              </div>
            )}
            {editable && (
              <div className="flex gap-4 ">
                <span title="Edit" className="clickable">
                  <SquarePen
                    className="dark:stroke-white clickable text-primary"
                    onClick={() => setEdit(true)}
                  />
                </span>
                <span title="Delete" className="clickable">
                  <Trash
                    className="dark:stroke-white clickable text-primary"
                    onClick={messageDeleteConfirm}
                  />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
