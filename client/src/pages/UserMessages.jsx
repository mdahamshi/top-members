import MessageList from '../components/MessageList';
import { useCrud } from '@sarawebs/sb-hooks';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/urls';
import { useEffect } from 'react';
import LoadingOverlay from '../components/LoadingOverly';
import NotAuth from './NotAuth';
import { LockIcon } from 'lucide-react';
export default function UserMessages() {
  const { id } = useParams();
  const {
    data: messages,
    load: getMessages,
    update: updateMessage,
    remove: removeMessage,
    loading,
  } = useCrud(`${api.usersMessages(id)}`);

  const { user, isMember, isAdmin, isAuth } = useAuth();
  useEffect(() => {
    if (!loading) getMessages();
  }, [id, isMember]);
  if (loading) return <LoadingOverlay />;
  if (!isAuth)
    return (
      <NotAuth
        msg="You are not logged in on this site !"
        link={{ text: 'Login', id: 'login' }}
      />
    );
  if (!isMember && !isAdmin)
    return (
      <NotAuth msg="You are not member!" link={{ text: 'Join', id: 'join' }} />
    );
  if (!messages || messages.length === 0)
    return (
      <NotAuth msg="No messages found !" link={{ text: 'Go Home', id: '' }} />
    );
  const messageUser = messages[0]?.user;
  return (
    <>
      <h1 className="text-4xl text-center font-bold mb-4 text-primary">
        Messages By: {`${messageUser?.fname}  ${messageUser?.lname}`}{' '}
        {messageUser?.role == 'admin' && (
          <div className="flex justify-center items-center gap-2">
            {' '}
            (Admin <Lock size={33} strokeWidth={4} />)
          </div>
        )}
      </h1>
      <MessageList
        onMessageUpdate={(id, data) => updateMessage(id, data, api.messages)}
        removeMessage={(id) => removeMessage(id, api.messages)}
        messages={messages}
      />
    </>
  );
}
