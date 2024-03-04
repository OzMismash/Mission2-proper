import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('https://oscarmmission2.cognitiveservices.azure.com/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Ocp-Apim-Subscription-Key': '30b29e86888b489fb08687635d39390e'
          // Add any additional headers required by Azure
        },
      });
      console.log(response.data); // Handles the response from Azure
      // Parse the response and display the results
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
};

export default ImageUpload;