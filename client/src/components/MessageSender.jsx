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
  Alert,
  Textarea,
} from 'flowbite-react';
import { useState } from 'react';
import { SendHorizontal, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrud } from '@sarawebs/sb-hooks';
import api from '../api/urls';
const theme = createTheme({
  content: {
    base: 'p-4 flex flex-col justify-center',
  },
});

// Composable Modal component for sending messages
function MessageModal({ error, open, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [message, setMsg] = useState('');
  function handleClose() {
    setTitle('');
    setText('');
    setMsg('');
    onClose();
  }

  async function handleSend(e) {
    e.preventDefault();
    await onSubmit({ title, content: text });
    setTitle('');
    setText('');
    setMsg('Message Sent !');
    setTimeout(() => handleClose(), 1500);
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
            {message && <Alert color="success">{message}</Alert>}
            {error && <Alert color="failure">{error}</Alert>}

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
              <Button
                type="submit"
                className="btn-primary flex gap-4"
                disabled={message}
              >
                {message ? 'Sending...' : 'Send'}
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
  const { create: addMessage, error } = useCrud(api.messages); // assuming useCrud has create method for 'messages'
  const [modalOpen, setModalOpen] = useState(false);

  async function handleSubmit(data) {
    try {
      const res = await addMessage(data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }

  if (!isAuth) return null;

  return (
    <>
      <button
        className="clickable bg-primary text-white fixed bottom-4 p-0 right-4 z-50 shadow-lg w-14 h-14 rounded-full flex items-center justify-center "
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <MessageCircle size={24} strokeWidth={3} />
      </button>

      <MessageModal
        open={modalOpen}
        error={error}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
