export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
  }
  
  export interface ChatSession {
    id: number;
    title: string;
    messages: Message[];
  }
  
  export interface User {
    id: number;
    email: string;
    username: string;
  }