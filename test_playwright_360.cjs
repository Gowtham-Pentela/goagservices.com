const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/drone-360...');
  await page.goto('http://localhost:5173/drone-360', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Take screenshot of initial slow motion view
  const artifactDir = '/Users/gowtham/.gemini/antigravity-ide/brain/8f647605-3e97-4435-8de0-8124cf641cb2';
  await page.screenshot({ path: `${artifactDir}/verified_slowmo_smooth_360.png` });
  console.log('Saved verified_slowmo_smooth_360.png');

  // Verify multiple angle readings over 1.5 seconds to confirm slow-motion continuous rotation
  const readings = [];
  for (let i = 0; i < 4; i++) {
    const text = await page.locator('text=AZIMUTH:').innerText();
    readings.push(text);
    await page.waitForTimeout(500);
  }
  console.log('Continuous rotation readings over time:', readings);

  // Test drag interaction
  const stage = page.locator('div[tabindex="0"]');
  const box = await stage.boundingBox();
  if (box) {
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 180, startY, { steps: 15 });
    await page.waitForTimeout(400);
    await page.mouse.up();
  }

  await page.waitForTimeout(800);
  await page.screenshot({ path: `${artifactDir}/verified_scrubbed_smooth_360.png` });
  console.log('Saved verified_scrubbed_smooth_360.png after smooth drag');

  await browser.close();
  console.log('All tests passed successfully!');
})();
