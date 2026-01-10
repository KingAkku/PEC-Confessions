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

const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(
    x, y, 
    x - size / 2, y, 
    x - size / 2, y + topCurveHeight
  );
  // bottom left curve
  ctx.bezierCurveTo(
    x - size / 2, y + (size + topCurveHeight) / 2, 
    x, y + (size + topCurveHeight) / 2, 
    x, y + size
  );
  // bottom right curve
  ctx.bezierCurveTo(
    x, y + (size + topCurveHeight) / 2, 
    x + size / 2, y + (size + topCurveHeight) / 2, 
    x + size / 2, y + topCurveHeight
  );
  // top right curve
  ctx.bezierCurveTo(
    x + size / 2, y, 
    x, y, 
    x, y + topCurveHeight
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
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
  const PADDING = 120;
  
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // 2. Draw Background
  if (data.isDarkTheme) {
    // "Sweetheart" Theme (Pink Background)
    ctx.fillStyle = '#fce7f3'; // pink-100
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  } else {
    // "Classic" Theme (White Background)
    ctx.fillStyle = '#ffffff'; 
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
  
  // 3. Draw Decorative Hearts (Background Pattern)
  const heartColor = data.isDarkTheme ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 182, 193, 0.2)';
  
  for(let i=0; i<40; i++) {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT;
    const size = 10 + Math.random() * 40;
    const rotation = (Math.random() - 0.5) * 1; // Slight tilt
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    drawHeart(ctx, 0, 0, size, heartColor);
    ctx.restore();
  }

  // 4. Draw Border
  const borderColor = data.isDarkTheme ? '#f43f5e' : '#fda4af'; // Rose-500 or Rose-300
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  
  // Double Border Effect
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);
  ctx.lineWidth = 2;
  ctx.strokeRect(55, 55, WIDTH - 110, HEIGHT - 110);
  
  // Corner Hearts
  const cornerSize = 24;
  drawHeart(ctx, 40, 40 - cornerSize/2, cornerSize, borderColor);
  drawHeart(ctx, WIDTH - 40, 40 - cornerSize/2, cornerSize, borderColor);
  drawHeart(ctx, 40, HEIGHT - 40 - cornerSize, cornerSize, borderColor);
  drawHeart(ctx, WIDTH - 40, HEIGHT - 40 - cornerSize, cornerSize, borderColor);

  // 5. Configure Fonts
  const textColor = data.isDarkTheme ? '#881337' : '#be123c'; // Rose-900 or Rose-700
  const accentColor = '#e11d48'; // Rose-600

  // 6. Draw Content
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

  lines.forEach((line) => {
    ctx.fillText(line, WIDTH / 2, startY);
    startY += lineHeight;
  });

  // 7. Draw Sender ("From")
  if (data.sender) {
    ctx.font = `italic 32px "Cinzel", serif`;
    ctx.fillStyle = accentColor;
    const footerY = HEIGHT - PADDING;
    ctx.fillText(`xoxo, ${data.sender}`, WIDTH / 2, footerY); // Added "xoxo" for cuteness
  }

  // 8. Watermark
  ctx.font = `400 20px "Inter", sans-serif`;
  ctx.fillStyle = data.isDarkTheme ? '#be123c' : '#fb7185';
  ctx.fillText('pec-confessions', WIDTH / 2, HEIGHT - 40);

  return canvas.toDataURL('image/png');
};