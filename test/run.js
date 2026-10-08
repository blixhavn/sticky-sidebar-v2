const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  // GitHub's Ubuntu runners block the unprivileged user namespaces Chrome's sandbox needs.
  const browser = await puppeteer.launch({
    args: ['--allow-file-access-from-files'].concat(process.env.CI ? ['--no-sandbox'] : [])
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    page.on('pageerror', (error) => console.error('Page error:', error.message));

    await page.goto('file://' + path.join(__dirname, 'index.html'));
    await page.waitForFunction(() => window.mochaResults, { timeout: 60000 });

    const { stats, failures } = await page.evaluate(() => window.mochaResults);
    failures.forEach((failure) => console.error('  FAIL ' + failure.title + '\n       ' + failure.error));
    console.log(stats.passes + ' passing, ' + stats.failures + ' failing');

    process.exitCode = stats.failures > 0 || stats.passes === 0 ? 1 : 0;
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
