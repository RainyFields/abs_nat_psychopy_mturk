/***********************
 * 1Back_Category (MTurk-ready)
 * - 500 ms image, 2 s response window
 * - Saves responses to CSV (download on finish)
 ***********************/

import { core, data, sound, util, visual, hardware } from './lib/psychojs-2025.1.1.js';
const { PsychoJS } = core;
const { TrialHandler } = data;
const { Scheduler } = util;

// handy aliases
const { abs, sin, cos, PI: pi, sqrt } = Math;
const { round } = util;

// ---- Experiment metadata ----
let expName = '1back_category';
let expInfo = { participant: '' };
let PILOTING = util.getUrlParameters().has('__pilotToken');

// ---- CSV logger (works on static hosts like GitHub Pages/MTurk) ----
let csvRows = [];
const CSV_HEADER = [
  'participant','date','session','trial','frame',
  'stim','expected_key','key','correct','rt_sec'
];
function csvEscape(s) {
  if (s === null || s === undefined) return '';
  const str = String(s);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
function csvAddRow(row) {
  csvRows.push(row.map(csvEscape).join(','));
}
function csvInit() {
  csvRows = [CSV_HEADER.join(',')];
}
function csvDownload(filename='results.csv') {
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- Path normalization (IMPORTANT) ----
function normPath(p) {
  if (!p) return p;
  // remove any leading slash so '/resources/..' becomes 'resources/..'
  const s0 = String(p).replace(/^\/+/, '');
  if (s0.startsWith('resources/')) return s0;
  if (s0.startsWith('images/'))    return `resources/${s0}`;
  return `resources/${s0}`;
}

// ---- PsychoJS init ----
const psychoJS = new PsychoJS({
  debug: false
});

psychoJS.openWindow({
  fullscr: false,
  color: new util.Color([0, 0, 0]),
  units: 'height',
  waitBlanking: true
});

// Store frame rate of monitor if we can measure it
let expInfoReady = psychoJS.schedule(async () => {
  expInfo['date'] = util.MonotonicClock.getDateStr();
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2025.1.1';

  // Query participant id from URL ?participant=... else random
  const urlP = util.getUrlParameters();
  expInfo['participant'] = urlP.has('participant')
      ? urlP.get('participant') : (Math.floor(Math.random() * 1e9)).toString();

  // Estimate frame rate
  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
});

// ---- Global clocks ----
let globalClock;
let routineTimer;

// ---- Stimuli & input handles ----
let img;                    // visual.ImageStim created in experimentInit()
let kb;                     // hardware.Keyboard
let trialClock;             // per trial clock
let frameClock;             // per frame clock

// ---- Trial control ----
const csvUrl = 'resources/1back_category_trials.csv';
let trials;                 // TrialHandler
let trialIndex = -1;

// -------------------------------
// Async preload from CSV, then start
// -------------------------------
(async () => {
  try {
    // 1) Fetch CSV
    const csvText = await fetch(csvUrl).then(r => {
      if (!r.ok) throw new Error(`Could not fetch ${csvUrl} (${r.status})`);
      return r.text();
    });

    // 2) Parse CSV (simple parser: assumes no quoted commas in filenames)
    function parseCSV(text) {
      const lines = text.replace(/\r/g,'').split('\n').filter(l => l.trim().length > 0);
      const header = lines.shift().split(',').map(s => s.trim());
      const rows = lines.map(l => l.split(',').map(s => s.trim()));
      return { header, rows };
    }
    const { header, rows } = parseCSV(csvText);

    // 3) Collect unique paths from stim1..stim6
    const stimCols = ['stim1','stim2','stim3','stim4','stim5','stim6']
      .map(k => header.indexOf(k))
      .filter(i => i >= 0);

    const uniquePaths = new Set();
    for (const r of rows) {
      for (const i of stimCols) {
        const raw = (r[i] || '').trim();
        if (!raw) continue;
        uniquePaths.add(normPath(raw));
      }
    }

    // 4) Build resources list (CSV + all images)
    const resources = [{ name: csvUrl, path: csvUrl }];
    for (const p of uniquePaths) {
      resources.push({ name: p, path: p });
    }

    // 5) Start PsychoJS (preload)
    psychoJS.start({
      expName: expName,
      expInfo: expInfo,
      resources: resources
    });

    // 6) When resources are ready, schedule the experiment
    const flowScheduler = new Scheduler(psychoJS);
    const dialogCancelScheduler = new Scheduler(psychoJS);

    psychoJS.schedule(expInfoReady);
    psychoJS.scheduleCondition(
      () => psychoJS.gui.dialogComponent.button === 'OK',
      flowScheduler,
      dialogCancelScheduler
    );

    // Flow
    flowScheduler.add(experimentInit);
    flowScheduler.add(() => makeTrialHandler(csvUrl));
    flowScheduler.add(trialLoopBegin);
    flowScheduler.add(trialLoopEnd);
    flowScheduler.add(quitPsychoJS, '', true);

    // If user cancels
    dialogCancelScheduler.add(quitPsychoJS, 'User cancelled the experiment.', false);

  } catch (err) {
    console.error(err);
    alert(`Preload error: ${err.message}`);
  }
})();

// -------------------------------
// Experiment init
// -------------------------------
async function experimentInit() {
  // clocks
  globalClock = new util.Clock();
  routineTimer = new util.CountdownTimer();

  trialClock = new util.Clock();
  frameClock = new util.Clock();

  // keyboard (x for match, y for non-match)
  kb = new hardware.Keyboard({ psychoJS, clock: new util.Clock(), waitForStart: true });

  // image stim
  img = new visual.ImageStim({
    win: psychoJS.window,
    name: 'img',
    units: 'height',
    image: undefined,
    mask: undefined,
    ori: 0.0,
    pos: [0, 0],
    size: [0.6, 0.6],
    color: new util.Color([1, 1, 1]),
    opacity: 1.0,
    flipHoriz: false,
    flipVert: false,
    texRes: 128,
    interpolate: true,
    depth: 0.0
  });

  // CSV logger header
  csvInit();

  // Minimal on-screen text to signal load (optional)
  return Scheduler.Event.NEXT;
}

// Build the TrialHandler using the CSV directly.
// We keep PsychoJS’s native importer so it binds each row as a dict.
async function makeTrialHandler(csvUrl) {
  trials = new TrialHandler({
    psychoJS,
    nReps: 1,
    method: TrialHandler.Method.SEQUENTIAL,
    extraInfo: expInfo,
    originPath: undefined,
    trialList: csvUrl, // <- uses the loaded CSV file (already preloaded)
    seed: undefined,
    name: 'trials'
  });
  psychoJS.experiment.addLoop(trials);
  return Scheduler.Event.NEXT;
}

// Trial loop begin
async function trialLoopBegin() {
  trialIndex = -1;

  trials.forEach(() => {
    psychoJS.schedule(trialRoutineBegin);
    psychoJS.schedule(trialRoutineEachFrame);
    psychoJS.schedule(trialRoutineEnd);
  });

  return Scheduler.Event.NEXT;
}

// Trial loop end
async function trialLoopEnd() {
  psychoJS.experiment.removeLoop(trials);

  // Offer CSV download at the end
  csvDownload(`${expName}_${expInfo['participant']}_${expInfo['date']}.csv`);

  return Scheduler.Event.NEXT;
}

// -------------------------------
// Per-trial routine
// -------------------------------
let currentTrial;      // dict with keys from CSV
let frameIdx;          // 0..5
let frameActive;       // bool
let frameStartedAt;    // time
let expectKey;         // 'x' for match, 'y' for non-match
let lastCategory;      // derived from previous frame’s stim
let currentCategory;   // derived
let keyCaptured;       // first key recorded this frame
let rtCaptured;        // rt in seconds

// Helper: get category from filename before first '_' OR up to first rx/ry token
// e.g., "breed_pug_rx+..." -> "breed_pug", "_014_rx+..." -> "_014" (you can adapt to your category scheme)
function categoryFromPath(p) {
  const base = p.split('/').pop(); // filename
  const upToRx = base.split('_rx')[0];
  return upToRx;
}

// Start trial
async function trialRoutineBegin() {
  trialIndex += 1;
  currentTrial = trials.getTrial(trialIndex);

  // Prepare frame state
  frameIdx = -1;
  frameActive = false;
  lastCategory = null;

  // Clear keyboard buffer at trial start
  kb.clock.reset();
  kb.clearEvents();

  // Per-trial clock
  trialClock.reset();

  return Scheduler.Event.NEXT;
}

// Each frame (called ~every screen refresh)
async function trialRoutineEachFrame() {
  // If no frame is active, advance to next frame
  if (!frameActive) {
    frameIdx += 1;
    if (frameIdx >= 6) {
      // all frames of this trial are done
      return Scheduler.Event.NEXT;
    }

    // Load stim path from columns stim1..stim6
    const stimKey = `stim${frameIdx + 1}`;
    let stimPath = normPath(currentTrial[stimKey] || '');

    // Safety: if missing, skip gracefully
    if (!stimPath) {
      console.warn(`Missing ${stimKey} in row ${trialIndex + 1}, skipping frame.`);
      frameActive = false; // immediately progress
      return Scheduler.Event.FLIP_REPEAT;
    }

    // Set expected key: from frame 2 on, match to previous category => 'x' else 'y'
    currentCategory = categoryFromPath(stimPath);
    expectKey = (frameIdx > 0 && lastCategory && currentCategory === lastCategory) ? 'x' : 'y';
    lastCategory = currentCategory;

    // Present image
    img.setImage(stimPath);
    img.setAutoDraw(true);

    // Mark frame start
    frameStartedAt = frameClock.reset();  // 0 at frame onset
    keyCaptured = null;
    rtCaptured = null;
    frameActive = true;

    // Clear old events
    kb.clearEvents();
  }

  // Collect keypress during the 2s window
  const keys = kb.getKeys({ keyList: ['x', 'y'], waitRelease: false });
  if (!keyCaptured && keys.length > 0) {
    keyCaptured = keys[0].name;
    rtCaptured = keys[0].rt; // seconds since kb.clock reset at last clear
  }

  // Timing: image shown for 0.5s; response window is 2.0s
  const t = frameClock.getTime();
  const imgOn = t < 0.5;

  if (!imgOn) {
    img.setAutoDraw(false);
  }

  if (t >= 2.0) {
    // frame ends: log a row
    const correct = (keyCaptured ? (keyCaptured === expectKey) : false);

    csvAddRow([
      expInfo['participant'],
      expInfo['date'],
      1,                       // session (fixed 1 here)
      trialIndex + 1,          // 1-based trial number
      frameIdx + 1,            // 1..6
      currentTrial[`stim${frameIdx + 1}`] || '',
      expectKey,
      keyCaptured || '',
      correct ? 1 : 0,
      (rtCaptured != null ? rtCaptured.toFixed(3) : '')
    ]);

    // done with this frame
    frameActive = false;
  }

  // Keep flipping frames until trial finishes
  return (frameIdx >= 6) ? Scheduler.Event.NEXT : Scheduler.Event.FLIP_REPEAT;
}

// End trial
async function trialRoutineEnd() {
  img.setAutoDraw(false);
  return Scheduler.Event.NEXT;
}

// -------------------------------
// Quit
// -------------------------------
async function quitPsychoJS(message, isCompleted) {
  if (message) console.log(message);
  // Also attach CSV to experiment data object (just in case you pipe it somewhere)
  psychoJS.experiment.addData('client_csv', csvRows.join('\n'));
  psychoJS.window.close();
  psychoJS.quit({ message: message, isCompleted: isCompleted });
  return Scheduler.Event.QUIT;
}
