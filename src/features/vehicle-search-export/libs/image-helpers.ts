export async function loadImageWithCORS(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      const imgNoCORS = new Image();
      imgNoCORS.onload = () => resolve(imgNoCORS);
      imgNoCORS.onerror = reject;
      imgNoCORS.src = url;
    };
    img.src = url;
  });
}

export async function loadImageSafe(url: string): Promise<HTMLImageElement | null> {
  try {
    return await loadImageWithCORS(url);
  } catch {
    return null;
  }
}

export function getPlaceholderImage(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZW0gSW5kaXNwb27DrXZlbDwvdGV4dD48L3N2Zz4=';
}

export interface ResizedImageDimensions {
  width: number;
  height: number;
}

export function calculateResizedDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): ResizedImageDimensions {
  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    height = (maxWidth * height) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (maxHeight * width) / height;
    height = maxHeight;
  }

  return { width, height };
}

export async function resizeImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const dimensions = calculateResizedDimensions(
    img.width,
    img.height,
    maxWidth,
    maxHeight
  );

  canvas.width = dimensions.width;
  canvas.height = dimensions.height;

  ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

  return canvas.toDataURL('image/jpeg', 0.8);
}
