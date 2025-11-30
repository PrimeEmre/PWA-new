
// AI image generate API
function genareteImg() {
    imagePrompt = document.getElementById('image-generate').value;
    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1920&height=1080&model=flux`;
    console.log(apiUrl);
    document.getElementById('result').innerHTML = `<img src="${apiUrl}" alt="Generated Image" width="500">`;
}