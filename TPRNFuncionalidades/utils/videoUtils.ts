export const getYouTubeVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }
    return null;
  } catch {
    return null;
  }
};

export const isYouTubeUrl = (url: string): boolean => {
  return !!getYouTubeVideoId(url);
};

export const getYouTubeEmbedUrl = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}; 