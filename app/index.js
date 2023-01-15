import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const port = 5000;

app.get('/print', async (req, res) => {
    const { url } = req.query;

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-dev-shm-usage', '--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4' });
    
    await browser.close();

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.length
    });
    res.send(pdf);

});

app.listen(port, () => {
    console.log(`web2pdf app listening at http://localhost:${port}`)
});

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});