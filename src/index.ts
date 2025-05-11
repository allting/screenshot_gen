import fs from 'fs-extra';
import path from 'path';
import { Canvas, loadImage, FontLibrary } from 'skia-canvas';
import { ScreenshotConfig } from './types';

// 시스템 폰트 로딩 (또는 커스텀 폰트 경로 지정 가능)
// FontLibrary.useSystemFonts();
const TitleFontName = 'bold 150px "Apple SD Gothic Neo"'
const SubtitleFontName = '80px "Apple SD Gothic Neo"'

function drawGradientText(
    ctx: any,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    width: number,
    colors: [string, string], // 시작, 끝 색상
    outlineWidth: number = 8
  ) {
    // ctx.font = `bold ${fontSize}px "Apple SD Gothic Neo", "AppleGothic", sans-serif`;
    ctx.lineWidth = outlineWidth;
    ctx.lineJoin = 'round';
  
    // 1. 외곽선 (stroke)
    ctx.strokeStyle = 'black'; // 외곽선 색상 (고정 혹은 동적으로 바꿀 수 있음)
    ctx.strokeText(text, x, y);
  
    // 2. 그라데이션 텍스트 (fill)
    const gradient = ctx.createLinearGradient(x, y - fontSize, x + width, y);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillText(text, x, y);
}

/**
 * 입력 이미지와 프레임 이미지를 합쳐 하나의 이미지 버퍼 생성
 */
export async function mergeImageWithFrame(
    screenshotPath: string,
    framePath: string,
    // canvasWidth = 1390,
    // canvasHeight = 2880,
    cornerRadius = 80
  ): Promise<Buffer> {
    const screenshot = await loadImage(path.resolve(screenshotPath));
    const frame = await loadImage(path.resolve(framePath));

    const canvasWidth = screenshot.width+102
    const canvasHeight = screenshot.height+88

    const canvas = new Canvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    
    const screenshotX = (canvasWidth - screenshot.width) / 2;
    const screenshotY = (canvasHeight - screenshot.height) / 2;
  
    // 👉 클리핑 path 설정
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(
      screenshotX,
      screenshotY,
      screenshot.width,
      screenshot.height,
      cornerRadius
    );
    ctx.clip();
  
    // 🔲 스크린샷 그리기
    ctx.drawImage(screenshot, screenshotX, screenshotY);
    ctx.restore();
  
    // 🧷 프레임 위에 덮기
    ctx.drawImage(frame, 0, 0, canvasWidth, canvasHeight);
    // PNG 버퍼 반환
    return await canvas.png;
}
  
/**
 * 병합된 이미지를 파일로 저장
 */
export async function saveMergedImage(
    screenshotPath: string,
    framePath: string,
    outputPath: string
  ) {
    const buffer = await mergeImageWithFrame(screenshotPath, framePath);
    await fs.outputFile(outputPath, buffer);
    console.log(`✅ Saved to ${outputPath}`);
}

/**
 * 캔버스 전체에 다중 그라데이션 배경을 그림
 * @param ctx - CanvasRenderingContext2D
 * @param width - 캔버스 너비
 * @param height - 캔버스 높이
 * @param colors - 색상 배열 (2개 이상)
 */
export function drawGradientBackground(
  ctx: any,
  width: number,
  height: number,
  colors: string[]
) {
  if (colors.length < 2) {
    throw new Error('그라데이션에는 최소 2개 이상의 색상이 필요합니다.');
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, height); // top to bottom

  const step = 1 / (colors.length - 1);
  colors.forEach((color, index) => {
    gradient.addColorStop(index * step, color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * 다양한 원형 그라데이션을 뭉실하게 배경으로 그리는 함수
 * @param ctx - 캔버스 context
 * @param width - 캔버스 너비
 * @param height - 캔버스 높이
 * @param blobs - 블롭 개수
 * @param colors - 사용할 색상 배열
 */
export function drawMetaGradientBackground(
  ctx: any,
  width: number,
  height: number,
  blobs: number = 6,
  colors: string[] = ['#ff6ec4', '#7873f5', '#67d7cc', '#fddb92']
) {
  ctx.clearRect(0, 0, width, height);

  ctx.globalCompositeOperation = 'lighter'; // 겹칠수록 밝게
  ctx.globalAlpha = 0.5;

  for (let i = 0; i < blobs; i++) {
    const radius = Math.random() * (width / 2 - 100) + 150;
    const x = Math.random() * width;
    const y = Math.random() * height;

    const color = colors[i % colors.length];

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over'; // 상태 복구
}

async function generateScreenshot(config: ScreenshotConfig) {
    const canvas = new Canvas(config.width, config.height);
    const ctx = canvas.getContext('2d');
  
    // 배경에 투명도 제거.
    ctx.save();
    ctx.globalAlpha = 1.0; // 완전 불투명
    ctx.fillStyle = '#000'; // 또는 원하는 배경색
    ctx.fillRect(0, 0, config.width, config.height);
    ctx.restore();
    // 배경
    // ctx.fillStyle = config.backgroundColor || '#aaffaa';
    // ctx.fillRect(0, 0, config.width, config.height);
    // 🎨 그라데이션 배경 적용
    // drawGradientBackground(ctx, config.width, config.height, [
    //   '#ff7e5f', // orange
    //   '#feb47b', // light orange
    //   '#fef9d7'  // yellow-ish
    // ]);

    drawMetaGradientBackground(ctx, config.width, config.height, 7, [
      '#ff6ec4',
      '#7873f5',
      '#67d7cc',
      '#fddb92',
      '#ff9a9e',
      '#a18cd1',
    ]);
    // 타이틀
    ctx.fillStyle = config.titleColor || '#000000';
    ctx.font = TitleFontName;
    const fontSize = 150;
    const titleWidth = ctx.measureText(config.title).width;
    const titleX = config.titlePosition?.x === 'center'
      ? (config.width - titleWidth) / 2
      : typeof config.titlePosition?.x === 'number'
        ? config.titlePosition.x
        : 100;
    const titleY = config.titlePosition?.y || 150;
    drawGradientText(
      ctx,
      config.title,
      titleX,
      titleY,
      fontSize,
      titleWidth,
      ['#007AFF', '#228FFF'],
      0
    );
  
    // 서브타이틀
    if (config.subtitle) {
      ctx.fillStyle = '#999';
      ctx.font = SubtitleFontName;
      const subWidth = ctx.measureText(config.subtitle).width;
      const subX = (config.width - subWidth) / 2;
      ctx.fillText(config.subtitle, subX, titleY + 120);
    }
  
    // 병합 이미지 처리
    const mergedBuffer = await mergeImageWithFrame(
      config.image,
      './assets/frame.png'
    );
    const mergedImage = await loadImage(mergedBuffer);
  
    // 👉 크기 조절 (전체 캔버스의 ¾로 맞추기)
    const maxImageHeight = config.height * 0.75;
    const ratio = maxImageHeight / mergedImage.height;
    const targetWidth = mergedImage.width * ratio;
    const targetHeight = mergedImage.height * ratio;
    const imageX = (config.width - targetWidth) / 2;
    const imageY = config.height - targetHeight - 150; // 하단 여백
  
    ctx.drawImage(mergedImage, imageX, imageY, targetWidth, targetHeight);
  
    // 저장
    // const buffer = await canvas.png;
    const buffer = await canvas.jpg
    await fs.outputFile(config.output, buffer);
    console.log(`✅ Saved: ${config.output}`);
}

async function runBatch() {
  const jsonPath = process.argv[2]; // 명령어 인자의 세 번째 요소
  if (!jsonPath) {
    console.error('❌ JSON 파일 경로를 인자로 전달하세요. 예: node dist/index.js ./input/ex.json');
    process.exit(1);
  }

  const data: ScreenshotConfig[] = await fs.readJSON(jsonPath);
  for (const config of data) {
    await generateScreenshot(config);
  }
}

// yarn start -- ./input/ex.json
runBatch().catch(console.error);
