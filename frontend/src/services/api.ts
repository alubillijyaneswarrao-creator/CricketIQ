import axios from 'axios';
import { Player, Match, SavedChat, SearchResult, IngestedDocument } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Players
  getPlayers: async (): Promise<Player[]> => {
    const res = await client.get('/api/players/');
    return res.data;
  },
  getPlayerByName: async (name: string): Promise<Player> => {
    const res = await client.get(`/api/players/search?name=${encodeURIComponent(name)}`);
    return res.data;
  },
  comparePlayers: async (p1: string, p2: string) => {
    const res = await client.get(`/api/players/compare/stats?player1=${encodeURIComponent(p1)}&player2=${encodeURIComponent(p2)}`);
    return res.data;
  },

  // Matches
  getMatches: async (): Promise<Match[]> => {
    const res = await client.get('/api/matches/');
    return res.data;
  },
  getLiveMatches: async (): Promise<Match[]> => {
    const res = await client.get('/api/matches/live');
    return res.data;
  },
  getMatchById: async (id: number): Promise<Match> => {
    const res = await client.get(`/api/matches/${id}`);
    return res.data;
  },
  getMatchInsights: async (id: number) => {
    const res = await client.get(`/api/matches/${id}/insights`);
    return res.data;
  },

  // RAG Chat
  sendChatMessage: async (message: string, chatId?: string, documentOnly = false, generateVoice = false) => {
    const res = await client.post(`/api/chat/?generate_voice=${generateVoice}`, {
      message,
      chat_id: chatId,
      document_only: documentOnly,
    });
    return res.data;
  },
  getChatHistory: async (): Promise<SavedChat[]> => {
    const res = await client.get('/api/chat/history');
    return res.data;
  },
  toggleBookmark: async (chatId: string) => {
    const res = await client.put(`/api/chat/${chatId}/bookmark`);
    return res.data;
  },
  deleteChat: async (chatId: string) => {
    const res = await client.delete(`/api/chat/${chatId}`);
    return res.data;
  },

  // PDF Upload & RAG
  uploadPDF: async (file: File): Promise<IngestedDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  getUploadedDocuments: async (): Promise<IngestedDocument[]> => {
    const res = await client.get('/api/documents/');
    return res.data;
  },

  // Semantic Search
  semanticSearch: async (query: string, limit = 5): Promise<{ query: string; results: SearchResult[] }> => {
    const res = await client.get(`/api/search/?query=${encodeURIComponent(query)}&limit=${limit}`);
    return res.data;
  },
};
export default api;
