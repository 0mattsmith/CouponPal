import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// We mock an HTTP response that represents a typical coupon aggregator site
// (e.g. RetailMeNot, VoucherCodes) to avoid getting blocked by anti-bot systems during the demo.
const MOCK_COUPON_SITE_HTML = `
  <html>
    <body>
      <div class="coupon-card">
        <h3>20% Off Your Entire Order</h3>
        <p>Use this code at checkout: <strong class="promo-code">SAVE20</strong></p>
      </div>
      <div class="coupon-card">
        <h3>£10 Off Any Purchase</h3>
        <p>Use this code at checkout: <strong class="promo-code">MINUS10</strong></p>
      </div>
      <div class="coupon-card">
        <h3>Fake 50% Off Code (Doesn't Work)</h3>
        <p>Use this code at checkout: <strong class="promo-code">FAKE50</strong></p>
      </div>
      <div class="coupon-card">
        <h3>Free Shipping</h3>
        <p>Use this code at checkout: <strong class="promo-code">FREESHIP</strong></p>
      </div>
      <div class="coupon-card">
        <h3>Expired Code</h3>
        <p>Use this code at checkout: <strong class="promo-code">EXPIRED_CODE</strong></p>
      </div>
    </body>
  </html>
`;

async function scrapeCodes() {
  console.log("🔍 [SCRAPER] Simulating scraping a public coupon site...");
  // In a real scenario: const response = await axios.get('https://example-coupon-site.com/store/mockstore');
  // const html = response.data;
  const html = MOCK_COUPON_SITE_HTML;
  
  const $ = cheerio.load(html);
  const potentialCodes = [];

  // Scrape all elements with class 'promo-code'
  $('.promo-code').each((index, element) => {
    const code = $(element).text().trim();
    if (code) {
      potentialCodes.push(code);
    }
  });

  console.log(`✅ [SCRAPER] Found ${potentialCodes.length} potential codes:`, potentialCodes);
  return potentialCodes;
}

async function testCodes(codes) {
  console.log("🤖 [TESTER] Launching headless browser to test codes...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const validCodes = [];

  try {
    console.log("🌐 [TESTER] Navigating to Mock Checkout Page (http://localhost:5175/checkout)");
    await page.goto('http://localhost:5175/checkout', { waitUntil: 'domcontentloaded' });

    // Ensure the checkout page has loaded
    await page.waitForSelector('#checkout-total');

    for (const code of codes) {
      console.log(`⏳ [TESTER] Testing code: ${code}...`);
      
      // Get the original total
      const originalTotalText = await page.$eval('#checkout-total', el => el.innerText);
      const originalTotal = parseFloat(originalTotalText.replace(/[^0-9.]/g, ''));

      // Clear the input and type the new code
      await page.evaluate(() => document.getElementById('promo-code').value = '');
      await page.type('#promo-code', code);
      
      // Click Apply
      await page.click('#apply-promo');
      
      // Wait a moment for React to recalculate and update the DOM
      await new Promise(r => setTimeout(r, 500));

      // Get the new total
      const newTotalText = await page.$eval('#checkout-total', el => el.innerText);
      const newTotal = parseFloat(newTotalText.replace(/[^0-9.]/g, ''));

      const savings = originalTotal - newTotal;

      if (savings > 0) {
        console.log(`   ✅ SUCCESS! '${code}' saved £${savings.toFixed(2)}.`);
        validCodes.push({ code, savings });
      } else {
        console.log(`   ❌ FAILED. '${code}' is invalid or expired.`);
      }

      // Reset the discount by applying an empty code so the next test starts fresh
      await page.evaluate(() => document.getElementById('promo-code').value = '');
      await page.click('#apply-promo');
      await new Promise(r => setTimeout(r, 300));
    }
  } catch (error) {
    console.error("❌ [TESTER] Error during testing:", error);
  } finally {
    await browser.close();
  }

  return validCodes;
}

async function run() {
  console.log("======================================");
  console.log("🚀 STARTING SCRAPE & TEST ENGINE");
  console.log("======================================");

  // 1. Scrape the codes
  const scrapedCodes = await scrapeCodes();

  // 2. Test the codes
  const validCodes = await testCodes(scrapedCodes);

  console.log("======================================");
  console.log(`🏆 [RESULTS] Found ${validCodes.length} verified working codes!`);
  console.log(validCodes);
  
  // 3. Save the results to a file that the web app could consume
  const outputPath = path.join(process.cwd(), 'public', 'verified_codes.json');
  fs.writeFileSync(outputPath, JSON.stringify(validCodes, null, 2));
  console.log(`💾 Saved verified codes to: ${outputPath}`);
}

run();
