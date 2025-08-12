import MessageList from '../components/MessageList';
import { useCrud } from '@sarawebs/sb-hooks';
import { useParams } from 'react-router-dom';
import api from '../api/urls';
import { useEffect } from 'react';
export default function UserMessages() {
  const { id } = useParams();
  const {
    remove: removeMessage,
    data: messages,
    loading,
    load: getMessages,
    create: addMessage,
  } = useCrud(`${api.usersMessages(id)}`);

  useEffect(() => {
    if (!loading) getMessages();
  }, [id]);
  if(loading)
    return <>Loading...</>
  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-primary">Messages By: @{messages[0]?.user.username}</h1>
      <MessageList messages={messages} />
    </>
  );
}
