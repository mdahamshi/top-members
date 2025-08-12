'use client';

import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ThemeProvider,
  createTheme,
  TextInput,
  Textarea,
} from 'flowbite-react';
import { useState } from 'react';
import { SendHorizontal, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { useCrud } from '@sarawebs/sb-hooks'
import api from '../api/urls';
const theme = createTheme({
  content: {
    base: 'p-4 flex flex-col justify-center',
  },
});

// Composable Modal component for sending messages
function MessageModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  function handleClose() {
    setTitle('');
    setText('');
    onClose();
  }

  async function handleSend(e) {
    e.preventDefault();
    await onSubmit({ title, content: text });
    setTitle('');
    setText('');
    onClose();
  }

  return (
    <ThemeProvider theme={theme}>
      <Modal
        position="center"
        content="inner"
        show={open}
        theme={theme}
        size="md"
        onClose={handleClose}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <form className="space-y-6" onSubmit={handleSend}>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Send New Message
            </h3>
            <div>
              <Label htmlFor="title">Title</Label>
              <TextInput
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="text">Your Message</Label>
              <Textarea
                rows={4}
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                placeholder="A brief message to the TOP folks"
              />
            </div>

            <div className="w-full flex justify-end">
              <Button type="submit" className="btn-primary flex gap-4">
                Send
                <SendHorizontal />
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </ThemeProvider>
  );
}

// Wrapper component to manage modal and useCrud logic + auth check for showing button
export default function MessageSender() {
  const { isAuth } = useAuth();
  const { create: addMessage } = useCrud(api.messages); // assuming useCrud has create method for 'messages'
  const [modalOpen, setModalOpen] = useState(false);

  async function handleSubmit(data) {
    try {
      await addMessage(data);
    } catch (err) {
      // handle error, maybe toast or alert
      console.error('Error sending message:', err);
    }
  }

  if (!isAuth) return null;

  return (
    <>
      <Button
        className="fixed bottom-4 p-0 right-4 z-50 shadow-lg bg-primary text-white hover:bg-primary/70 w-14 h-14 rounded-full flex items-center justify-center"
        onClick={() => {
          if (window.location.pathname !== '/new') {
            window.history.replaceState(null, '', '/new');
          }
          setModalOpen(true);
        }}
      >
        <MessageCircle size={24} strokeWidth={3} />
      </Button>

      <MessageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
