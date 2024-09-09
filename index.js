const fs = require("fs");
const { PDFDocument, PDFPage } = require("pdf-lib");

async function addBackgroundToPDF(pdfPath, imagePath, outputPath) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  const imageBytes = fs.readFileSync(imagePath);
  const image = await pdfDoc.embedPng(imageBytes);

  const newPage = pdfDoc.addPage([width, height]);
  newPage.drawImage(image, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });

  const [embeddedPage] = await pdfDoc.embedPdf(pdfBytes, [0]);
  newPage.drawPage(embeddedPage, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });

  pdfDoc.removePage(0);

  const pdfBytesWithBackground = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytesWithBackground);
}

addBackgroundToPDF("page.pdf", "background.png", "output.pdf").catch((error) =>
  console.error("Error:", error),
);
