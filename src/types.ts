export interface ScreenshotConfig {
    width: number;
    height: number;
    backgroundColor?: string;
    image: string;
    title: string;
    subtitle?: string;
    titleColor?: string;
    titlePosition?: {
      x: number | 'center';
      y: number;
    };
    output: string;
  }
  