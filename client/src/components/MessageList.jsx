import MessageBubble from './MessageBubble';
import { getRandomColor } from '@sarawebs/sb-utils';

export default function MessageList({
  messages,
  removeMessage,
  onMessageUpdate,
}) {
  return (
    <section className="msg-list">
      <div className="flex flex-col  gap-4 mx-auto max-w-160">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            removeMessage={removeMessage}
            msg={msg}
            avatarColor={getRandomColor()}
            onSave={onMessageUpdate}
          />
        ))}
      </div>

      <ul></ul>
    </section>
  );
}
