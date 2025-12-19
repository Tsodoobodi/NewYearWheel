// app/components/WinnerCard.tsx
import { Winner } from '@/lib/api';

interface WinnerCardProps {
  winner: Winner;
  index: number;
}

export default function WinnerCard({ winner, index }: WinnerCardProps) {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-lg truncate mb-1">
            {winner.full_name}
          </h3>
          {winner.mobile_phone && (
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p className="text-sm text-gray-600 font-medium">
                {winner.mobile_phone}
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500 font-mono">
            {winner.ft_code}
          </p>
        </div>
      </div>
    </div>
  );
}