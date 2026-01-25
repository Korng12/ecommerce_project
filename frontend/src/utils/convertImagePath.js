const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return `http://localhost:3000${path}`;
};

export default getImageUrl;
