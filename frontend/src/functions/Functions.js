export function formatDuration(duration) {
    const mins = Math.floor(duration);
    const secs = Math.floor((duration - mins) * 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}
export function calculateDateDifference(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    const diffInMillis = today - inputDate;
    const diffInDays = Math.floor(diffInMillis / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
    const diffInSeconds = Math.floor(diffInMillis / 1000);

    if (diffInDays >= 1) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours >= 1) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else if (diffInMinutes >= 1) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
    }
}
