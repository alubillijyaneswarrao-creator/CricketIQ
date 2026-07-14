import { useState, useEffect } from 'react';
import api from '../services/api';
import { Player, Match, SavedChat } from '../types';

export function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getPlayers()
      .then(setPlayers)
      .catch(err => setError(err.message || 'Failed to load players'))
      .finally(() => setLoading(false));
  }, []);

  return { players, loading, error };
}

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getMatches()
      .then(setMatches)
      .catch(err => setError(err.message || 'Failed to load matches'))
      .finally(() => setLoading(false));
  }, []);

  return { matches, loading, error };
}

export function useLiveMatches() {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLive = () => {
      api.getLiveMatches()
        .then(setLiveMatches)
        .catch(err => setError(err.message || 'Failed to load live matches'))
        .finally(() => setLoading(false));
    };

    fetchLive();
    // Poll live matches every 10 seconds for simulated real-time updates
    const interval = setInterval(fetchLive, 10000);
    return () => clearInterval(interval);
  }, []);

  return { liveMatches, loading, error };
}

export function useChatHistory() {
  const [history, setHistory] = useState<SavedChat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    api.getChatHistory()
      .then(setHistory)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { history, loading, refreshHistory: fetchHistory };
}
