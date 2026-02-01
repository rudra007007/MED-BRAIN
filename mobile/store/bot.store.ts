import { create } from 'zustand';

interface BotState {
  botMessage: string;
  setBotMessage: (message: string) => void;
  sendBotMessage: () => void;
}

export const useBotStore = create<BotState>((set, get) => ({
  botMessage: '',
  setBotMessage: (message: string) => {
    set({ botMessage: message });
  },
  sendBotMessage: () => {
    const { botMessage } = get();
    if (!botMessage.trim()) {
      return;
    }

    // Placeholder for future API integration
    // eslint-disable-next-line no-console
    console.log('Bot message sent:', botMessage);

    set({ botMessage: '' });
  },
}));
