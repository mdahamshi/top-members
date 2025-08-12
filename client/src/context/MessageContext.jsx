import React, { createContext, useContext, useEffect, useState } from 'react';
import * as messagesApi from '../api/messages';

const MessageContext = createContext();

export const useMessages = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await messagesApi.fetchMessages();

      const messagesWithText = data.map((msg) => ({
        ...msg,
        text: msg.content,
      }));

      setMessages(messagesWithText);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (messageData) => {
    try {
      const payload = { ...messageData, content: messageData.text };
      delete payload.text;
      const res = await messagesApi.createMessage(payload);
      setMessages((prev) => [{ ...res.data, text: res.data.content }, ...prev]);
    } catch (err) {
      console.error('Failed to create message', err);
    }
  };

  const removeMessage = async (id) => {
    try {
      await messagesApi.deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  const editMessage = async (id, updatedData) => {
    try {
      // Map 'text' to 'content' if present
      const payload = { ...updatedData };
      if (payload.text !== undefined) {
        payload.content = payload.text;
        delete payload.text;
      }
      const res = await messagesApi.updateMessage(id, payload);
      // Update frontend message with updatedData (keep text unchanged in UI)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, ...updatedData } : msg))
      );
    } catch (err) {
      console.error('Failed to update message', err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        reload: loadMessages,
        addMessage,
        removeMessage,
        editMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
