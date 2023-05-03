const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.CHROME_EXECUTABLE_PATH,
  });
  const page = await browser.newPage();
  
  // Set screen size
  const width = 1000;
  const height = 618;
  await page.setViewport({ width, height });

  await page.goto(process.env.URL, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'assets/image/preview-image.png', fullPage: false });
  await browser.close();
})();
