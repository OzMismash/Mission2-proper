const express = require('express');
const { ComputerVisionClient } = require('@azure/cognitiveservices-computervision');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 4000; // Use the PORT environment variable or default to 4000

app.use(express.static('cam-attempt-2', {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'text/javascript');
        }
    }
}));



// Initialize Azure Cognitive Services client
const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;
const credentials = new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } });
const client = new ComputerVisionClient(credentials, endpoint);

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for image analysis
app.post('/analyze', async (req, res) => {
    const imageUrl = req.body.image;

    try {
        const result = await client.analyzeImage(imageUrl, {
            visualFeatures: [
                "Categories",
                "Description",
                "Tags",
                "Objects",
                "Faces",
                "Adult",
                "Color",
                "ImageType",
                "DominantColorForeground",
                "DominantColorBackground",
                "Faces"
            ],
            details: [
                "Celebrities",
                "Landmarks"
            ]
        });
        
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred during image analysis.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
