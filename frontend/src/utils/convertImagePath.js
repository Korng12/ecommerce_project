const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  // If it's just a filename from uploads/products folder
  if (!path.startsWith("/")) {
    path = "/uploads/products/" + path;
  }

  return `http://localhost:3000${path}`;
};

export default getImageUrl;
