import React from 'react';
import { ConfessionData, FontStyle } from '../types';
import { Heart } from 'lucide-react';

interface LivePreviewProps {
  data: ConfessionData;
}

const LivePreview: React.FC<LivePreviewProps> = ({ data }) => {
  const isTypewriter = data.fontStyle === FontStyle.TYPEWRITER;
  
  // Dynamic styles for the card based on theme
  const cardBg = data.isDarkTheme 
    ? 'bg-rose-100 border-rose-300 shadow-[0_20px_60px_rgba(244,63,94,0.3)]' 
    : 'bg-white border-rose-200 shadow-[0_20px_60px_rgba(251,113,133,0.15)]';
    
  const textColor = data.isDarkTheme ? 'text-rose-900' : 'text-rose-800';
  const borderColor = data.isDarkTheme ? 'border-rose-400' : 'border-rose-200';

  return (
    <div className="flex-grow h-full flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
         <div className="w-[800px] h-[800px] bg-pink-300/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Floating Hearts Animation (CSS only for position, standard styling) */}
      <div className="absolute top-10 right-20 text-rose-200/50 animate-pulse"><Heart size={48} fill="currentColor" /></div>
      <div className="absolute bottom-20 left-20 text-rose-200/50 animate-pulse delay-700"><Heart size={64} fill="currentColor" /></div>

      {/* The Card */}
      <div 
        className={`relative aspect-[4/5] h-full max-h-[800px] w-auto max-w-full rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-500 ease-in-out border-4 ${cardBg}`}
      >
        {/* Inner Border Frame (Double Line) */}
        <div className={`absolute inset-4 border-2 ${borderColor} rounded-lg pointer-events-none opacity-60`}></div>
        <div className={`absolute inset-6 border ${borderColor} rounded pointer-events-none opacity-40`}></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-12 px-6">
          
          {/* Top Heart Icon */}
          <div className="mb-4">
             <Heart className="w-6 h-6 text-rose-400" fill="currentColor" />
          </div>

          {/* Spacer for vertical centering */}
          <div className="flex-grow flex items-center justify-center w-full">
            <p 
              className={`text-center whitespace-pre-wrap leading-relaxed transition-all duration-300 ${textColor} ${
                isTypewriter 
                  ? 'font-typewriter text-lg md:text-xl lg:text-2xl tracking-wide' 
                  : 'font-handwriting text-3xl md:text-4xl lg:text-5xl'
              }`}
            >
              {data.text || "Write your heart out..."}
            </p>
          </div>

          {/* Signature */}
          <div className="mt-8 text-center">
            <p className={`font-serif italic text-rose-500 text-lg md:text-xl transition-opacity duration-500 ${data.sender ? 'opacity-100' : 'opacity-0'}`}>
              xoxo, {data.sender}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
