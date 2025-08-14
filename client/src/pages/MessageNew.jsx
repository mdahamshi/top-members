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
  Checkbox,
  Textarea,
} from 'flowbite-react';

import { useState } from 'react';
import { SendHorizontal, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCrud } from '@sarawebs/sb-hooks';
import api from '../api/urls';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverly';

export default function MessageNew() {
  const { isAuth, isAdmin } = useAuth();
  const { create: addMessage, error, loading } = useCrud(api.messages); // assuming useCrud has create method for 'messages'
  const navigate = useNavigate();

  if (!isAuth) return null;
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [pinned, setPinned] = useState(false);
  const [message, setMsg] = useState('');
  function handleClose() {
    setTitle('');
    setText('');
    setMsg('');
    navigate('/');
  }

  async function handleSend(e) {
    e.preventDefault();
    const { data, error } = await addMessage({ title, content: text, pinned });
    if (!error) {
      setMsg('Message Sent !');
      setTimeout(() => handleClose(), 1500);
    }
  }
  if (loading) return <LoadingOverlay />;

  return (
    <form className=" card" onSubmit={handleSend}>
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
      {isAdmin && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="pinned"
            className="text-primary"
            checked={pinned}
            onChange={(e) => setPinned(e.target.checked)}
          />
          <Label htmlFor="pinned">Pinned</Label>
        </div>
      )}
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
  );
}
