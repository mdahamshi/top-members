import MessageList from '../components/MessageList';
import { useCrud } from '@sarawebs/sb-hooks';
import { Link } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/urls';
import { useEffect } from 'react';
export default function UserMessages() {
  const { id } = useParams();
  const {
    data: messages,
    load: getMessages,
    update: updateMessage,
    remove: removeMessage,
    loading,
  } = useCrud(`${api.usersMessages(id)}`);
  const {  user, isMember } = useAuth();
  console.log(messages)
  useEffect(() => {
    if (!loading) getMessages();
  }, [id, isMember]);
  if (loading) return <>Loading...</>;
  if(! isMember) return (
    <div className="text-primary flex flex-col items-center justify-center p-8 font-sans text-cente dark:text-white">
      <h1 className='text-4xl mb-4 font-bold'>Hey :)</h1>

      <p className="mb-4">
        You are not a member of our club !
      </p>

      <Link to="/join" className="text-white link-btn min-w-22">
        Join
      </Link>
    </div>
  );

  
  return (
    <>
      <h1 className="text-4xl text-center font-bold mb-4 text-primary">
        Messages By: {`${messages[0]?.user.fname}  ${messages[0]?.user.lname}`}
      </h1>
      <MessageList
        onMessageUpdate={updateMessage}
        removeMessage={removeMessage}
        messages={isMember ? messages.map((m) =>
          m?.user.id === user.id ? { ...m, editable: true } : m
        ) : messages}
      />
    </>
  );
}
