// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import LotteryWheel from './components/LotteryWheel';
import WinnerCard from './components/WinnerCard';
import ParticipantsList from './components/ParticipantsList';
import WinnerModal from './components/WinnerModal';
import { api, Participant, Winner } from '@/lib/api';

export default function LotteryPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [currentWinner, setCurrentWinner] = useState<{
    ft_code: string;
    full_name: string;
    mobile_phone?: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [participantsData, winnersData] = await Promise.all([
        api.getParticipants(),
        api.getWinners()
      ]);

      setParticipants(participantsData);
      setWinners(winnersData);
    } catch (error) {
      console.error('Error:', error);
      setError('Өгөгдөл татахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const segments = participants.map((p) => ({
    text: p.full_name,
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
  }));

  const handleSpinEnd = async (winnerIndex: number) => {
    const winner = participants[winnerIndex];

    setCurrentWinner({
      ft_code: winner.ft_code,
      full_name: winner.full_name,
      mobile_phone: winner.mobile_phone
    });

    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);

    try {
      const saveData = {
        participantId: winner.id,
        ftCode: winner.ft_code,
        fullName: winner.full_name,
        prizeName: 'Шагнал'
      };

      const result = await api.saveWinner(saveData);
      const winnersData = await api.getWinners();
      setWinners(winnersData);

      setParticipants(prev => prev.filter((_, index) => index !== winnerIndex));
    } catch (error) {
      console.error('❌ ERROR:', error);
      setError('Хожигч хадгалахад алдаа гарлаа');
      await fetchData();
    }
  };

  const handleCloseModal = () => {
    setCurrentWinner(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0C1B5C] to-[#0240E0] flex items-center justify-center relative overflow-hidden">
        <div className="text-center relative z-10">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-2xl font-semibold">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1B5C] to-[#0240E0] py-8 px-4 relative overflow-hidden">
      {/* ⭐ TWINKLING STARS - Гялтгах одууд */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        {[...Array(100)].map((_, i) => {
          const size = Math.random() * 3 + 1; // 1-4px
          const delay = Math.random() * 5;
          const duration = Math.random() * 3 + 2; // 2-5s
          
          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-white star-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                boxShadow: `0 0 ${size * 2}px ${size / 2}px rgba(255, 255, 255, 0.8)`,
              }}
            />
          );
        })}
      </div>

      {/* ❄️ SNOWFLAKES */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={`snowflake-${i}`}
            className="absolute text-white animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              fontSize: `${Math.random() * 20 + 15}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      {/* 🎊 Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute celebration-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
                backgroundColor: ['#FFD700', '#FF1493', '#00CED1', '#FF4500', '#32CD32', '#FF69B4'][i % 6]
              }}
            />
          ))}
        </div>
      )}

      <WinnerModal winner={currentWinner} onClose={handleCloseModal} />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            {/* ✨ GRADIENT ANIMATED TITLE ✨ */}
            <h1 className="text-7xl font-black mb-4 drop-shadow-2xl christmas-gradient-title">
              🎄 ШИНЭ ЖИЛИЙН АЗТАН ШАЛГАРУУЛАХ 🎁
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-white/90 mt-6">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl px-6 py-3 border-2 border-white/30 shadow-2xl animate-badge-float">
              <p className="text-sm font-medium mb-1">🎅 Нийт оролцогчид</p>
              <p className="text-3xl font-black text-yellow-300 animate-pulse">{participants.length}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl px-6 py-3 border-2 border-white/30 shadow-2xl animate-badge-float-delay">
              <p className="text-sm font-medium mb-1">🏆 Азтангууд</p>
              <p className="text-3xl font-black text-green-300 animate-pulse">{winners.length}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-500/90 backdrop-blur-lg border-2 border-red-300 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-white font-semibold">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT - WHEEL & PARTICIPANTS */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wheel */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-4 border-white/30">
              <LotteryWheel
                segments={segments}
                onSpinEnd={handleSpinEnd}
                disabled={loading}
              />
            </div>

            {/* Participants */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border-4 border-white/30">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Үлдсэн оролцогчид 🎊
              </h3>
              <ParticipantsList participants={participants} />
            </div>
          </div>

          {/* RIGHT - WINNERS */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sticky top-8 border-4 border-yellow-400/50">
              <div className="flex items-center justify-center gap-3 mb-6">
                <svg className="w-10 h-10 text-yellow-500 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <h2 className="text-3xl font-black text-gray-800">
                  АЗТАНГУУД 🏆
                </h2>
              </div>

              {winners.length > 0 ? (
                <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
                  {winners.map((winner, index) => (
                    <WinnerCard key={winner.id} winner={winner} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-bounce">🎁</div>
                  <p className="text-gray-500 font-medium text-lg">
                    Одоогоор азтан байхгүй байна
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ⭐ TWINKLING STARS - Гялтгах одууд */
        @keyframes star-twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .star-twinkle {
          animation: star-twinkle ease-in-out infinite;
        }

        /* ❄️ SNOWFALL ANIMATION */
        @keyframes snowfall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(100px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .animate-snowfall {
          animation: snowfall linear infinite;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
        }

        /* 🌈 GRADIENT ANIMATED TITLE */
        .christmas-gradient-title {
          background: linear-gradient(
            90deg,
            #ef4444,
            #f59e0b,
            #eab308,
            #22c55e,
            #3b82f6,
            #8b5cf6,
            #ec4899,
            #ef4444
          );
          background-size: 400% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 5s linear infinite;
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 400% 50%;
          }
        }

        /* 🎊 CELEBRATION */
        @keyframes celebration-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .celebration-particle {
          animation: celebration-fall linear forwards;
          border-radius: 50%;
        }

        /* 🎨 BADGE ANIMATIONS */
        @keyframes badge-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-badge-float {
          animation: badge-float 3s ease-in-out infinite;
        }
        
        .animate-badge-float-delay {
          animation: badge-float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        /* 📜 SCROLLBAR */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f3f4f6, #e5e7eb);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #0ea5e9);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #0284c7);
        }
      `}</style>
    </div>
  );
}