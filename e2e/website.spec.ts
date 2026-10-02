import { test, expect } from '@playwright/test';

test.describe('GoAG Aerospace & Precision Drones Website E2E Tests', () => {

  test('1. Home Page - Hero, 3D Canvas, Nav, Metrics & Feature Tabs', async ({ page }) => {
    await page.goto('/');
    
    // Title & Navbar Logo
    await expect(page).toHaveTitle(/GoAG/);
    await expect(page.locator('nav img[alt="GoAG Services Logo"]')).toBeVisible();

    // Nav Links (Pointer-style architecture)
    await expect(page.locator('nav').getByRole('link', { name: 'OUR PRODUCTS' })).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: 'BUILD YOUR DRONE' })).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: 'HOW IT WORKS' })).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: 'OUR CAMPAIGNS' })).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: 'ABOUT US' })).toBeVisible();

    // Hero headline text
    await expect(page.getByText('TURN EVERY ACRE INTO PROFIT')).toBeVisible();

    // 3D Canvas element
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // Interactive feature modules
    const batteryBtn = page.getByRole('button', { name: 'SMART BATTERY' });
    await expect(batteryBtn).toBeVisible();
    await batteryBtn.click();
    await expect(page.getByText('Fast-Charging Smart Battery Pack')).toBeVisible();
  });

  test('2. Products Page & Navigation with Canonical Names', async ({ page }) => {
    await page.goto('/products');

    await expect(page.getByText('FULL FLEET CATALOGUE').first()).toBeVisible();

    // Canonical product headings
    await expect(page.getByRole('heading', { name: 'Agrown-10X' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Agrown-10X Super Compact' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Graydon' }).first()).toBeVisible();

    // Click product detail link
    const detailsLink = page.locator('a[href*="/products/agrown-10x"]').first();
    await detailsLink.click();
    await expect(page).toHaveURL(/\/products\/agrown-10x/);
  });

  test('3. Product Detail Page & Legacy Slug Redirections', async ({ page }) => {
    // Direct canonical visit
    await page.goto('/products/agrown-10x');
    await expect(page.getByRole('heading', { name: 'Agrown-10X' })).toBeVisible();

    // Spec tabs check via explicit tab IDs
    const overviewTab = page.locator('#tab-overview');
    const specsTab = page.locator('#tab-specifications');
    await expect(overviewTab).toBeVisible();
    await expect(specsTab).toBeVisible();

    await specsTab.click();
    await expect(page.getByText('FULL TECHNICAL SPECIFICATIONS').first()).toBeVisible();

    // Legacy slug redirect: /products/agrown-x -> /products/agrown-10x
    await page.goto('/products/agrown-x');
    await expect(page).toHaveURL(/\/products\/agrown-10x/);

    // Legacy slug redirect: /products/agrown-x-pro -> /products/agrown-10x-super-compact
    await page.goto('/products/agrown-x-pro');
    await expect(page).toHaveURL(/\/products\/agrown-10x-super-compact/);

    // Legacy slug redirect: /products/greaydon-base -> /products/graydon
    await page.goto('/products/greaydon-base');
    await expect(page).toHaveURL(/\/products\/graydon/);
  });

  test('4. Manufacturing Page - Stage Grid & Certifications', async ({ page }) => {
    await page.goto('/manufacturing');

    await expect(page.getByText('CUTTING-EDGE SOLUTIONS FOR EVERY TYPE OF CROP')).toBeVisible();
    await expect(page.getByText('80% Made in India').first()).toBeVisible();
  });

  test('5. Build Drone Configurator - Quote Modal with Customer Info & Flight Simulator CTA', async ({ page }) => {
    await page.goto('/build-your-drone');

    await expect(page.getByText('BUILD YOUR CUSTOM MISSION DRONE')).toBeVisible();
    await expect(page.getByText(/₹/i).first()).toBeVisible();

    // Verify Fly Your Drone CTA exists and navigates to simulator
    const flyBtn = page.locator('#fly-simulator-btn');
    await expect(flyBtn).toBeVisible();
    await flyBtn.click();
    await expect(page).toHaveURL(/\/simulator/);

    // Return to build drone page to test quote modal
    await page.goto('/build-your-drone');
    const quoteBtn = page.locator('#get-quote-btn');
    await expect(quoteBtn).toBeVisible();
    await quoteBtn.click();

    // Verify modal pops up requiring customer details (Name, Mobile, Profession)
    await expect(page.getByText('CUSTOM QUOTE REQUEST')).toBeVisible();
    await page.fill('#quote-name', 'Rajesh Sharma');
    await page.fill('#quote-phone', '9876543210');
    await page.fill('#quote-email', 'rajesh@sharma.com');
    await page.selectOption('#quote-profession', 'Farmer / Agriculture Specialist');

    const submitQuoteBtn = page.locator('#quote-submit-btn');
    await submitQuoteBtn.click();

    // Verify confirmation message
    await expect(page.getByText('QUOTE REQUEST SUBMITTED')).toBeVisible();
  });

  test('6. Flight Simulator Page - Launch Flight & WebGL Canvas', async ({ page }) => {
    await page.goto('/simulator');

    await expect(page.getByText('GoAG AEROSPACE 3D FLIGHT SIMULATOR')).toBeVisible();

    const startBtn = page.locator('#start-simulator-btn');
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // WebGL Canvas & HUD telemetry check
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('ALT').first()).toBeVisible();
  });

  test('7. Outreach Page - Satellite View India Map & Hyderabad HQ', async ({ page }) => {
    await page.goto('/outreach');

    await expect(page.getByText('ENGINEERED IN HYDERABAD.')).toBeVisible();
    await expect(page.getByText('SUPPLIED ALL OVER INDIA.')).toBeVisible();

    // SVG Satellite Map & Hyderabad node check
    const svgMap = page.locator('svg[viewBox="0 0 420 520"]').first();
    await expect(svgMap).toBeVisible();
    await expect(page.getByText('HYDERABAD HQ').first()).toBeVisible();
  });

  test('8. About Page - Company Story & Values', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByText('REVOLUTIONIZING INDIAN AGRICULTURE WITH INTELLIGENT DRONES.')).toBeVisible();
    await expect(page.getByText('Founded by passionate aeronautical engineers in Hyderabad').first()).toBeVisible();
  });

  test('9. Contact Page - Form fill and submission confirmation', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByText('LET’S TAKE OFF, TOGETHER.').first()).toBeVisible();

    // Fill form
    await page.fill('#form-name', 'Dr. Vikram Sarabhai');
    await page.fill('#form-email', 'vikram@isro.gov.in');
    await page.fill('#form-phone', '+91 98765 43210');
    await page.fill('#form-requirement', 'Inquiry regarding custom payload integration for high altitude survey.');

    // Submit form
    const submitBtn = page.locator('#contact-submit-btn');
    await submitBtn.click();

    // Check confirmation message
    await expect(page.getByText('REQUEST TRANSMITTED')).toBeVisible();
  });

});
