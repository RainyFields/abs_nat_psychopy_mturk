/***********************
 * 1Back_Category (fixed)
 * - 500 ms image, 2 s response window
 * - Validates image paths to avoid preload crashes
 ***********************/

import { core, data, sound, util, visual, hardware } from './lib/psychojs-2025.1.1.js';
const { PsychoJS } = core;
const { TrialHandler, MultiStairHandler } = data;
const { Scheduler } = util;

// ---- Experiment metadata ----
let expName = '1back_category';
let expInfo = { participant: '' };
let PILOTING = util.getUrlParameters().has('__pilotToken');

const ASSETS_DIR = 'resources';
const IMG_DIR = `${ASSETS_DIR}/images`;
const FALLBACK = `${IMG_DIR}/157_Chairs.png`;

function normPath(p) {
  if (!p) return '';
  p = String(p).trim();
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;               // absolute URL
  if (p.startsWith(`${ASSETS_DIR}/`)) return p;         // already ok
  if (p.startsWith('images/')) return `${ASSETS_DIR}/${p}`; // images/... -> resources/images/...
  if (!p.includes('/')) return `${IMG_DIR}/${p}`;       // bare filename
  return `${ASSETS_DIR}/${p}`;                          // any other relative
}

// --- Resource preload (collect from CSV + add fallback) ---
const TRIALS_CSV = 'resources/1back_category_trials.csv';
const ALWAYS_RESOURCES = ['resources/images/157_Chairs.png']; // your fallback

async function collectImagePathsFromCSV(csvPath) {
  const res = await fetch(csvPath, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${csvPath}: ${res.status}`);
  const text = await res.text();

  // very light CSV parse (assumes comma-separated, header includes stim1..stim6)
  const lines = text.split(/\r?\n/).filter(l => l.trim().length);
  const header = lines[0].split(',').map(s => s.trim().toLowerCase());
  const stimCols = header
    .map((h, i) => ({ h, i }))
    .filter(({ h }) => /^stim[1-6]$/.test(h))
    .map(({ i }) => i);

  const paths = new Set(ALWAYS_RESOURCES);
  for (let r = 1; r < lines.length; r++) {
    const cols = lines[r].split(',');
    stimCols.forEach(ci => {
      const p = (cols[ci] || '').trim();
      if (p) paths.add(p);
    });
  }
  return Array.from(paths);
}



// ---- init psychoJS ----
const psychoJS = new PsychoJS({ debug: true });

// ---- open window ----
psychoJS.openWindow({
  fullscr: false,
  color: new util.Color([0, 0, 0]),
  units: 'height',
  waitBlanking: true,
  backgroundImage: '',
  backgroundFit: 'none',
});

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);



(async function bootstrap() {
  const csvPathsRaw = await collectImagePathsFromCSV(TRIALS_CSV); // returns strings from CSV
  const allPaths = Array.from(new Set([
    'resources/images/157_Chairs.png',   // fallback
    ...csvPathsRaw.map(normPath)
  ]));

  const resources = [
    { name: TRIALS_CSV, path: TRIALS_CSV },      // so TrialHandler can import it
    ...allPaths.map(p => ({ name: p, path: p })),
  ];

  // 3) Schedule GUI & flow *before* start (Builder style)
  psychoJS.schedule(psychoJS.gui.DlgFromDict({ dictionary: expInfo, title: expName }));
  psychoJS.scheduleCondition(
    () => (psychoJS.gui.dialogComponent.button === 'OK'),
    flowScheduler,
    dialogCancelScheduler
  );

  flowScheduler.add(updateInfo);
  flowScheduler.add(experimentInit);
  flowScheduler.add(GlobalsRoutineBegin());
  flowScheduler.add(GlobalsRoutineEachFrame());
  flowScheduler.add(GlobalsRoutineEnd());
  const trialsLoopScheduler = new Scheduler(psychoJS);
  flowScheduler.add(trialsLoopBegin(trialsLoopScheduler));
  flowScheduler.add(trialsLoopScheduler);
  flowScheduler.add(trialsLoopEnd);
  flowScheduler.add(ITIRoutineBegin());
  flowScheduler.add(ITIRoutineEachFrame());
  flowScheduler.add(ITIRoutineEnd());
  flowScheduler.add(quitPsychoJS, '', true);

  dialogCancelScheduler.add(quitPsychoJS, '', false);

  // 4) Start WITH resources so they’re preloaded
  psychoJS.start({ expName, expInfo, resources });
  psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.EXP);
})();



// =========================
// Globals & helpers
// =========================
var currentLoop;
var frameDur;

async function updateInfo() {
  currentLoop = psychoJS.experiment;
  expInfo['date'] = util.MonotonicClock.getDateStr();
  expInfo['expName'] = expName;
  expInfo['psychopyVersion'] = '2025.1.1';
  expInfo['OS'] = window.navigator.platform;

  expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
  frameDur = (typeof expInfo['frameRate'] !== 'undefined')
    ? 1.0 / Math.round(expInfo['frameRate'])
    : 1.0 / 60.0;

  util.addInfoFromUrl(expInfo);

  psychoJS.experiment.dataFileName = (("." + "/") + `data/${expInfo["participant"]}_${expName}_${expInfo["date"]}`);
  psychoJS.experiment.field_separator = '\t';

  return Scheduler.Event.NEXT;
}

// =========================
// Components & state
// =========================
var GlobalsClock;
var prevSession;
var frameIdx;
var stimPaths;
var actKeys;

var SessionIntroClock;
var sessText;
var sessKey;

var TrialIntroClock;
var trialText;
var trialKey;

var FrameClock;
var img;
var resp;

var ITIClock;
var itiText;
var itiKey;

// local ITI helper clock (no globals() magic)
var itiClock;

var globalClock;
var routineTimer;

async function experimentInit() {
  // ---- Globals Routine ----
  GlobalsClock = new util.Clock();
  prevSession = null;
  frameIdx = -1;
  stimPaths = [];
  actKeys = [];

  // ---- SessionIntro ----
  SessionIntroClock = new util.Clock();
  sessText = new visual.TextStim({
    win: psychoJS.window,
    name: 'sessText',
    text: 'Press Enter to start',
    font: 'Open Sans',
    pos: [0, 0], draggable: false, height: 0.05,
    languageStyle: 'LTR',
    color: new util.Color('white'),
    depth: 0.0
  });
  sessKey = new core.Keyboard({ psychoJS, clock: new util.Clock(), waitForStart: true });

  // ---- TrialIntro ----
  TrialIntroClock = new util.Clock();
  trialText = new visual.TextStim({
    win: psychoJS.window,
    name: 'trialText',
    text: 'Press Enter to start the trial',
    font: 'Open Sans',
    pos: [0, 0], draggable: false, height: 0.05,
    languageStyle: 'LTR',
    color: new util.Color('white'),
    depth: 0.0
  });
  trialKey = new core.Keyboard({ psychoJS, clock: new util.Clock(), waitForStart: true });

  // ---- Frame ----
  FrameClock = new util.Clock();
  img = new visual.ImageStim({
    win: psychoJS.window,
    name: 'img',
    image: 'resources/images/157_Chairs.png',          // ⟵ was '157_Chairs.png'
    anchor: 'center',
    ori: 0.0,
    pos: [0, 0],
    draggable: false,
    size: [0.5, 0.5],
    color: new util.Color([1, 1, 1]),
    interpolate: true,
    depth: 0.0
  });

  resp = new core.Keyboard({ psychoJS, clock: new util.Clock(), waitForStart: true });

  // ---- ITI ----
  ITIClock = new util.Clock();
  itiText = new visual.TextStim({
    win: psychoJS.window,
    name: 'itiText',
    text: 'Next trial in 5s - press Enter to start now',
    font: 'Open Sans',
    pos: [0, 0], draggable: false, height: 0.05,
    languageStyle: 'LTR',
    color: new util.Color('white'),
    depth: 0.0
  });
  itiKey = new core.Keyboard({ psychoJS, clock: new util.Clock(), waitForStart: true });

  // Local ITI timer (we manage it ourselves)
  itiClock = new util.Clock();

  // ---- timers ----
  globalClock = new util.Clock();
  routineTimer = new util.CountdownTimer();

  return Scheduler.Event.NEXT;
}

// =========================
// Routines
// =========================
var t;
var frameN;
var continueRoutine;
var routineForceEnded;

var GlobalsMaxDurationReached;
var GlobalsMaxDuration;
var GlobalsComponents;

function GlobalsRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);

    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;

    GlobalsClock.reset();
    routineTimer.reset();
    GlobalsMaxDurationReached = false;

    psychoJS.experiment.addData('Globals.started', globalClock.getTime());
    GlobalsMaxDuration = null;

    GlobalsComponents = [];
    GlobalsComponents.forEach(c => { if ('status' in c) c.status = PsychoJS.Status.NOT_STARTED; });

    return Scheduler.Event.NEXT;
  };
}

function GlobalsRoutineEachFrame() {
  return async function () {
    t = GlobalsClock.getTime();
    frameN += 1;

    // quit?
    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }

    if (!continueRoutine) {
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }

    continueRoutine = false;
    GlobalsComponents.forEach(c => {
      if ('status' in c && c.status !== PsychoJS.Status.FINISHED)
        continueRoutine = true;
    });

    if (continueRoutine) return Scheduler.Event.FLIP_REPEAT;
    return Scheduler.Event.NEXT;
  };
}

function GlobalsRoutineEnd(snapshot) {
  return async function () {
    GlobalsComponents.forEach(c => { if (typeof c.setAutoDraw === 'function') c.setAutoDraw(false); });
    psychoJS.experiment.addData('Globals.stopped', globalClock.getTime());
    routineTimer.reset();

    if (currentLoop === psychoJS.experiment) psychoJS.experiment.nextEntry(snapshot);
    return Scheduler.Event.NEXT;
  };
}

// ------------- Trials (outer loop) -------------
var trials;
function trialsLoopBegin(trialsLoopScheduler, snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);

    trials = new TrialHandler({
      psychoJS,
      nReps: 1, method: TrialHandler.Method.SEQUENTIAL,
      extraInfo: expInfo, originPath: undefined,
      trialList: 'resources/1back_category_trials.csv',
      seed: undefined, name: 'trials'
    });
    psychoJS.experiment.addLoop(trials);
    currentLoop = trials;

    trials.forEach(function () {
      snapshot = trials.getSnapshot();

      trialsLoopScheduler.add(importConditions(snapshot));
      trialsLoopScheduler.add(SessionIntroRoutineBegin(snapshot));
      trialsLoopScheduler.add(SessionIntroRoutineEachFrame());
      trialsLoopScheduler.add(SessionIntroRoutineEnd(snapshot));

      trialsLoopScheduler.add(TrialIntroRoutineBegin(snapshot));
      trialsLoopScheduler.add(TrialIntroRoutineEachFrame());
      trialsLoopScheduler.add(TrialIntroRoutineEnd(snapshot));

      const framesLoopScheduler = new Scheduler(psychoJS);
      trialsLoopScheduler.add(framesLoopBegin(framesLoopScheduler, snapshot));
      trialsLoopScheduler.add(framesLoopScheduler);
      trialsLoopScheduler.add(framesLoopEnd);

      trialsLoopScheduler.add(trialsLoopEndIteration(trialsLoopScheduler, snapshot));
    });

    return Scheduler.Event.NEXT;
  };
}

async function trialsLoopEnd() {
  psychoJS.experiment.removeLoop(trials);
  if (psychoJS.experiment._unfinishedLoops.length > 0)
    currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
  else
    currentLoop = psychoJS.experiment;
  return Scheduler.Event.NEXT;
}

function trialsLoopEndIteration(scheduler, snapshot) {
  return async function () {
    if (typeof snapshot !== 'undefined') {
      if (snapshot.finished) {
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
      return Scheduler.Event.NEXT;
    }
  };
}

// ------------- Frames (inner loop) -------------
var frames;
function framesLoopBegin(framesLoopScheduler, snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);

    frames = new TrialHandler({
      psychoJS,
      nReps: 6, method: TrialHandler.Method.SEQUENTIAL,
      extraInfo: expInfo, originPath: undefined,
      trialList: undefined,
      seed: undefined, name: 'frames'
    });
    psychoJS.experiment.addLoop(frames);
    currentLoop = frames;

    frames.forEach(function () {
      snapshot = frames.getSnapshot();

      framesLoopScheduler.add(importConditions(snapshot));
      framesLoopScheduler.add(FrameRoutineBegin(snapshot));
      framesLoopScheduler.add(FrameRoutineEachFrame());
      framesLoopScheduler.add(FrameRoutineEnd(snapshot));
      framesLoopScheduler.add(framesLoopEndIteration(framesLoopScheduler, snapshot));
    });

    return Scheduler.Event.NEXT;
  };
}

async function framesLoopEnd() {
  psychoJS.experiment.removeLoop(frames);
  if (psychoJS.experiment._unfinishedLoops.length > 0)
    currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
  else
    currentLoop = psychoJS.experiment;
  return Scheduler.Event.NEXT;
}

function framesLoopEndIteration(scheduler, snapshot) {
  return async function () {
    if (typeof snapshot !== 'undefined') {
      if (snapshot.finished) {
        if (psychoJS.experiment.isEntryEmpty()) {
          psychoJS.experiment.nextEntry(snapshot);
        }
        scheduler.stop();
      } else {
        psychoJS.experiment.nextEntry(snapshot);
      }
      return Scheduler.Event.NEXT;
    }
  };
}

// =========================
// SessionIntro
// =========================
var SessionIntroMaxDurationReached;
var _sessKey_allKeys;
var SessionIntroMaxDuration;
var SessionIntroComponents;

function SessionIntroRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);

    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;

    SessionIntroClock.reset();
    routineTimer.reset();
    SessionIntroMaxDurationReached = false;

    sessKey.keys = undefined;
    sessKey.rt = undefined;
    _sessKey_allKeys = [];

    // show only when session changes or at the very start
    if ((typeof prevSession === 'undefined') || (prevSession === null) || (session !== prevSession)) {
      continueRoutine = true;
      sessText.setText(`Session: ${session}\nPress Enter to start`);
    } else {
      continueRoutine = false;
    }

    psychoJS.experiment.addData('SessionIntro.started', globalClock.getTime());
    SessionIntroMaxDuration = null;

    SessionIntroComponents = [sessText, sessKey];
    SessionIntroComponents.forEach(c => { if ('status' in c) c.status = PsychoJS.Status.NOT_STARTED; });

    return Scheduler.Event.NEXT;
  };
}

function SessionIntroRoutineEachFrame() {
  return async function () {
    t = SessionIntroClock.getTime();
    frameN += 1;

    if (t >= 0.0 && sessText.status === PsychoJS.Status.NOT_STARTED) {
      sessText.tStart = t;
      sessText.frameNStart = frameN;
      sessText.setAutoDraw(true);
    }

    if (t >= 0.0 && sessKey.status === PsychoJS.Status.NOT_STARTED) {
      sessKey.tStart = t;
      sessKey.frameNStart = frameN;
      psychoJS.window.callOnFlip(() => { sessKey.clock.reset(); });
      psychoJS.window.callOnFlip(() => { sessKey.start(); });
      psychoJS.window.callOnFlip(() => { sessKey.clearEvents(); });
    }

    if (sessKey.status === PsychoJS.Status.STARTED) {
      let theseKeys = sessKey.getKeys({ keyList: ['return', 'enter', 'space'], waitRelease: false });
      _sessKey_allKeys = _sessKey_allKeys.concat(theseKeys);
      if (_sessKey_allKeys.length > 0) {
        const last = _sessKey_allKeys[_sessKey_allKeys.length - 1];
        sessKey.keys = last.name;
        sessKey.rt = last.rt;
        sessKey.duration = last.duration;
        continueRoutine = false;
      }
    }

    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }

    if (!continueRoutine) {
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }

    continueRoutine = false;
    SessionIntroComponents.forEach(c => {
      if ('status' in c && c.status !== PsychoJS.Status.FINISHED) continueRoutine = true;
    });

    if (continueRoutine) return Scheduler.Event.FLIP_REPEAT;
    return Scheduler.Event.NEXT;
  };
}

function SessionIntroRoutineEnd(snapshot) {
  return async function () {
    SessionIntroComponents.forEach(c => { if (typeof c.setAutoDraw === 'function') c.setAutoDraw(false); });
    psychoJS.experiment.addData('SessionIntro.stopped', globalClock.getTime());

    if (currentLoop instanceof MultiStairHandler) currentLoop.addResponse(sessKey.corr, level);
    psychoJS.experiment.addData('sessKey.keys', sessKey.keys);
    if (typeof sessKey.keys !== 'undefined') {
      psychoJS.experiment.addData('sessKey.rt', sessKey.rt);
      psychoJS.experiment.addData('sessKey.duration', sessKey.duration);
      routineTimer.reset();
    }

    sessKey.stop();
    prevSession = session;

    routineTimer.reset();
    if (currentLoop === psychoJS.experiment) psychoJS.experiment.nextEntry(snapshot);
    return Scheduler.Event.NEXT;
  };
}

// =========================
// TrialIntro
// =========================
var TrialIntroMaxDurationReached;
var _trialKey_allKeys;
var TrialIntroMaxDuration;
var TrialIntroComponents;

function TrialIntroRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);

    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;

    TrialIntroClock.reset();
    routineTimer.reset();
    TrialIntroMaxDurationReached = false;

    trialKey.keys = undefined;
    trialKey.rt = undefined;
    _trialKey_allKeys = [];

    // --- Prepare stim & expected keys for the 6 frames ---
    frameIdx = -1;
    function low(s) { return (((typeof s) === "string") || (s instanceof String)) ? s.toLowerCase() : s; }
    stimPaths = [stim1, stim2, stim3, stim4, stim5, stim6];
    actKeys  = [null, low(act2), low(act3), low(act4), low(act5), low(act6)];

    // optional sanity logs
    // console.log('Trial stimPaths:', stimPaths);
    // console.log('Trial actKeys  :', actKeys);

    psychoJS.experiment.addData('TrialIntro.started', globalClock.getTime());
    TrialIntroMaxDuration = null;

    TrialIntroComponents = [trialText, trialKey];
    TrialIntroComponents.forEach(c => { if ('status' in c) c.status = PsychoJS.Status.NOT_STARTED; });

    return Scheduler.Event.NEXT;
  };
}

function TrialIntroRoutineEachFrame() {
  return async function () {
    t = TrialIntroClock.getTime();
    frameN += 1;

    if (t >= 0.0 && trialText.status === PsychoJS.Status.NOT_STARTED) {
      trialText.tStart = t;
      trialText.frameNStart = frameN;
      trialText.setAutoDraw(true);
    }

    if (t >= 0.0 && trialKey.status === PsychoJS.Status.NOT_STARTED) {
      trialKey.tStart = t;
      trialKey.frameNStart = frameN;
      psychoJS.window.callOnFlip(() => { trialKey.clock.reset(); });
      psychoJS.window.callOnFlip(() => { trialKey.start(); });
      psychoJS.window.callOnFlip(() => { trialKey.clearEvents(); });
    }

    if (trialKey.status === PsychoJS.Status.STARTED) {
      let theseKeys = trialKey.getKeys({ keyList: ['return', 'enter', 'space'], waitRelease: false });
      _trialKey_allKeys = _trialKey_allKeys.concat(theseKeys);
      if (_trialKey_allKeys.length > 0) {
        const last = _trialKey_allKeys[_trialKey_allKeys.length - 1];
        trialKey.keys = last.name;
        trialKey.rt = last.rt;
        trialKey.duration = last.duration;
        continueRoutine = false;
      }
    }

    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }

    if (!continueRoutine) {
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }

    continueRoutine = false;
    TrialIntroComponents.forEach(c => {
      if ('status' in c && c.status !== PsychoJS.Status.FINISHED) continueRoutine = true;
    });

    if (continueRoutine) return Scheduler.Event.FLIP_REPEAT;
    return Scheduler.Event.NEXT;
  };
}

function TrialIntroRoutineEnd(snapshot) {
  return async function () {
    TrialIntroComponents.forEach(c => { if (typeof c.setAutoDraw === 'function') c.setAutoDraw(false); });
    psychoJS.experiment.addData('TrialIntro.stopped', globalClock.getTime());

    if (currentLoop instanceof MultiStairHandler) currentLoop.addResponse(trialKey.corr, level);
    psychoJS.experiment.addData('trialKey.keys', trialKey.keys);
    if (typeof trialKey.keys !== 'undefined') {
      psychoJS.experiment.addData('trialKey.rt', trialKey.rt);
      psychoJS.experiment.addData('trialKey.duration', trialKey.duration);
      routineTimer.reset();
    }

    trialKey.stop();
    routineTimer.reset();

    if (currentLoop === psychoJS.experiment) psychoJS.experiment.nextEntry(snapshot);
    return Scheduler.Event.NEXT;
  };
}

// =========================
// Frame (core 500ms image + 2s response)
// =========================
var FrameMaxDurationReached;
var _resp_allKeys;
var FrameMaxDuration;
var FrameComponents;
var currStim;
var expected;

function FrameRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);

    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;

    FrameClock.reset(routineTimer.getTime());
    routineTimer.add(2.000000);
    FrameMaxDurationReached = false;

    resp.keys = undefined;
    resp.rt = undefined;
    _resp_allKeys = [];

    // ---- Begin Routine: safe prep of current frame ----
    frameIdx += 1;

    // guard against out-of-range
    if (frameIdx >= stimPaths.length) {
      continueRoutine = false;
    } else {
      const rawStim = stimPaths[frameIdx];
      const fallbackStim = 'resources/images/157_Chairs.png';
      currStim = normPath(rawStim) || fallbackStim;
      img.setImage(currStim);

      psychoJS.eventManager.clearEvents();
    }
    // -----------------------------------------------

    psychoJS.experiment.addData('Frame.started', globalClock.getTime());
    FrameMaxDuration = null;

    FrameComponents = [img, resp];
    FrameComponents.forEach(c => { if ('status' in c) c.status = PsychoJS.Status.NOT_STARTED; });

    return Scheduler.Event.NEXT;
  };
}

var frameRemains;

function FrameRoutineEachFrame() {
  return async function () {
    t = FrameClock.getTime();
    frameN += 1;

    // image on for 1.0s
    if (t >= 0.0 && img.status === PsychoJS.Status.NOT_STARTED) {
      img.tStart = t;
      img.frameNStart = frameN;
      img.setAutoDraw(true);
    }
    frameRemains = 0.0 + 1.0 - psychoJS.window.monitorFramePeriod * 0.75;
    if (img.status === PsychoJS.Status.STARTED && t >= frameRemains) {
      img.tStop = t;
      img.frameNStop = frameN;
      img.status = PsychoJS.Status.FINISHED;
      img.setAutoDraw(false);
    }

    // response active for 2.0s
    if (t >= 0.0 && resp.status === PsychoJS.Status.NOT_STARTED) {
      resp.tStart = t;
      resp.frameNStart = frameN;
      psychoJS.window.callOnFlip(() => { resp.clock.reset(); });
      psychoJS.window.callOnFlip(() => { resp.start(); });
      psychoJS.window.callOnFlip(() => { resp.clearEvents(); });
    }
    frameRemains = 0.0 + 2.0 - psychoJS.window.monitorFramePeriod * 0.75;
    if (resp.status === PsychoJS.Status.STARTED && t >= frameRemains) {
      resp.tStop = t;
      resp.frameNStop = frameN;
      resp.status = PsychoJS.Status.FINISHED;
    }

    if (resp.status === PsychoJS.Status.STARTED) {
      let theseKeys = resp.getKeys({ keyList: ['x', 'b'], waitRelease: false });
      _resp_allKeys = _resp_allKeys.concat(theseKeys);
      if (_resp_allKeys.length > 0) {
        const last = _resp_allKeys[_resp_allKeys.length - 1];
        resp.keys = last.name;
        resp.rt = last.rt;
        resp.duration = last.duration;
      }
    }

    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }

    if (!continueRoutine) {
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }

    continueRoutine = false;
    if (routineTimer.getTime() > 0) {
      FrameComponents.forEach(c => { if ('status' in c && c.status !== PsychoJS.Status.FINISHED) continueRoutine = true; });
    }

    if (continueRoutine && routineTimer.getTime() > 0) return Scheduler.Event.FLIP_REPEAT;
    return Scheduler.Event.NEXT;
  };
}

function FrameRoutineEnd(snapshot) {
  return async function () {
    FrameComponents.forEach(c => { if (typeof c.setAutoDraw === 'function') c.setAutoDraw(false); });
    psychoJS.experiment.addData('Frame.stopped', globalClock.getTime());

    if (currentLoop instanceof MultiStairHandler) currentLoop.addResponse(resp.corr, level);
    psychoJS.experiment.addData('resp.keys', resp.keys);
    if (typeof resp.keys !== 'undefined') {
      psychoJS.experiment.addData('resp.rt', resp.rt);
      psychoJS.experiment.addData('resp.duration', resp.duration);
    }

    resp.stop();

    if (routineForceEnded) {
      routineTimer.reset();
    } else if (FrameMaxDurationReached) {
      FrameClock.add(FrameMaxDuration);
    } else {
      FrameClock.add(2.000000);
    }

    if (currentLoop === psychoJS.experiment) psychoJS.experiment.nextEntry(snapshot);
    return Scheduler.Event.NEXT;
  };
}

// =========================
/** ITI: 5s or press Enter/Space/Return to skip **/
// =========================
var ITIMaxDurationReached;
var _itiKey_allKeys;
var ITIMaxDuration;
var ITIComponents;

function ITIRoutineBegin(snapshot) {
  return async function () {
    TrialHandler.fromSnapshot(snapshot);

    t = 0;
    frameN = -1;
    continueRoutine = true;
    routineForceEnded = false;

    ITIClock.reset();
    routineTimer.reset();
    ITIMaxDurationReached = false;

    itiKey.keys = undefined;
    itiKey.rt = undefined;
    _itiKey_allKeys = [];

    // local clock for 5s countdown
    itiClock.reset();

    psychoJS.experiment.addData('ITI.started', globalClock.getTime());
    ITIMaxDuration = null;

    ITIComponents = [itiText, itiKey];
    ITIComponents.forEach(c => { if ('status' in c) c.status = PsychoJS.Status.NOT_STARTED; });

    return Scheduler.Event.NEXT;
  };
}

function ITIRoutineEachFrame() {
  return async function () {
    t = ITIClock.getTime();
    frameN += 1;

    if (t >= 0.0 && itiText.status === PsychoJS.Status.NOT_STARTED) {
      itiText.tStart = t;
      itiText.frameNStart = frameN;
      itiText.setAutoDraw(true);
    }

    if (t >= 0.0 && itiKey.status === PsychoJS.Status.NOT_STARTED) {
      itiKey.tStart = t;
      itiKey.frameNStart = frameN;
      psychoJS.window.callOnFlip(() => { itiKey.clock.reset(); });
      psychoJS.window.callOnFlip(() => { itiKey.start(); });
      psychoJS.window.callOnFlip(() => { itiKey.clearEvents(); });
    }

    if (itiKey.status === PsychoJS.Status.STARTED) {
      let theseKeys = itiKey.getKeys({ keyList: ['return', 'enter', 'space'], waitRelease: false });
      _itiKey_allKeys = _itiKey_allKeys.concat(theseKeys);
      if (_itiKey_allKeys.length > 0) {
        const last = _itiKey_allKeys[_itiKey_allKeys.length - 1];
        itiKey.keys = last.name;
        itiKey.rt = last.rt;
        itiKey.duration = last.duration;
        continueRoutine = false;
      }
    }

    // auto-advance after 5s
    if (itiClock.getTime() >= 5.0) {
      continueRoutine = false;
    }

    if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({ keyList: ['escape'] }).length > 0) {
      return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
    }

    if (!continueRoutine) {
      routineForceEnded = true;
      return Scheduler.Event.NEXT;
    }

    continueRoutine = false;
    ITIComponents.forEach(c => { if ('status' in c && c.status !== PsychoJS.Status.FINISHED) continueRoutine = true; });

    if (continueRoutine) return Scheduler.Event.FLIP_REPEAT;
    return Scheduler.Event.NEXT;
  };
}

function ITIRoutineEnd(snapshot) {
  return async function () {
    ITIComponents.forEach(c => { if (typeof c.setAutoDraw === 'function') c.setAutoDraw(false); });
    psychoJS.experiment.addData('ITI.stopped', globalClock.getTime());

    if (currentLoop instanceof MultiStairHandler) currentLoop.addResponse(itiKey.corr, level);
    psychoJS.experiment.addData('itiKey.keys', itiKey.keys);
    if (typeof itiKey.keys !== 'undefined') {
      psychoJS.experiment.addData('itiKey.rt', itiKey.rt);
      psychoJS.experiment.addData('itiKey.duration', itiKey.duration);
      routineTimer.reset();
    }

    itiKey.stop();
    routineTimer.reset();

    if (currentLoop === psychoJS.experiment) psychoJS.experiment.nextEntry(snapshot);
    return Scheduler.Event.NEXT;
  };
}

// =========================
// Utilities
// =========================
function importConditions(currentLoop) {
  return async function () {
    psychoJS.importAttributes(currentLoop.getCurrentTrial());
    return Scheduler.Event.NEXT;
  };
}

async function quitPsychoJS(message, isCompleted) {
  if (psychoJS.experiment.isEntryEmpty()) {
    psychoJS.experiment.nextEntry();
  }
  psychoJS.window.close();
  psychoJS.quit({ message, isCompleted });
  return Scheduler.Event.QUIT;
}
