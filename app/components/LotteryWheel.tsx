// app/components/LotteryWheel.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Segment {
  text: string;
  color: string;
}

interface LotteryWheelProps {
  segments: Segment[];
  onSpinEnd: (winnerIndex: number) => void;
  disabled?: boolean;
}

const COLORS = [
  "#EF4444", "#10B981", "#3B82F6", "#F59E0B",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316",
  "#06B6D4", "#84CC16", "#6366F1", "#D946EF",
];

export default function LotteryWheel({
  segments,
  onSpinEnd,
  disabled = false,
}: LotteryWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer glow
    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius - 50,
      centerX, centerY, radius + 10
    );
    gradient.addColorStop(0, "rgba(234, 179, 8, 0)");
    gradient.addColorStop(0.8, "rgba(234, 179, 8, 0.3)");
    gradient.addColorStop(1, "rgba(234, 179, 8, 0.6)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (segments.length === 0) {
      // Draw empty wheel
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      
      const emptyGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      emptyGradient.addColorStop(0, "#f3f4f6");
      emptyGradient.addColorStop(1, "#d1d5db");
      ctx.fillStyle = emptyGradient;
      ctx.fill();
      
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 5;
      ctx.stroke();

      ctx.fillStyle = "#6b7280";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Оролцогч байхгүй", centerX, centerY);
      return;
    }

    const anglePerSegment = (2 * Math.PI) / segments.length;

    // Draw wheel segments
    segments.forEach((segment, index) => {
      const startAngle = rotation + index * anglePerSegment;
      const endAngle = startAngle + anglePerSegment;

      // Draw segment with gradient
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      
      const segmentGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.3,
        centerX, centerY, radius
      );
      const baseColor = COLORS[index % COLORS.length];
      segmentGradient.addColorStop(0, baseColor);
      segmentGradient.addColorStop(1, baseColor + "CC");
      ctx.fillStyle = segmentGradient;
      ctx.fill();

      // Border with gold accent
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Inner border
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerSegment / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "white";
      ctx.font = "bold 18px Arial";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const text = segment.text;
      const maxWidth = radius - 40;
      const textWidth = ctx.measureText(text).width;

      if (textWidth > maxWidth) {
        const words = text.split(" ");
        if (words.length > 1) {
          ctx.fillText(words[0], radius - 25, -8);
          ctx.fillText(words.slice(1).join(" "), radius - 25, 12);
        } else {
          ctx.fillText(text.substring(0, 10) + "...", radius - 25, 2);
        }
      } else {
        ctx.fillText(text, radius - 25, 2);
      }

      ctx.restore();

      // Decorative dots between segments
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle);
      ctx.beginPath();
      ctx.arc(radius - 15, 0, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    });

    // Outer ring decoration
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center circle with gradient
    const centerGradient = ctx.createRadialGradient(
      centerX, centerY - 10, 0,
      centerX, centerY, 70
    );
    centerGradient.addColorStop(0, "#fbbf24");
    centerGradient.addColorStop(0.5, "#f59e0b");
    centerGradient.addColorStop(1, "#d97706");
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 70, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    
    // Gold border
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 6;
    ctx.stroke();
    
    // Dark outer border
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 65, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Company name text in center
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 3;
    ctx.fillText("BODI", centerX, centerY - 10);
    ctx.fillText("GROUP", centerX, centerY + 10);
    ctx.restore();

    // ✅ ENHANCED POINTER - Нарийн гоё sum
    ctx.save();
    
    // Shadow for 3D effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;

    // Main pointer body - sleek arrow shape
    const pointerGradient = ctx.createLinearGradient(
      centerX - 25, 10,
      centerX + 25, 10
    );
    pointerGradient.addColorStop(0, "#b91c1c");
    pointerGradient.addColorStop(0.5, "#ef4444");
    pointerGradient.addColorStop(1, "#b91c1c");
    
    ctx.beginPath();
    // Top wide part
    ctx.moveTo(centerX - 25, 8);
    ctx.lineTo(centerX + 25, 8);
    // Right side taper
    ctx.lineTo(centerX + 18, 25);
    ctx.lineTo(centerX + 12, 45);
    // Sharp tip
    ctx.lineTo(centerX, 75);
    // Left side taper
    ctx.lineTo(centerX - 12, 45);
    ctx.lineTo(centerX - 18, 25);
    ctx.closePath();
    ctx.fillStyle = pointerGradient;
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Gold border for pointer
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Dark outline
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Highlight for 3D effect - left side
    ctx.beginPath();
    ctx.moveTo(centerX - 20, 12);
    ctx.lineTo(centerX - 5, 18);
    ctx.lineTo(centerX - 8, 35);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();

    // Top decorative circle
    ctx.beginPath();
    ctx.arc(centerX, 15, 10, 0, 2 * Math.PI);
    const topCircleGradient = ctx.createRadialGradient(
      centerX, 15, 0,
      centerX, 15, 10
    );
    topCircleGradient.addColorStop(0, "#fbbf24");
    topCircleGradient.addColorStop(1, "#d97706");
    ctx.fillStyle = topCircleGradient;
    ctx.fill();
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Small star decoration at tip
    ctx.save();
    ctx.translate(centerX, 15);
    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", 0, 0);
    ctx.restore();

    ctx.restore();

  }, [segments, rotation]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // ✅ CRITICAL FIX: Calculate winner based on final pointer position
  const calculateWinner = (finalRotation: number): number => {
    const anglePerSegment = (2 * Math.PI) / segments.length;
    
    // Pointer is at top (270° or 3π/2 radians from right, or -π/2)
    const pointerAngle = (3 * Math.PI / 2) % (2 * Math.PI);
    
    // Normalize rotation to 0-2π range
    const normalizedRotation = ((finalRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    
    // Calculate relative angle from pointer to segments
    // We need to find which segment is under the pointer
    const relativeAngle = ((pointerAngle - normalizedRotation) + 2 * Math.PI) % (2 * Math.PI);
    
    // Calculate winner index
    const winnerIndex = Math.floor(relativeAngle / anglePerSegment) % segments.length;
    
    console.log('🎯 Winner Calculation:', {
      pointerAngle: (pointerAngle * 180 / Math.PI).toFixed(2) + '°',
      normalizedRotation: (normalizedRotation * 180 / Math.PI).toFixed(2) + '°',
      relativeAngle: (relativeAngle * 180 / Math.PI).toFixed(2) + '°',
      anglePerSegment: (anglePerSegment * 180 / Math.PI).toFixed(2) + '°',
      winnerIndex,
      winnerName: segments[winnerIndex]?.text
    });
    
    return winnerIndex;
  };

  const spinWheel = () => {
    if (isSpinning || segments.length === 0 || disabled) return;

    setIsSpinning(true);

    const spinDuration = 8000; // 8 seconds
    const minSpins = 6;
    const maxSpins = 10;
    const spins = Math.random() * (maxSpins - minSpins) + minSpins;
    
    // Just add random rotation for spinning effect
    const totalRotation = spins * 2 * Math.PI;
    const randomOffset = Math.random() * 2 * Math.PI;
    const finalRotation = totalRotation + randomOffset;

    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      // Smooth easing - cubic ease out
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      const currentRotation = startRotation + finalRotation * easeProgress;
      setRotation(currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        
        // ✅ Calculate actual winner based on final position
        const actualWinner = calculateWinner(currentRotation);
        
        // Normalize rotation for next spin
        setRotation(currentRotation % (2 * Math.PI));
        
        // Return actual winner
        onSpinEnd(actualWinner);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={550}
          height={550}
          className="max-w-full h-auto drop-shadow-2xl"
        />

        {/* Christmas decorations around wheel */}
        <div className="absolute -top-4 -left-4 text-4xl animate-bounce">🎄</div>
        <div className="absolute -top-4 -right-4 text-4xl animate-bounce delay-300">⭐</div>
        <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce delay-500">🎁</div>
        <div className="absolute -bottom-4 -right-4 text-4xl animate-bounce delay-700">❄️</div>

        {/* Glow effects */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || segments.length === 0 || disabled}
        className={`relative px-16 py-6 rounded-2xl text-3xl font-black shadow-2xl transform transition-all duration-300 overflow-hidden ${
          isSpinning || segments.length === 0 || disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 hover:scale-110 animate-pulse"
        } text-white border-4 border-white shadow-glow-button`}
      >
        {/* Button glow effect */}
        {!isSpinning && segments.length > 0 && !disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-50 blur-xl"></div>
        )}

        <span className="relative z-10 flex items-center gap-3">
          {isSpinning ? (
            <>
              <span className="animate-spin text-4xl">🎰</span>
              <span>Эргэж байна...</span>
            </>
          ) : segments.length === 0 ? (
            <>
              <span>⚠️</span>
              <span>Оролцогч байхгүй</span>
            </>
          ) : (
            <>
              <span className="animate-bounce">🎲</span>
              <span>ЭХЛҮҮЛЭХ</span>
              <span className="animate-bounce delay-300">🎊</span>
            </>
          )}
        </span>
      </button>

      <style jsx>{`
        .shadow-glow-button {
          box-shadow: 0 0 40px rgba(251, 191, 36, 0.6),
                      0 0 80px rgba(249, 115, 22, 0.4),
                      0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}