const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function addBackgroundToPDF(pdfPath, imagePath, outputPath) {
  const tempDir = fs.mkdtempSync('pdf-background-');
  const backgroundPdf = path.join(tempDir, 'background.pdf');

  try {
    // Convert image to PDF
    execSync(`magick "${imagePath}" "${backgroundPdf}"`);

    // Combine background PDF with original PDF
    execSync(`pdftk "${pdfPath}" background "${backgroundPdf}" output "${outputPath}"`);

    console.log(`PDF with background saved to ${outputPath}`);
  } finally {
    // Clean up temporary files
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

// Usage
addBackgroundToPDF('page.pdf', 'background.png', 'output.pdf');