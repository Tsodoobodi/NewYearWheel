// app/components/WinnerModal.tsx
"use client";

import { useEffect, useMemo } from "react";

interface WinnerModalProps {
  winner: {
    ft_code: string;
    full_name: string;
    mobile_phone?: string;
  } | null;
  onClose: () => void;
}

export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
  // ✅ Confetti positions-ийг useMemo ашиглаж тогтмол болгох
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      width: Math.random() * 10 + 5,
      height: Math.random() * 10 + 5,
      animationDelay: Math.random() * 0.5,
      animationDuration: Math.random() * 2 + 2,
      backgroundColor: ["#FFD700", "#FF1493", "#00FF00", "#00CED1", "#FF4500"][
        i % 5
      ],
    }));
  }, []); // Empty dependency - зөвхөн 1 удаа үүснэ

  useEffect(() => {
    if (!winner) return;

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [winner, onClose]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full animate-scale-bounce">
        {/* Confetti Background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {confettiParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute confetti-particle"
              style={{
                left: `${particle.left}%`,
                top: "-20px",
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                animationDelay: `${particle.animationDelay}s`,
                animationDuration: `${particle.animationDuration}s`,
                backgroundColor: particle.backgroundColor,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Trophy Icon */}
          <div className="mb-6 relative">
            <div className="mx-auto w-28 h-28 bg-white rounded-full flex items-center justify-center animate-bounce-once shadow-2xl">
              <svg
                className="w-16 h-16 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          </div>

          {/* Title */}
          <h2 className="text-5xl font-black text-white mb-2 animate-fade-in-up drop-shadow-2xl">
            БАЯР ХҮРГЭЕ! 🎊
          </h2>
          <p className="text-2xl text-white/90 font-bold mb-8 animate-fade-in-up delay-100">
            Та азтан боллоо!
          </p>

          {/* Winner Info */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in-up delay-200">
            {/* Name */}
            <div className="pb-4 border-b-2 border-yellow-200">
              <p className="text-sm text-gray-500 font-medium mb-1">Азтан</p>
              <p className="text-3xl font-black text-gray-800 break-words">
                {winner.full_name}
              </p>
            </div>

            {/* Phone */}
            {winner.mobile_phone && (
              <div className="pb-4 border-b-2 border-yellow-200">
                <p className="text-sm text-gray-500 font-medium mb-1">Утас</p>
                <p className="text-2xl font-bold text-gray-700">
                  {winner.mobile_phone}
                </p>
              </div>
            )}

            {/* Code */}
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">FT Код</p>
              <p className="text-2xl font-bold text-indigo-600 font-mono">
                {winner.ft_code}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-6 px-8 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Хаах
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-bounce {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-once {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes confetti-drop {
          to {
            transform: translateY(120vh) rotate(720deg);
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-scale-bounce {
          animation: scale-bounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-bounce-once {
          animation: bounce-once 1s ease-in-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }

        .confetti-particle {
          animation: confetti-drop linear forwards;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
