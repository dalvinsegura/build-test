import puppeteer from 'puppeteer';
import fs from 'fs';
import pdfTemplate from "../documents";

export const createPdf = async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    try {
    await page.setContent(pdfTemplate(req.body));
    await page.pdf({
        path: 'example.pdf',
        format: 'A4',
        printBackground: true
      });

    await browser.close();

    const pdf = fs.readFileSync('example.pdf');
    console.log(pdf)
    res.contentType("application/pdf");
    res.send(pdf);

    } catch (error) {
        console.log(error)
    }
}

export const fetchPdf = (req, res) => {
try {
    const pdf = fs.readFileSync('example.pdf');
    console.log(pdf)
    res.contentType("application/pdf");
    res.send(pdf);
} catch (error) {
    console.log(error)
}

};