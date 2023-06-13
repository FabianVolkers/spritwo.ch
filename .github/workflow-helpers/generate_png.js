const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=en-GB,en'],
    executablePath: process.env.CHROME_EXECUTABLE_PATH,
  });
  console.log('Browser launched')
  console.log(`Browser version: ${await browser.version()}`)
  const page = await browser.newPage();

  await page.evaluate(() => {
    console.log(`Language: ${navigator.language}`);
  });
  
  // Set screen size
  const width = 1000;
  const height = 618;
  await page.setViewport({ width, height });
  console.log(`Viewport set to ${width}x${height}`)
  console.log()

  page.on('console', (msg) => {
    for (let i = 0; i < msg.args().length; ++i)
      console.log(`${i}: ${msg.args()[i]}`);
  });

  await page.goto(process.env.URL, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: process.env.PREVIEW_IMAGE_FILE, fullPage: false });
  console.log()
  console.log(`Screenshot saved to ${process.env.PREVIEW_IMAGE_FILE}`)
  await browser.close();
})();
