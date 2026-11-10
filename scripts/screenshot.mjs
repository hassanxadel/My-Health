import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '..');
const outDir = path.join(root, 'docs', 'screenshots');
const url = 'file:///' + path.join(root, 'index.html').replace(/\\/g, '/');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 720 } });
await page.goto(url);

// 01 - Goal tab, empty state
await page.screenshot({ path: path.join(outDir, '01-goal-empty.png') });

// 02 - Goal validation error
await page.click('#goalForm button[type="submit"]');
await page.screenshot({ path: path.join(outDir, '02-goal-validation-error.png') });

// Set a real goal
await page.fill('#fitnessGoal', 'Run 5k without stopping');
await page.click('#goalForm button[type="submit"]');
await page.screenshot({ path: path.join(outDir, '03-goal-set.png') });

// 04 - Workouts tab, empty state
await page.click('#tab-workouts');
await page.screenshot({ path: path.join(outDir, '04-workouts-empty.png') });

// Add a couple of workouts
await page.fill('#workout', '30 min easy run');
await page.click('#workoutForm button[type="submit"]');
await page.fill('#workout', 'Yoga, 20 min');
await page.click('#workoutForm button[type="submit"]');
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, '05-workouts-logged.png') });

// 06 - Progress tab
await page.click('#tab-progress');
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(outDir, '06-progress.png') });

// 07 - Dark theme
await page.click('#themeToggle');
await page.waitForTimeout(100);
await page.screenshot({ path: path.join(outDir, '07-dark-theme.png') });

await browser.close();
console.log('Screenshots written to', outDir);
