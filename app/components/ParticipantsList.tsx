// app/components/ParticipantsList.tsx
import { Participant } from "@/lib/api";

interface ParticipantsListProps {
  participants: Participant[];
}

export default function ParticipantsList({
  participants,
}: ParticipantsListProps) {
  if (participants.length === 0) {
    return (
      <div className="text-center py-4">
        <svg
          className="mx-auto h-16 w-16 text-gray-300 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <p className="text-gray-500 font-medium">Оролцогч байхгүй</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
      {participants.map((p, index) => (
        <div
          key={p.id}
          className="flex items-center justify-between py-3 px-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            <span className="font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
              {p.full_name}
            </span>
          </div>
          <span className="text-sm text-gray-500 font-mono">{p.ft_code}</span>
        </div>
      ))}
    </div>
  );
}
