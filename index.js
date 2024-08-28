const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");

const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle image upload and text extraction
app.post("/upload", upload.single("image"), (req, res) => {
  const imagePath = req.file.path;

  // Perform OCR on the uploaded image using Tesseract.js
  Tesseract.recognize(imagePath, "eng")
    .then(({ data: { text } }) => {
      console.log("Extracted Text:", text); // Log the extracted text

      // Normalize and clean text
      let cleanedText = text.toLowerCase();
      // Remove non-alphabetic characters except spaces
      cleanedText = cleanedText.replace(/[^a-z\s]/g, " ").trim();
      // Replace multiple spaces with a single space
      cleanedText = cleanedText.replace(/\s+/g, " ");

      //   console.log("Cleaned Text:", cleanedText); // Log cleaned text for debugging

      // Check if the text contains "male" or "female"
      if (cleanedText.includes("female")) {
        console.log({ message: "You are allowed" });
      } else if (cleanedText.includes("male")) {
        console.log({ message: "You are not allowed" });
      } else {
        console.log({ message: "No gender information found" });
      }
    })
    .catch((error) => {
      console.error("Error during text extraction:", error);
      res.status(500).json({ error: "Text extraction failed" });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
