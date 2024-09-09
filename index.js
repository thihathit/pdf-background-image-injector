const fs = require("fs");
const { PDFDocument, PDFPage } = require("pdf-lib");
const sharp = require("sharp");

async function addBackgroundToPDF(pdfPath, imagePath, outputPath) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  const image = await sharp(imagePath)
    .resize(Math.round(width), Math.round(height), {
      fit: "fill",
      withoutEnlargement: true,
    })
    .toBuffer();

  const embeddedImage = await pdfDoc.embedPng(image);

  const newPage = pdfDoc.addPage([width, height]);
  newPage.drawImage(embeddedImage, {
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
