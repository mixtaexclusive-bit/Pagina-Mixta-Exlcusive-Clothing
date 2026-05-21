export const placeholderImage =
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85";

const convertDriveUrl = (url) => {
  const value = String(url || "").trim();
  const driveMatch = value.match(/\/d\/([a-zA-Z0-9_-]+)(?:\/|$|\?)/);
  const idMatch = value.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (driveMatch) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }

  if (idMatch) {
    return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  }

  return value;
};

export const isDirectImageUrl = (url) => {
  const value = String(url || "").trim().toLowerCase();

  if (!value) return false;
  if (value.includes("collection.cloudinary.com")) return false;
  if (value.includes("res.cloudinary.com")) return true;
  if (value.includes("images.unsplash.com")) return true;
  if (value.includes("drive.google.com/uc?export=view")) return true;
  if (value.includes("lh3.googleusercontent.com")) return true;

  return /\.(jpg|jpeg|png|webp|avif)(\?.*)?$/.test(value);
};

export const getDisplayImage = (url) => {
  const normalizedUrl = convertDriveUrl(url);
  return isDirectImageUrl(normalizedUrl) ? normalizedUrl : placeholderImage;
};
