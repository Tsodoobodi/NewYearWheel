// lib/api.ts
const API_URL = '/api';

// ✅ camelCase interfaces - API response-той тохирно
export interface Participant {
  id: number;
  ftCode: string;        // ✅ ft_code -> ftCode
  fullName: string;      // ✅ full_name -> fullName
  mobilePhone?: string;  // ✅ mobile_phone -> mobilePhone
}

export interface Winner {
  id: number;
  ftCode: string;        // ✅ ft_code -> ftCode
  fullName: string;      // ✅ full_name -> fullName
  prizeName: string;     // ✅ prize_name -> prizeName
  wonAt: string;         // ✅ won_at -> wonAt
  mobilePhone?: string;  // ✅ mobile_phone -> mobilePhone
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