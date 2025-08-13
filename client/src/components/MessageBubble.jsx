import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash, SquarePen, Pin } from 'lucide-react';
import { Button } from 'flowbite-react';
import MessageEdit from './MessageEdit';
import { Link } from 'react-router-dom';
import api from '../api/urls';
const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : ': )');

const MessageBubble = ({
  onSave,
  removeMessage,
  msg,
  avatarColor = '#6C63FF',
}) => {
  const [edit, setEdit] = useState(false);
  const { created_at, editable, title } = { ...msg };
  const username = msg?.user?.username;
  const isMember = !!msg?.user?.username;
  const name = msg?.user?.fname;
  const messageDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this message?'
    );
    if (!confirmed) return;

    return removeMessage(msg.id);
  };

  if (edit)
    return (
      <MessageEdit
        msg={msg}
        onCancelSave={(id, data) => {
          setEdit(false);
          if (data) onSave(id, data);
        }}
      />
    );
  return (
    <div className="dark:text-white  flex flex-col p-4   rounded-md shadow-md  dark:bg-primaryDark  justify-between gap-3 py-2">
      {msg.pinned && <Pin className="relative top-0 ml-auto right-0 m-2" />}

      {created_at && (
        <div>
          <div className="flex gap-3 justify-center">
            <span className="ml-2 text-xs text-gray-400">
              {format(new Date(created_at), 'PPP, p')}
            </span>
          </div>
        </div>
      )}
      <div className="flex gap-3 ">
        <div
          className={`${!isMember ? 'rotate-90' : ''} w-12 text-2xl h-12 rounded-full shrink-0 flex items-center justify-center text-white font-bold `}
          style={{ backgroundColor: avatarColor }}
        >
          {getInitials(name)}
        </div>

        <div className="flex flex-col ">
          <div className="flex justify-between items-start">
            {title && <h2 className="text-2xl">{title}</h2>}
          </div>
          <div className="bg-primary w-fit   mb-2 break-words  inline-block text-white  px-4 py-2 rounded-xl mt-1  ">
            {msg.content}
          </div>
          {username && (
            <div className="dark:text-white text-sm ">
              by:
              <strong className="dark:text-white text-primary">
                <Link to={`/users/${msg.user.id}/messages`}>@{username}</Link>
              </strong>
            </div>
          )}

          <div className="text-xs text-gray-500 mt-1">Delivered</div>
        </div>
      </div>
      {editable && (
        <div className="flex gap-4 justify-end">
          <span title="Edit" className="clickable">
            <SquarePen
              className="dark:stroke-white clickable"
              onClick={() => setEdit(true)}
            />
          </span>
          <span title="Delete" className="clickable">
            <Trash
              className="dark:stroke-white clickable"
              onClick={messageDelete}
            />
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
