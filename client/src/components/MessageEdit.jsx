'use client';
import { Button, Label, TextInput, Textarea, Checkbox } from 'flowbite-react';
import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';
const MessageEdit = ({ onCancelSave, msg }) => {
  const [title, setName] = useState(msg.title);
  const [content, setText] = useState(msg.content);
  const [pinned, setPinned] = useState(msg.pinned || false);

  const { isAdmin } = useAuth();
  const handleUpdate = async (e) => {
    e.preventDefault();
    const hasChanges =
      title !== msg.title || content !== msg.content || pinned !== msg.pinned;

    if (hasChanges) {
      onCancelSave(msg.id, { ...msg, title, content, pinned });
    } else {
      onCancelSave(null);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="p-4 dark:bg-primaryDark m-auto w-full bg-white max-w-md rounded-lg shadow space-y-6"
    >
      <h3 className="text-xl font-medium text-gray-900 dark:text-white">
        Update Message
      </h3>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="name">Title</Label>
        </div>
        <TextInput
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="text">Your Message</Label>
        </div>
        <Textarea
          rows={4}
          id="text"
          value={content}
          onChange={(event) => setText(event.target.value)}
          required
          placeholder="A brief message to the TOP folks"
        />
      </div>
      {isAdmin && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="pinned"
            checked={pinned}
            className="text-primary"
            onChange={(e) => setPinned(e.target.checked)}
          />
          <Label htmlFor="pinned">Pinned</Label>
        </div>
      )}

      <div className="w-full  flex gap-4 justify-end">
        <button
          onClick={onCancelSave}
          type="button"
          className="px-4 py-2 rounded  bg-gray-200 dark:text-white dark:bg-gray-700"
        >
          Cancel
        </button>
        <Button type="submit" className="btn-primary flex gap-4">
          Save
          <SendHorizontal />
        </Button>
      </div>
    </form>
  );
};

export default MessageEdit;
