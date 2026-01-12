import React, { useState, useCallback } from 'react';
import ConfessionEditor from './components/ConfessionEditor';
import LivePreview from './components/LivePreview';
import { ConfessionData, FontStyle } from './types';
import { generateConfessionImage } from './services/canvasService';
import { Instagram } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<ConfessionData>({
    text: '',
    sender: '',
    fontStyle: FontStyle.TYPEWRITER,
    isDarkTheme: true
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Small delay to allow UI to show "Sealing..." state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await generateConfessionImage(data);
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `confession-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Failed to generate confession:", error);
      alert("Failed to seal your confession. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [data]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden relative">
      {/* Left Panel: Editor */}
      <ConfessionEditor 
        data={data} 
        onChange={setData} 
        onDownload={handleDownload}
        isGenerating={isGenerating}
      />
      
      {/* Right Panel: Preview */}
      <LivePreview data={data} />

      {/* Social Button */}
      <a 
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 p-4 bg-white/80 backdrop-blur-md border border-rose-200 text-rose-500 rounded-full shadow-2xl hover:bg-gradient-to-tr hover:from-rose-500 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 group"
        aria-label="Visit us on Instagram"
      >
        <Instagram className="w-6 h-6" />
      </a>
    </div>
  );
};

export default App;