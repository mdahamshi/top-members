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
import LoadingOverlay from '../components/LoadingOverly';
export default function Home() {
  const {
    data: messages,
    load: getMessages,
    update: updateMessage,
    remove: removeMessage,
    loading,
  } = useCrud(api.messages);
  const { isAuth, isMember, user } = useAuth();

  const { appName } = useApp();

  useEffect(() => {
    getMessages();
  }, [isAuth, isMember, user]);
  return (
    <div className="home dark:text-white">
      <h1 className="text-4xl text-center font-bold mb-8 ">
        Welcome to the {appName} {isAuth && `, ${user.fname} `}
        <Smile size={44} className="align-bottom inline" />
      </h1>
      <MessageList
        onMessageUpdate={updateMessage}
        removeMessage={removeMessage}
        messages={messages}
      />

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
