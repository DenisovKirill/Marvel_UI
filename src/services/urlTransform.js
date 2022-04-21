const urlTransform = (url) => {
    if (url.includes("http") && !url.includes("https")) {
        return url.replace("http", "https");
    }
};

export default urlTransform;