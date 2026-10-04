const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

async function recordDemo() {
  console.log('🎬 Initializing ApplyFlow 2-Minute Judge Demo Recording...');

  const videosDir = path.join(__dirname, 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: videosDir,
      size: { width: 1280, height: 720 },
    },
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  // Inject a natural, smooth virtual mouse cursor & continuous frame ticker
  await page.addInitScript(() => {
    // Keep Chrome compositor actively painting at constant 60fps frame rate
    const keepPainting = () => {
      const ticker = document.getElementById('heartbeat-ticker');
      if (ticker) {
        ticker.style.opacity = ticker.style.opacity === '0.99' ? '1' : '0.99';
      }
      requestAnimationFrame(keepPainting);
    };

    window.addEventListener('DOMContentLoaded', () => {
      // Heartbeat ticker to ensure 1:1 real-time video frame timestamps
      const ticker = document.createElement('div');
      ticker.id = 'heartbeat-ticker';
      ticker.style.position = 'fixed';
      ticker.style.bottom = '1px';
      ticker.style.right = '1px';
      ticker.style.width = '2px';
      ticker.style.height = '2px';
      ticker.style.opacity = '1';
      ticker.style.pointerEvents = 'none';
      ticker.style.zIndex = '9999999';
      document.body.appendChild(ticker);
      requestAnimationFrame(keepPainting);

      // Virtual cursor
      const cursor = document.createElement('div');
      cursor.id = 'virtual-cursor';
      cursor.style.position = 'fixed';
      cursor.style.top = '0px';
      cursor.style.left = '0px';
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.zIndex = '999999';
      cursor.style.pointerEvents = 'none';
      cursor.style.transition = 'transform 0.04s linear';
      cursor.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
          <path d="M4 3L11 20L14 13L21 10L4 3Z" fill="#2563EB" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
        </svg>
        <div id="cursor-click-ring" style="position: absolute; top: -8px; left: -8px; width: 40px; height: 40px; border-radius: 50%; border: 3px solid #3B82F6; opacity: 0; transform: scale(0.4); transition: all 0.25s cubic-bezier(0.1, 0.9, 0.2, 1); pointer-events: none;"></div>
      `;
      document.body.appendChild(cursor);
    });
  });

  let curX = 640;
  let curY = 360;

  async function moveCursor(toX, toY, durationMs = 450) {
    const boundedX = Math.max(10, Math.min(1270, toX));
    const boundedY = Math.max(10, Math.min(710, toY));
    const steps = Math.max(10, Math.floor(durationMs / 16));
    const startX = curX;
    const startY = curY;
    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const eased = easeInOutCubic(progress);
      const x = Math.round(startX + (boundedX - startX) * eased);
      const y = Math.round(startY + (boundedY - startY) * eased);
      await page.evaluate(({ cx, cy }) => {
        const c = document.getElementById('virtual-cursor');
        if (c) c.style.transform = `translate(${cx}px, ${cy}px)`;
      }, { cx: x, cy: y });
      await page.waitForTimeout(16);
    }
    curX = boundedX;
    curY = boundedY;
  }

  async function clickElement(selector, preHoverMs = 300) {
    try {
      const el = await page.$(selector);
      if (!el) {
        console.warn(`Selector not found: ${selector}`);
        return false;
      }
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const box = await el.boundingBox();
      if (box) {
        const targetX = Math.round(box.x + box.width / 2);
        const targetY = Math.round(box.y + box.height / 2);
        await moveCursor(targetX, targetY, 400);
        if (preHoverMs > 0) await page.waitForTimeout(preHoverMs);
        await page.evaluate(() => {
          const ring = document.getElementById('cursor-click-ring');
          if (ring) {
            ring.style.opacity = '1';
            ring.style.transform = 'scale(1.3)';
            setTimeout(() => {
              ring.style.opacity = '0';
              ring.style.transform = 'scale(0.4)';
            }, 220);
          }
        });
      }
      await el.click();
      await page.waitForTimeout(250);
      return true;
    } catch (err) {
      console.warn(`Error clicking selector: ${selector}`, err.message);
      return false;
    }
  }

  // ============================================================
  // 00:00–00:08 (8s) OPENING: APPLYFLOW LANDING
  // ============================================================
  console.log('📍 [00:00 - 00:08] OPENING: ApplyFlow Landing Page');
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('text=Submit Once. Validate Automatically.');
  await page.waitForTimeout(3000);

  // Smoothly hover and click "Try Live Demo"
  console.log('   👆 Hovering & Clicking [Try Live Demo]');
  const tryLiveDemo = await clickElement('button:has-text("Try Live Demo"), a:has-text("Try Live Demo")', 400);
  if (!tryLiveDemo) {
    await clickElement('button:has-text("View Interactive Demo")', 400);
  }
  await page.waitForTimeout(2500);

  // ============================================================
  // 00:08–00:18 (10s) APPLICANT DASHBOARD
  // ============================================================
  console.log('📍 [00:08 - 00:18] APPLICANT DASHBOARD: 1 Requires Action, Health 64');
  await page.waitForSelector('text=Good morning');
  // Hover over Next Action banner
  await moveCursor(380, 195, 500);
  await page.waitForTimeout(1800);

  // Hover over KPI stats: Active Applications (1), Correction Required (1)
  await moveCursor(280, 270, 450);
  await page.waitForTimeout(1200);
  await moveCursor(480, 270, 450);
  await page.waitForTimeout(1200);

  // Click [View Reasons] to navigate into Validation Center
  console.log('   👆 Clicking [View Reasons] to open Validation Center');
  const viewReasonsBtn = await clickElement('button:has-text("View Reasons")', 400);
  if (!viewReasonsBtn) {
    await clickElement('button:has-text("Inspect Validation Rules")', 400);
  }
  await page.waitForTimeout(2500);

  // ============================================================
  // 00:18–00:30 (12s) APPLICATION OVERVIEW & DNA
  // ============================================================
  console.log('📍 [00:18 - 00:30] APPLICATION OVERVIEW: APP-10284, Health 64 / 100');
  await page.waitForSelector('text=APP-10284');
  // Hover over Health Score card
  await moveCursor(240, 270, 500);
  await page.waitForTimeout(1800);

  // Hover over 6-Axis DNA Radar
  await moveCursor(560, 390, 600);
  await page.waitForTimeout(2500);

  // Click [7-Layer X-Ray] in header
  console.log('   👆 Opening [7-Layer X-Ray] Scanner');
  await clickElement('button:has-text("7-Layer X-Ray")', 400);
  await page.waitForTimeout(2500);

  // ============================================================
  // 00:30–00:43 (13s) APPLICATION X-RAY
  // ============================================================
  console.log('📍 [00:30 - 00:43] APPLICATION X-RAY: 7-Layer Decomposition');
  await page.waitForSelector('text=Application X-Ray Scanner');
  // Inspect Layer 03 Extracted Key-Values
  console.log('   👆 Selecting Layer 03: Extracted Key-Values');
  await clickElement('button:has-text("L-03"), button:has-text("Layer 03")', 400);
  await page.waitForTimeout(3000);

  // Inspect Layer 05 Anomaly & Issues Matrix
  console.log('   👆 Selecting Layer 05: Anomaly & Issues Matrix');
  await clickElement('button:has-text("L-05"), button:has-text("Layer 05")', 400);
  await page.waitForTimeout(3500);

  // Close X-Ray Modal via Close Button
  console.log('   👆 Closing X-Ray Scanner');
  const closedModal = await clickElement('[data-testid="modal-close-button"], button[aria-label="Close modal"]', 300);
  if (!closedModal) {
    await page.keyboard.press('Escape');
  }
  await page.waitForSelector('text=Application X-Ray Scanner', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // ============================================================
  // 00:43–00:55 (12s) VALIDATION CENTER & DECISION CHAIN
  // ============================================================
  console.log('📍 [00:43 - 00:55] VALIDATION CENTER: 3 Discrepancies');
  // Scroll to show the issues
  await page.evaluate(() => window.scrollBy({ top: 160, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  // Click [Decision Chain] trace on Name Mismatch issue
  console.log('   👆 Opening [Decision Chain] vertical trace');
  await clickElement('[data-testid="decision-chain-btn"], button:has-text("Decision Chain")', 400);
  await page.waitForSelector('text=Decision Chain Trace', { timeout: 8000 });
  await page.waitForTimeout(4000);

  // Close Decision Chain Drawer
  console.log('   👆 Closing Decision Chain Drawer');
  const closedChain = await clickElement('[data-testid="close-decision-chain"], button[aria-label="Close Decision Chain Drawer"]', 300);
  if (!closedChain) {
    await page.keyboard.press('Escape');
  }
  await page.waitForSelector('text=Decision Chain Trace', { state: 'detached', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // ============================================================
  // 00:55–01:05 (10s) AI EXPLANATION & ROUTING
  // ============================================================
  console.log('📍 [00:55 - 01:05] AI EXPLANATION: Why Was This Flagged?');
  // Hover over the AI Explanation card
  await moveCursor(450, 480, 500);
  await page.waitForTimeout(2500);

  // Click [Fix in Correction Workspace]
  console.log('   👆 Clicking [Fix in Correction Workspace]');
  const clickedFix = await clickElement('[data-testid="fix-in-correction-btn"], button:has-text("Fix in Correction Workspace")', 400);
  if (!clickedFix) {
    await clickElement('button:has-text("Open Correction Workspace")', 400);
  }
  await page.waitForTimeout(2500);

  // ============================================================
  // 01:05–01:20 (15s) CORRECTION WORKSPACE: 3 REMEDIATIONS
  // ============================================================
  console.log('📍 [01:05 - 01:20] CORRECTION WORKSPACE: Resolving 3 Discrepancies');
  await page.waitForSelector('text=Remediation Checklist', { timeout: 12000 });

  // Fix 1: Name Mismatch (Rahul Kumar -> Rahul Sharma)
  console.log('   👆 Remediating 1: Apply Legal Name (Rahul Sharma)');
  await clickElement('button:has-text("Apply Legal Name")', 400);
  await page.waitForTimeout(2500);

  // Fix 2: Address Proof Document
  console.log('   👆 Remediating 2: Upload Valid Utility Bill');
  await clickElement('button:has-text("Upload Valid Utility Bill"), button:has-text("Drop replacement")', 400);
  await page.waitForTimeout(3000);

  // Fix 3: Phone Number
  console.log('   👆 Remediating 3: Apply Phone Number (9876543210)');
  await clickElement('button:has-text("Apply Phone Number"), button:has-text("Apply Valid Phone Number")', 400);
  await page.waitForTimeout(2500);

  // All 3 resolved! Click [Revalidate Application Now]
  console.log('   👆 All 3 Issues Resolved! Clicking [Revalidate Application Now]');
  await clickElement('button:has-text("Revalidate Application")', 400);
  await page.waitForTimeout(2000);

  // ============================================================
  // 01:20–01:33 (13s) REVALIDATION — HERO MOMENT
  // ============================================================
  console.log('📍 [01:20 - 01:33] REVALIDATION HERO MOMENT: 64 → 72 → 86 → 98!');
  // Wait for 6 stages to complete
  await page.waitForSelector('text=Application Successfully Validated', { timeout: 15000 });
  // Savor the animated progression: 64 → 72 → 86 → 98 and VALIDATED status
  await moveCursor(640, 360, 500);
  await page.waitForTimeout(4500);

  // ============================================================
  // 01:33–01:42 (9s) CATEGORIZATION & ROUTING
  // ============================================================
  console.log('📍 [01:33 - 01:42] CATEGORIZATION: Category: STANDARD • Route: STANDARD PROCESSING');
  await moveCursor(640, 480, 500);
  await page.waitForTimeout(2500);

  // Click [Switch to Officer Queue to Approve]
  console.log('   👆 Clicking [Switch to Officer Queue to Approve]');
  await clickElement('button:has-text("Switch to Officer Queue to Approve")', 400);
  await page.waitForTimeout(3000);

  // ============================================================
  // 01:42–01:52 (10s) OFFICER CONTROL ROOM / INTAKE QUEUE
  // ============================================================
  console.log('📍 [01:42 - 01:52] OFFICER CONTROL ROOM: Metrics 128, 23, 17, 8, 4, 76');
  await page.waitForSelector('text=128');
  // Hover over KPI stats: Applications 128, Processing 23, Correction 17, Completed 76
  await moveCursor(280, 180, 500);
  await page.waitForTimeout(1200);
  await moveCursor(640, 180, 500);
  await page.waitForTimeout(1500);

  // Locate APP-10284 in Queue Table and click Review
  console.log('   👆 Locating APP-10284 in Operations Queue');
  await page.evaluate(() => window.scrollBy({ top: 150, behavior: 'smooth' }));
  await page.waitForTimeout(1200);
  await clickElement('tr:has-text("APP-10284") button:has-text("Review"), button:has-text("Review")', 400);
  await page.waitForTimeout(2500);

  // ============================================================
  // 01:52–01:58 (6s) OFFICER REVIEW & ADJUDICATION
  // ============================================================
  console.log('📍 [01:52 - 01:58] OFFICER REVIEW: Documents ✓, Validation ✓, Corrections ✓');
  await page.waitForSelector('text=Officer Adjudication');
  await moveCursor(980, 320, 500);
  await page.waitForTimeout(1500);

  // Click [Approve & Issue Certificate]
  console.log('   👆 Clicking [Approve & Issue Certificate]');
  await clickElement('button:has-text("Approve & Issue Certificate")', 400);
  await page.waitForTimeout(3000);

  // ============================================================
  // 01:58–02:00 (5s) FINAL RESULT & BRAND OUTRO
  // ============================================================
  console.log('📍 [01:58 - 02:00] FINAL RESULT: Applicant Notification & Brand Outro');
  // Open Notifications to show completed state
  console.log('   👆 Opening Notifications Drawer');
  await clickElement('button[title="Notifications"]', 400);
  await page.waitForTimeout(2500);

  // Click Brand Logo to finish on clean ApplyFlow brand outro
  console.log('   👆 Returning to ApplyFlow Brand Outro');
  await clickElement('span:has-text("ApplyFlow")', 350);
  await page.waitForTimeout(3500);

  console.log('🏁 2-Minute Judge Demo Recording Finished Successfully!');

  await page.close();
  await context.close();
  await browser.close();

  // Find latest webm file in videos/ and remux to official artifact
  const files = fs.readdirSync(videosDir).filter(f => f.endsWith('.webm') && !f.includes('ApplyFlow_2Minute_Judge_Demo'));
  if (files.length > 0) {
    const latest = files[files.length - 1];
    const ffmpegPath = 'C:\\Users\\Admin\\AppData\\Local\\ms-playwright\\ffmpeg-1011\\ffmpeg-win64.exe';
    const rawPath = path.join(videosDir, latest);
    const finalPath = path.join(videosDir, 'ApplyFlow_2Minute_Judge_Demo.webm');
    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
    
    console.log('⚙️ Remuxing WebM with Matroska duration headers...');
    try {
      execSync(`"${ffmpegPath}" -i "${rawPath}" -c copy "${finalPath}"`, { stdio: 'inherit' });
      fs.unlinkSync(rawPath);
    } catch (e) {
      console.warn('Remux warning, falling back to rename:', e.message);
      fs.renameSync(rawPath, finalPath);
    }
    console.log(`🎥 Artifact Ready: ${finalPath}`);
  }
}

recordDemo().catch((err) => {
  console.error('❌ Recording failed:', err);
  process.exit(1);
});
