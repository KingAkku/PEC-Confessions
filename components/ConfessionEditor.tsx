import React from 'react';
import { ConfessionData, FontStyle } from '../types';
import { Type, Feather, Heart, Sparkles, PenTool } from 'lucide-react';

interface ConfessionEditorProps {
  data: ConfessionData;
  onChange: (data: ConfessionData) => void;
  onDownload: () => void;
  isGenerating: boolean;
}

const ConfessionEditor: React.FC<ConfessionEditorProps> = ({ 
  data, 
  onChange, 
  onDownload,
  isGenerating 
}) => {
  
  const updateField = <K extends keyof ConfessionData>(key: K, value: ConfessionData[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-md border-r border-rose-100 p-8 shadow-2xl z-10 w-full lg:w-[450px] overflow-y-auto">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl text-rose-500 tracking-widest mb-2 flex items-center justify-center gap-3">
          <Heart className="fill-rose-500 w-8 h-8" />
          PEC-CONFESSIONS
        </h1>
        <p className="text-rose-300 font-sans text-sm tracking-wide uppercase font-semibold">Love Notes & Secrets</p>
      </div>

      <div className="space-y-8 flex-grow">
        
        {/* Text Input */}
        <div className="group">
          <label className="block text-rose-400 text-xs font-bold uppercase tracking-widest mb-3 pl-1">
            Your Message
          </label>
          <textarea
            value={data.text}
            onChange={(e) => updateField('text', e.target.value)}
            className="w-full bg-rose-50 border-2 border-rose-100 rounded-xl p-4 text-rose-800 font-sans focus:outline-none focus:border-rose-300 focus:bg-white transition-all resize-none h-40 placeholder-rose-300"
            placeholder="Tell them how you feel..."
            maxLength={400}
          />
          <div className="text-right text-rose-300 text-xs mt-2 font-mono">
            {data.text.length} / 400
          </div>
        </div>

        {/* Sender Input */}
        <div>
          <label className="block text-rose-400 text-xs font-bold uppercase tracking-widest mb-3 pl-1">
            Signed By
          </label>
          <div className="relative">
            <PenTool className="absolute left-4 top-3.5 w-4 h-4 text-rose-400" />
            <input
              type="text"
              value={data.sender}
              onChange={(e) => updateField('sender', e.target.value)}
              className="w-full bg-rose-50 border-2 border-rose-100 rounded-xl pl-10 pr-4 py-3 text-rose-800 font-serif italic focus:outline-none focus:border-rose-300 focus:bg-white transition-all"
              placeholder="Your Secret Admirer"
              maxLength={30}
            />
          </div>
        </div>

        {/* Style Controls */}
        <div>
          <label className="block text-rose-400 text-xs font-bold uppercase tracking-widest mb-3 pl-1">
            Style It
          </label>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Font Toggle */}
            <button
              onClick={() => updateField('fontStyle', FontStyle.TYPEWRITER)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                data.fontStyle === FontStyle.TYPEWRITER
                  ? 'bg-rose-100 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-transparent border-rose-100 text-rose-300 hover:border-rose-200'
              }`}
            >
              <Type className="w-4 h-4" />
              <span className="text-xs font-bold">Typewriter</span>
            </button>
            <button
              onClick={() => updateField('fontStyle', FontStyle.HANDWRITING)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                data.fontStyle === FontStyle.HANDWRITING
                  ? 'bg-rose-100 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-transparent border-rose-100 text-rose-300 hover:border-rose-200'
              }`}
            >
              <Feather className="w-4 h-4" />
              <span className="text-xs font-bold">Cursive</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => updateField('isDarkTheme', true)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                data.isDarkTheme
                  ? 'bg-rose-100 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-transparent border-rose-100 text-rose-300 hover:border-rose-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span className="text-xs font-bold">Sweetheart</span>
            </button>
            <button
              onClick={() => updateField('isDarkTheme', false)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                !data.isDarkTheme
                  ? 'bg-rose-100 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-transparent border-rose-100 text-rose-300 hover:border-rose-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold">Classic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-10">
        <button
          onClick={onDownload}
          disabled={!data.text || isGenerating}
          className={`w-full py-4 px-6 rounded-xl font-serif font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
            !data.text || isGenerating
              ? 'bg-rose-100 text-rose-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 shadow-rose-300/50'
          }`}
        >
          {isGenerating ? 'Sealing with a kiss...' : 'Save Image'}
        </button>
      </div>
    </div>
  );
};

export default ConfessionEditor;