import { ConfessionData, FontStyle } from '../types';

/**
 * wraps text for HTML5 Canvas.
 */
const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ');
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
  }
  return lines;
};

/**
 * Generates the PNG confession image.
 */
export const generateConfessionImage = async (data: ConfessionData): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Setup Canvas Dimensions
  const WIDTH = 1080;
  const HEIGHT = 1350;
  const PADDING = 120; // Ensure text stays within safe area of the template
  
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // 2. Load and Draw Template Image
  const template = new Image();
  template.crossOrigin = "anonymous";
  template.src = '/my_love.svg';

  try {
    // Wait for both the SVG template AND the web fonts to be fully loaded
    await Promise.all([
      new Promise((resolve, reject) => {
        if (template.complete) return resolve(true);
        template.onload = () => resolve(true);
        template.onerror = () => reject(new Error('Failed to load template image'));
      }),
      document.fonts.ready 
    ]);
    
    // Draw the template to cover the canvas
    ctx.drawImage(template, 0, 0, WIDTH, HEIGHT);
    
  } catch (e) {
    console.error("Template/Font loading failed, falling back to basic background", e);
    // Fallback in case image is missing
    ctx.fillStyle = '#fff1f2';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  // 3. Configure Fonts
  // Adjust colors to ensure visibility on top of the template.
  const textColor = data.isDarkTheme ? '#881337' : '#be123c'; // Rose-900 or Rose-700
  const accentColor = '#e11d48'; // Rose-600

  // 4. Draw Content
  const baseFontSize = 48;
  const lineHeight = baseFontSize * 1.6;
  
  if (data.fontStyle === FontStyle.TYPEWRITER) {
    ctx.font = `${baseFontSize}px "Special Elite", monospace`;
  } else {
    ctx.font = `${baseFontSize}px "Pinyon Script", cursive`;
  }
  
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxTextWidth = WIDTH - (PADDING * 2);
  const lines = wrapText(ctx, data.text, maxTextWidth);
  
  const textBlockHeight = lines.length * lineHeight;
  let startY = (HEIGHT - textBlockHeight) / 2;
  
  // Safety check: ensure text doesn't start above the padding area
  startY = Math.max(PADDING, startY);
  
  lines.forEach((line) => {
    ctx.fillText(line, WIDTH / 2, startY);
    startY += lineHeight;
  });

  // 5. Draw Sender ("From")
  if (data.sender) {
    ctx.font = `italic 32px "Cinzel", serif`;
    ctx.fillStyle = accentColor;
    const footerY = HEIGHT - PADDING;
    ctx.fillText(`xoxo, ${data.sender}`, WIDTH / 2, footerY);
  }

  // 6. Watermark
  ctx.font = `400 20px "Inter", sans-serif`;
  ctx.fillStyle = data.isDarkTheme ? '#be123c' : '#fb7185';
  ctx.fillText('pec-confessions', WIDTH / 2, HEIGHT - 40);

  return canvas.toDataURL('image/png');
};