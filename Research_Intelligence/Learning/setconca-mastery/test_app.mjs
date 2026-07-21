/**
 * Automated smoke test for SetConCA Mastery app.
 * Run: node test_app.mjs
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const APP = path.join(ROOT, 'Research_Intelligence', 'Learning', 'setconca-mastery', 'index.html');
const APP_URL = 'file:///' + APP.replace(/\\/g, '/');

const errors = [];
const warnings = [];

async function main() {
  if (!fs.existsSync(APP)) {
    console.error('App not found:', APP);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
  });

  console.log('Loading', APP_URL);
  await page.goto(APP_URL, { waitUntil: 'networkidle' });

  // Dashboard loads
  await page.waitForSelector('#mainContent h2');
  const title = await page.textContent('#mainContent h2');
  if (!title) throw new Error('No level title on dashboard');
  console.log('✓ Dashboard:', title);

  // Progress bar
  const progress = await page.textContent('#progressLabel');
  console.log('✓ Progress:', progress);

  // Navigate all levels
  for (let i = 1; i <= 10; i++) {
    await page.locator(`#levelNav li:nth-child(${i}) button`).click();
    await page.waitForTimeout(80);
    const h2 = await page.textContent('#mainContent h2');
    if (!h2) errors.push(`Level ${i}: no title`);
  }
  console.log('✓ All 10 levels navigate');

  // Back button
  await page.click('#levelNav li:nth-child(1) button');
  await page.click('.paper-item');
  await page.click('#backBtn');
  await page.waitForTimeout(150);
  if ((await page.locator('.paper-list').count()) === 0) errors.push('Back button did not return to level view');
  else console.log('✓ Back button works');

  // Open first paper for pass tests
  await page.click('.paper-item');
  await page.waitForSelector('#passContent');
  const paperTitle = await page.textContent('.hero h2');
  console.log('✓ Paper view:', paperTitle?.slice(0, 50));

  // Three passes
  for (const pass of ['technical', 'research', 'concept']) {
    await page.click(`.pass-tab:has-text("${pass.charAt(0).toUpperCase() + pass.slice(1)}")`);
    await page.waitForTimeout(150);
    const content = await page.textContent('#passContent');
    if (!content || content.length < 20) errors.push(`Pass ${pass}: empty content`);
  }
  console.log('✓ Three passes switch');

  // Mark pass complete
  await page.click('button.btn-primary');
  await page.waitForTimeout(100);
  const badge = await page.textContent('.pass-tab.active');
  if (!badge?.includes('✓')) warnings.push('Mark complete may not show check on active tab');
  console.log('✓ Mark pass complete');

  // Superposition paper — rich content + charts
  await page.click('#levelNav li:nth-child(7) button');
  await page.waitForTimeout(100);
  const superPaper = page.locator('.paper-item').filter({ hasText: 'Toy Models of Superposition' });
  await superPaper.click();
  await page.waitForTimeout(300);

  const phase = await page.$('#phaseDiagram');
  const dim = await page.$('#dimChart');
  const five = await page.$('#fiveTwoDemo');
  const geo = await page.$('#geometryGraph');
  if (!phase) errors.push('Superposition: missing #phaseDiagram');
  if (!dim) errors.push('Superposition concept: missing #dimChart (wrong pass?)');
  
  await page.click('.pass-tab:has-text("Concept")');
  await page.waitForTimeout(400);
  if (!(await page.$('#phaseDiagram'))) errors.push('Superposition concept: phase diagram missing after tab switch');
  if (!(await page.$('#dimChart'))) errors.push('Superposition concept: dim chart missing');
  console.log('✓ Superposition rich content');

  // Quiz on PCA
  await page.click('#levelNav li:nth-child(1) button');
  await page.click('.paper-item');
  const quizBtn = page.locator('.quiz-opt').first();
  if (await quizBtn.count()) {
    await quizBtn.click();
    await page.waitForTimeout(100);
    const fb = page.locator('.quiz-feedback').first();
    if (!(await fb.isVisible())) errors.push('Quiz feedback not shown');
    console.log('✓ Quiz interaction');
  }

  // PDF link exists
  const pdfHref = await page.getAttribute('a:has(button:has-text("PDF"))', 'href');
  if (!pdfHref) warnings.push('PDF link missing on paper view');
  else console.log('✓ PDF href:', pdfHref);

  // localStorage persistence
  await page.evaluate(() => localStorage.setItem('setconca-mastery-v1-test', '1'));
  await page.reload({ waitUntil: 'networkidle' });
  console.log('✓ Page reload OK');

  // docs/ build parity
  const docsIndex = path.join(ROOT, 'docs', 'index.html');
  if (fs.existsSync(docsIndex)) {
    const page2 = await browser.newPage();
    page2.on('pageerror', (e) => errors.push('DOCS PAGE ERROR: ' + e.message));
    const docsUrl = 'file:///' + docsIndex.replace(/\\/g, '/');
    await page2.goto(docsUrl, { waitUntil: 'networkidle' });
    await page2.waitForSelector('#mainContent h2');
    console.log('✓ docs/ deploy copy loads');
    await page2.close();
  } else {
    warnings.push('docs/ not built — run deploy_pages.py');
  }

  await browser.close();

  console.log('\n--- RESULTS ---');
  if (warnings.length) {
    console.log('Warnings:');
    warnings.forEach((w) => console.log('  ⚠', w));
  }
  if (errors.length) {
    console.log('Errors:');
    errors.forEach((e) => console.log('  ✗', e));
    process.exit(1);
  }
  console.log('All checks passed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
