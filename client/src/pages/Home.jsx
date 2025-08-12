import { useEffect, useState } from 'react';

import MessageBubble from '../components/MessageBubble';
import { useApp } from '../context/AppContext';
import { MessageCircle, Smile } from 'lucide-react';
import NewMessage from '../components/MessageSender';
import { useAuth } from '../context/AuthContext';
import { Button } from 'flowbite-react';
import { useCrud } from '@sarawebs/sb-hooks';
import MessageList from '../components/MessageList';
import api from '../api/urls';
export default function Home() {
  const {
    remove: removeMessage,
    data: messages,
    loading,
    load: getMessages,
    create: addMessage,
  } = useCrud(api.messages);
  const { isAuth, user, isMember } = useAuth();

  const { appName } = useApp();
  const [open, setModal] = useState(false);

  const handleModalClose = () => {
    window.history.replaceState(null, '', '/');
    setModal(false);
  };
  useEffect(() => {
    if (!loading) getMessages();
  }, []);
  const onMessageUpdate = ({ text, name, id }) => {
    setData((prev) =>
      prev.map((msg) => {
        if (msg.id == id)
          return {
            ...msg,
            text,
            name,
          };
        else return msg;
      })
    );
  };
  return (
    <div className="home">
      <h1 className="text-4xl font-bold mb-4 text-primary">
        Welcome to the {appName} {isAuth && user.fname} <Smile size={44} className='inline' />
      </h1>
      <MessageList messages={messages.map((m) => (m?.user.id === user.id ? {...m, editable: true} : m))} />

      <section className="mt-5 dark:text-white">
        <h2>
          Visit{' '}
          <a
            aria-label="Git Repo"
            href="https://github.com/mdahamshi/top-members"
          >
            Git Repo
          </a>{' '}
          for more information
        </h2>
      </section>

    </div>
  );
}
