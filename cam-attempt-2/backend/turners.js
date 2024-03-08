//require("dotenv").config(); // Load environment variables from .env file

const { setLogLevel } = require("@azure/logger");
setLogLevel("info");

const endpoint = 'https://mission2-cam.cognitiveservices.azure.com/';
const key = '1ef7c8fc08244d26866a105c64a42289';

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const imageUrl = "https://www.aucklandcars.nz/userfiles/image/bmw.png";

const features = [
  "Caption",
  "DenseCaptions",
  "Objects",
  "People",
  "Read",
  "SmartCrops",
  "Tags",
];

(async () => {
  try {
    const result = await client.path("/imageanalysis:analyze").post({
      body: {
        url: imageUrl,
      },
      queryParameters: {
        features: features,
        language: "en",
        "gender-neutral-captions": "true",
        "smartCrops-aspect-ratios": [0.9, 1.33],
      },
      contentType: "application/json",
    });

    const iaResult = result.body;

    console.log(`Model Version: ${iaResult.modelVersion}`);
    console.log(`Image Metadata: ${JSON.stringify(iaResult.metadata)}`);
    if (iaResult.captionResult) {
      console.log(
        `Caption: ${iaResult.captionResult.text} (confidence: ${iaResult.captionResult.confidence})`
      );
    }
    if (iaResult.denseCaptionsResult) {
      iaResult.denseCaptionsResult.values.forEach((denseCaption) =>
        console.log(`Dense Caption: ${JSON.stringify(denseCaption)}`)
      );
    }
    if (iaResult.objectsResult) {
      iaResult.objectsResult.values.forEach((object) =>
        console.log(`Object: ${JSON.stringify(object)}`)
      );
    }
    if (iaResult.peopleResult) {
      iaResult.peopleResult.values.forEach((person) =>
        console.log(`Person: ${JSON.stringify(person)}`)
      );
    }
    if (iaResult.readResult) {
      iaResult.readResult.blocks.forEach((block) =>
        console.log(`Text Block: ${JSON.stringify(block)}`)
      );
    }
    if (iaResult.smartCropsResult) {
      iaResult.smartCropsResult.values.forEach((smartCrop) =>
        console.log(`Smart Crop: ${JSON.stringify(smartCrop)}`)
      );
    }
    if (iaResult.tagsResult) {
      iaResult.tagsResult.values.forEach((tag) =>
        console.log(`Tag: ${JSON.stringify(tag)}`)
      );
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
  }
})();

async function analyzeImage() {
  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select an image file.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/analyze", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    displayResult(data);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred during image analysis.");
  }
}

function displayResult(data) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}
