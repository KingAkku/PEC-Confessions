import React, { useState, useCallback } from 'react';
import ConfessionEditor from './components/ConfessionEditor';
import LivePreview from './components/LivePreview';
import { ConfessionData, FontStyle } from './types';
import { generateConfessionImage } from './services/canvasService';

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
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden">
      {/* Left Panel: Editor */}
      <ConfessionEditor 
        data={data} 
        onChange={setData} 
        onDownload={handleDownload}
        isGenerating={isGenerating}
      />
      
      {/* Right Panel: Preview */}
      <LivePreview data={data} />
    </div>
  );
};

export default App;
