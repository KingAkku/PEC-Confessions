export enum FontStyle {
  HANDWRITING = 'handwriting',
  TYPEWRITER = 'typewriter'
}

export interface ConfessionData {
  text: string;
  sender: string;
  fontStyle: FontStyle;
  isDarkTheme: boolean; // TRUE = Sweetheart (Pink), FALSE = Classic (White)
}
