interface Message {
  role: "user" | "system" | "assistant";
  content: string;
}

export const transcriptToMessages = (transcript: string) => {
  const messages = transcript.split('\n\n').map(line => {
    const [role, content] = line.split(': ');
    return {
			role: role.toLowerCase() as 'user' | 'assistant',
			content: content.trim()
		};
  });
  return messages;
};

export const messagesToTranscript = (messages: Message[]) => {
  const transcript = messages
		.filter((msg: Message) => msg.role === 'user' || msg.role === 'assistant')
		.map((msg: Message) => `${msg.role.toUpperCase()}: ${msg.content}`)
		.join('\n\n');
  return transcript;
};
