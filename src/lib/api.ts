import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
// Response types
interface AuthResponse {
  jwt: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

interface ChatSession {
  id: number;
  title: string;
  user: number;
}

interface Message {
  id: number;
  content: string;
  sender: string;
  session: number;
}

// Error handling wrapper
interface ErrorResponse {
  message: string;
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const errorMessage = axiosError.response?.data?.message || axiosError.message;
    toast.error(errorMessage);
    throw {
      status: axiosError.response?.status,
      message: errorMessage,
    };
  }
  toast.error('An unexpected error occurred');
  throw error;
};

export const api = {
  auth: {
    login: async (identifier: string, password: string): Promise<AuthResponse> => {
      try {
        const response = await axios.post<AuthResponse>(`${API_BASE}/auth/local`, {
          identifier,
          password,
        });
        toast.success('Logged in successfully!');
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },

    register: async (username :string ,email: string, password: string): Promise<AuthResponse> => {
      try {
        const response = await axios.post<AuthResponse>(`${API_BASE}/auth/local/register`, {
          username,
          email,
          password,
        });
        toast.success('Registration successful!');
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  },
  user:{
    getAllUser : async (jwt: string): Promise<any> => {
      try {
        const response = await axios.get(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log(response,"11")
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    }
  },
  sessions: {
    create: async (title: string, jwt: string): Promise<ChatSession> => {
      try {
        const response = await axios.post<ChatSession>(
          `${API_BASE}/chat-sessions`,
          { title },
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        toast.success('Chat session created!');
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
    list: async (userId: string) => {
      const response = await axios.get(`/sessions?userId=${userId}`)
      return response.data
    },
    getAll: async (jwt: string): Promise<ChatSession[]> => {
      try {
        const response = await axios.get<ChatSession[]>(
          `${API_BASE}/chat-sessions`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  },

  messages: {
    getBySession: async (sessionId: number, jwt: string): Promise<Message[]> => {
      try {
        const response = await axios.get<Message[]>(
          `${API_BASE}/messages?session=${sessionId}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        return response.data;
      } catch (error) {
        throw handleApiError(error);
      }
    },
  },
};