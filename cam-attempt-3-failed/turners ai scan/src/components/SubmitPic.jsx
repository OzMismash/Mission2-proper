import React, { useState, useEffect } from 'react';

export default function ImageAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const analyzeImage = async () => {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await fetch("https://mission2-cam.cognitiveservices.azure.com/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=&model-name=&language=&smartcrops-aspect-ratios=&gender-neutral-caption=", {
  method: "POST",
  headers: {
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': '1ef7c8fc08244d26866a105c64a42289',
  },
  body: file,
});
      if (response.ok) {
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } else {
        alert("An error occurred during image analysis.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during image analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Image Analysis</h1>
      <input type="file" id="imageInput" accept="image/*" />
      <button onClick={analyzeImage}>Analyze Image</button>
      {loading && <div className="loader"></div>}
      <div id="result">
        <pre>{result}</pre>
      </div>
    </div>
  );
}
