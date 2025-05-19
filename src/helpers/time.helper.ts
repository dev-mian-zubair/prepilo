export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const padNumber = (num: number): string => num.toString().padStart(2, '0');

  if (hours > 0) {
    return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(remainingSeconds)}`;
  }
  return `${padNumber(minutes)}:${padNumber(remainingSeconds)}`;
}; 