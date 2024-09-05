import OpenAI from 'openai';
import { AssistantResponse } from 'ai';

/* eslint-disable-next-line */
const openai = new OpenAI();

export async function POST(req: Request) {
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json() as {
    threadId: string | null;
    message: string;
  };

  /* eslint-disable-next-line */
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  /* eslint-disable-next-line */
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: input.message,
  });

  return AssistantResponse(
    /* eslint-disable-next-line */
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      /* eslint-disable-next-line */
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error('ASSISTANT_ID environment is not set');
          })(),
      });

      await forwardStream(runStream);
    },
  );
}