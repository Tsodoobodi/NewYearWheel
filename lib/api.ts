// lib/api.ts
// ❌ Энийг УСТГА
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// ✅ Энийг АШИГЛА
const API_URL = '/api'; // Relative URL - Same server!

export interface Participant {
  id: number;
  ft_code: string;
  full_name: string;
  mobile_phone?: string;
}

export interface Winner {
  id: number;
  ft_code: string;
  full_name: string;
  prize_name: string;
  won_at: string;
  mobile_phone?: string;
}

export interface SaveWinnerResponse {
  success: boolean;
  message: string;
}

export const api = {
  getParticipants: async (): Promise<Participant[]> => {
    const response = await fetch(`${API_URL}/lottery/participants`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch participants');
    return response.json();
  },

  getWinners: async (): Promise<Winner[]> => {
    const response = await fetch(`${API_URL}/lottery/winners`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch winners');
    return response.json();
  },

  saveWinner: async (data: {
    participantId: number;
    ftCode: string;
    fullName: string;
    prizeName: string;
  }): Promise<SaveWinnerResponse> => {
    const response = await fetch(`${API_URL}/lottery/save-winner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to save winner');
    return response.json();
  }
};