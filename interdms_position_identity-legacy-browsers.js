/***********************
 * 1Back_Category *
 ***********************/


// store info about the experiment session:
let expName = '1back_category';  // from the Builder filename that created this script
let expInfo = {
    'participant': '',
};
let PILOTING = util.getUrlParameters().has('__pilotToken');

// Start code blocks for 'Before Experiment'
// init psychoJS:
const psychoJS = new PsychoJS({
    debug: true
});

// open window:
psychoJS.openWindow({
    fullscr: false,
    color: new util.Color([0, 0, 0]),
    units: 'height',
    waitBlanking: true,
    backgroundImage: '',
    backgroundFit: 'none',
});
// schedule the experiment:
psychoJS.schedule(psychoJS.gui.DlgFromDict({
    dictionary: expInfo,
    title: expName
}));

const flowScheduler = new Scheduler(psychoJS);
const dialogCancelScheduler = new Scheduler(psychoJS);
psychoJS.scheduleCondition(function () {
    return (psychoJS.gui.dialogComponent.button === 'OK');
}, flowScheduler, dialogCancelScheduler);

// flowScheduler gets run if the participants presses OK
flowScheduler.add(updateInfo); // add timeStamp
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

// quit if user presses Cancel in dialog box:
dialogCancelScheduler.add(quitPsychoJS, '', false);

psychoJS.start({
    expName: expName,
    expInfo: expInfo,
});

psychoJS.experimentLogger.setLevel(core.Logger.ServerLevel.EXP);


var currentLoop;
var frameDur;

async function updateInfo() {
    currentLoop = psychoJS.experiment;  // right now there are no loops
    expInfo['date'] = util.MonotonicClock.getDateStr();  // add a simple timestamp
    expInfo['expName'] = expName;
    expInfo['psychopyVersion'] = '2025.1.1';
    expInfo['OS'] = window.navigator.platform;


    // store frame rate of monitor if we can measure it successfully
    expInfo['frameRate'] = psychoJS.window.getActualFrameRate();
    if (typeof expInfo['frameRate'] !== 'undefined')
        frameDur = 1.0 / Math.round(expInfo['frameRate']);
    else
        frameDur = 1.0 / 60.0; // couldn't get a reliable measure so guess

    // add info from the URL:
    util.addInfoFromUrl(expInfo);


    psychoJS.experiment.dataFileName = (("." + "/") + `data/${expInfo["participant"]}_${expName}_${expInfo["date"]}`);
    psychoJS.experiment.field_separator = '\t';


    return Scheduler.Event.NEXT;
}


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
var globalClock;
var routineTimer;

async function experimentInit() {
    // Initialize components for Routine "Globals"
    GlobalsClock = new util.Clock();
    // Run 'Begin Experiment' code from globals
    prevSession = null;
    frameIdx = (-1);
    stimPaths = [];
    actKeys = [];

    // Initialize components for Routine "SessionIntro"
    SessionIntroClock = new util.Clock();
    sessText = new visual.TextStim({
        win: psychoJS.window,
        name: 'sessText',
        text: 'Press Enter to start',
        font: 'Open Sans',
        units: undefined,
        pos: [0, 0], draggable: false, height: 0.05, wrapWidth: undefined, ori: 0.0,
        languageStyle: 'LTR',
        color: new util.Color('white'), opacity: undefined,
        depth: 0.0
    });

    sessKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});

    // Initialize components for Routine "TrialIntro"
    TrialIntroClock = new util.Clock();
    trialText = new visual.TextStim({
        win: psychoJS.window,
        name: 'trialText',
        text: 'Press Enter to start the trial',
        font: 'Open Sans',
        units: undefined,
        pos: [0, 0], draggable: false, height: 0.05, wrapWidth: undefined, ori: 0.0,
        languageStyle: 'LTR',
        color: new util.Color('white'), opacity: undefined,
        depth: 0.0
    });

    trialKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});

    // Initialize components for Routine "Frame"
    FrameClock = new util.Clock();
    img = new visual.ImageStim({
        win: psychoJS.window,
        name: 'img', units: undefined,
        image: 'images/157_Chairs.png', mask: undefined,
        anchor: 'center',
        ori: 0.0,
        pos: [0, 0],
        draggable: false,
        size: [0.5, 0.5],
        color: new util.Color([1, 1, 1]), opacity: undefined,
        flipHoriz: false, flipVert: false,
        texRes: 128.0, interpolate: true, depth: 0.0
    });
    resp = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});

    // Initialize components for Routine "ITI"
    ITIClock = new util.Clock();
    itiText = new visual.TextStim({
        win: psychoJS.window,
        name: 'itiText',
        text: 'Next trial in 5s - press Enter to start now',
        font: 'Open Sans',
        units: undefined,
        pos: [0, 0], draggable: false, height: 0.05, wrapWidth: undefined, ori: 0.0,
        languageStyle: 'LTR',
        color: new util.Color('white'), opacity: undefined,
        depth: 0.0
    });

    itiKey = new core.Keyboard({psychoJS: psychoJS, clock: new util.Clock(), waitForStart: true});

    // Create some handy timers
    globalClock = new util.Clock();  // to track the time since experiment started
    routineTimer = new util.CountdownTimer();  // to track time remaining of each (non-slip) routine

    return Scheduler.Event.NEXT;
}


var t;
var frameN;
var continueRoutine;
var routineForceEnded;
var GlobalsMaxDurationReached;
var GlobalsMaxDuration;
var GlobalsComponents;

function GlobalsRoutineBegin(snapshot) {
    return async function () {
        TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date

        //--- Prepare to start Routine 'Globals' ---
        t = 0;
        frameN = -1;
        continueRoutine = true; // until we're told otherwise
        // keep track of whether this Routine was forcibly ended
        routineForceEnded = false;
        GlobalsClock.reset();
        routineTimer.reset();
        GlobalsMaxDurationReached = false;
        // update component parameters for each repeat
        psychoJS.experiment.addData('Globals.started', globalClock.getTime());
        GlobalsMaxDuration = null
        // keep track of which components have finished
        GlobalsComponents = [];

        GlobalsComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent)
                thisComponent.status = PsychoJS.Status.NOT_STARTED;
        });
        return Scheduler.Event.NEXT;
    }
}


function GlobalsRoutineEachFrame() {
    return async function () {
        //--- Loop for each frame of Routine 'Globals' ---
        // get current time
        t = GlobalsClock.getTime();
        frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
        // update/draw components on each frame
        // check for quit (typically the Esc key)
        if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList: ['escape']}).length > 0) {
            return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
        }

        // check if the Routine should terminate
        if (!continueRoutine) {  // a component has requested a forced-end of Routine
            routineForceEnded = true;
            return Scheduler.Event.NEXT;
        }

        continueRoutine = false;  // reverts to True if at least one component still running
        GlobalsComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
                continueRoutine = true;
            }
        });

        // refresh the screen if continuing
        if (continueRoutine) {
            return Scheduler.Event.FLIP_REPEAT;
        } else {
            return Scheduler.Event.NEXT;
        }
    };
}


function GlobalsRoutineEnd(snapshot) {
    return async function () {
        //--- Ending Routine 'Globals' ---
        GlobalsComponents.forEach(function (thisComponent) {
            if (typeof thisComponent.setAutoDraw === 'function') {
                thisComponent.setAutoDraw(false);
            }
        });
        psychoJS.experiment.addData('Globals.stopped', globalClock.getTime());
        // the Routine "Globals" was not non-slip safe, so reset the non-slip timer
        routineTimer.reset();

        // Routines running outside a loop should always advance the datafile row
        if (currentLoop === psychoJS.experiment) {
            psychoJS.experiment.nextEntry(snapshot);
        }
        return Scheduler.Event.NEXT;
    }
}


var trials;

function trialsLoopBegin(trialsLoopScheduler, snapshot) {
    return async function () {
        TrialHandler.fromSnapshot(snapshot); // update internal variables (.thisN etc) of the loop

        // set up handler to look after randomisation of conditions etc
        trials = new TrialHandler({
            psychoJS: psychoJS,
            nReps: 1, method: TrialHandler.Method.SEQUENTIAL,
            extraInfo: expInfo, originPath: undefined,
            trialList: '1back_category_trials.csv',
            seed: undefined, name: 'trials'
        });
        psychoJS.experiment.addLoop(trials); // add the loop to the experiment
        currentLoop = trials;  // we're now the current loop

        // Schedule all the trials in the trialList:
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
    }
}


var frames;

function framesLoopBegin(framesLoopScheduler, snapshot) {
    return async function () {
        TrialHandler.fromSnapshot(snapshot); // update internal variables (.thisN etc) of the loop

        // set up handler to look after randomisation of conditions etc
        frames = new TrialHandler({
            psychoJS: psychoJS,
            nReps: 6, method: TrialHandler.Method.SEQUENTIAL,
            extraInfo: expInfo, originPath: undefined,
            trialList: undefined,
            seed: undefined, name: 'frames'
        });
        psychoJS.experiment.addLoop(frames); // add the loop to the experiment
        currentLoop = frames;  // we're now the current loop

        // Schedule all the trials in the trialList:
        frames.forEach(function () {
            snapshot = frames.getSnapshot();

            framesLoopScheduler.add(importConditions(snapshot));
            framesLoopScheduler.add(FrameRoutineBegin(snapshot));
            framesLoopScheduler.add(FrameRoutineEachFrame());
            framesLoopScheduler.add(FrameRoutineEnd(snapshot));
            framesLoopScheduler.add(framesLoopEndIteration(framesLoopScheduler, snapshot));
        });

        return Scheduler.Event.NEXT;
    }
}


async function framesLoopEnd() {
    // terminate loop
    psychoJS.experiment.removeLoop(frames);
    // update the current loop from the ExperimentHandler
    if (psychoJS.experiment._unfinishedLoops.length > 0)
        currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
    else
        currentLoop = psychoJS.experiment;  // so we use addData from the experiment
    return Scheduler.Event.NEXT;
}


function framesLoopEndIteration(scheduler, snapshot) {
    // ------Prepare for next entry------
    return async function () {
        if (typeof snapshot !== 'undefined') {
            // ------Check if user ended loop early------
            if (snapshot.finished) {
                // Check for and save orphaned data
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


async function trialsLoopEnd() {
    // terminate loop
    psychoJS.experiment.removeLoop(trials);
    // update the current loop from the ExperimentHandler
    if (psychoJS.experiment._unfinishedLoops.length > 0)
        currentLoop = psychoJS.experiment._unfinishedLoops.at(-1);
    else
        currentLoop = psychoJS.experiment;  // so we use addData from the experiment
    return Scheduler.Event.NEXT;
}


function trialsLoopEndIteration(scheduler, snapshot) {
    // ------Prepare for next entry------
    return async function () {
        if (typeof snapshot !== 'undefined') {
            // ------Check if user ended loop early------
            if (snapshot.finished) {
                // Check for and save orphaned data
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


var SessionIntroMaxDurationReached;
var _sessKey_allKeys;
var SessionIntroMaxDuration;
var SessionIntroComponents;

function SessionIntroRoutineBegin(snapshot) {
    return async function () {
        TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date

        //--- Prepare to start Routine 'SessionIntro' ---
        t = 0;
        frameN = -1;
        continueRoutine = true; // until we're told otherwise
        // keep track of whether this Routine was forcibly ended
        routineForceEnded = false;
        SessionIntroClock.reset();
        routineTimer.reset();
        SessionIntroMaxDurationReached = false;
        // update component parameters for each repeat
        sessKey.keys = undefined;
        sessKey.rt = undefined;
        _sessKey_allKeys = [];
        // Run 'Begin Routine' code from sessGate
        if (((prevSession === null) || (session !== prevSession))) {
            continueRoutine = true;
            sessText.setText(`Session: ${session}
    Press Enter to start`
            );
        } else {
            continueRoutine = false;
        }

        psychoJS.experiment.addData('SessionIntro.started', globalClock.getTime());
        SessionIntroMaxDuration = null
        // keep track of which components have finished
        SessionIntroComponents = [];
        SessionIntroComponents.push(sessText);
        SessionIntroComponents.push(sessKey);

        SessionIntroComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent)
                thisComponent.status = PsychoJS.Status.NOT_STARTED;
        });
        return Scheduler.Event.NEXT;
    }
}


function SessionIntroRoutineEachFrame() {
    return async function () {
        //--- Loop for each frame of Routine 'SessionIntro' ---
        // get current time
        t = SessionIntroClock.getTime();
        frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
        // update/draw components on each frame

        // *sessText* updates
        if (t >= 0.0 && sessText.status === PsychoJS.Status.NOT_STARTED) {
            // keep track of start time/frame for later
            sessText.tStart = t;  // (not accounting for frame time here)
            sessText.frameNStart = frameN;  // exact frame index

            sessText.setAutoDraw(true);
        }


        // if sessText is active this frame...
        if (sessText.status === PsychoJS.Status.STARTED) {
        }


        // *sessKey* updates
        if (t >= 0.0 && sessKey.status === PsychoJS.Status.NOT_STARTED) {
            // keep track of start time/frame for later
            sessKey.tStart = t;  // (not accounting for frame time here)
            sessKey.frameNStart = frameN;  // exact frame index

            // keyboard checking is just starting
            psychoJS.window.callOnFlip(function () {
                sessKey.clock.reset();
            });  // t=0 on next screen flip
            psychoJS.window.callOnFlip(function () {
                sessKey.start();
            }); // start on screen flip
            psychoJS.window.callOnFlip(function () {
                sessKey.clearEvents();
            });
        }

        // if sessKey is active this frame...
        if (sessKey.status === PsychoJS.Status.STARTED) {
            let theseKeys = sessKey.getKeys({keyList: ['return', 'enter', 'space'], waitRelease: false});
            _sessKey_allKeys = _sessKey_allKeys.concat(theseKeys);
            if (_sessKey_allKeys.length > 0) {
                sessKey.keys = _sessKey_allKeys[_sessKey_allKeys.length - 1].name;  // just the last key pressed
                sessKey.rt = _sessKey_allKeys[_sessKey_allKeys.length - 1].rt;
                sessKey.duration = _sessKey_allKeys[_sessKey_allKeys.length - 1].duration;
                // a response ends the routine
                continueRoutine = false;
            }
        }

        // check for quit (typically the Esc key)
        if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList: ['escape']}).length > 0) {
            return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
        }

        // check if the Routine should terminate
        if (!continueRoutine) {  // a component has requested a forced-end of Routine
            routineForceEnded = true;
            return Scheduler.Event.NEXT;
        }

        continueRoutine = false;  // reverts to True if at least one component still running
        SessionIntroComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
                continueRoutine = true;
            }
        });

        // refresh the screen if continuing
        if (continueRoutine) {
            return Scheduler.Event.FLIP_REPEAT;
        } else {
            return Scheduler.Event.NEXT;
        }
    };
}


function SessionIntroRoutineEnd(snapshot) {
    return async function () {
        //--- Ending Routine 'SessionIntro' ---
        SessionIntroComponents.forEach(function (thisComponent) {
            if (typeof thisComponent.setAutoDraw === 'function') {
                thisComponent.setAutoDraw(false);
            }
        });
        psychoJS.experiment.addData('SessionIntro.stopped', globalClock.getTime());
        // update the trial handler
        if (currentLoop instanceof MultiStairHandler) {
            currentLoop.addResponse(sessKey.corr, level);
        }
        psychoJS.experiment.addData('sessKey.keys', sessKey.keys);
        if (typeof sessKey.keys !== 'undefined') {  // we had a response
            psychoJS.experiment.addData('sessKey.rt', sessKey.rt);
            psychoJS.experiment.addData('sessKey.duration', sessKey.duration);
            routineTimer.reset();
        }

        sessKey.stop();
        // Run 'End Routine' code from sessGate
        prevSession = session;

        // the Routine "SessionIntro" was not non-slip safe, so reset the non-slip timer
        routineTimer.reset();

        // Routines running outside a loop should always advance the datafile row
        if (currentLoop === psychoJS.experiment) {
            psychoJS.experiment.nextEntry(snapshot);
        }
        return Scheduler.Event.NEXT;
    }
}


var TrialIntroMaxDurationReached;
var _trialKey_allKeys;
var TrialIntroMaxDuration;
var TrialIntroComponents;

function TrialIntroRoutineBegin(snapshot) {
    return async function () {
        TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date

        //--- Prepare to start Routine 'TrialIntro' ---
        t = 0;
        frameN = -1;
        continueRoutine = true; // until we're told otherwise
        // keep track of whether this Routine was forcibly ended
        routineForceEnded = false;
        TrialIntroClock.reset();
        routineTimer.reset();
        TrialIntroMaxDurationReached = false;
        // update component parameters for each repeat
        trialKey.keys = undefined;
        trialKey.rt = undefined;
        _trialKey_allKeys = [];
        // Run 'Begin Routine' code from trialPrep
        frameIdx = (-1);

        function low(s) {
            return ((((typeof s) === "string") || (s instanceof String)) ? s.toLowerCase() : s);
        }

        stimPaths = [stim1, stim2, stim3, stim4, stim5, stim6];
        actKeys = [null, low(act2), low(act3), low(act4), low(act5), low(act6)];

        psychoJS.experiment.addData('TrialIntro.started', globalClock.getTime());
        TrialIntroMaxDuration = null
        // keep track of which components have finished
        TrialIntroComponents = [];
        TrialIntroComponents.push(trialText);
        TrialIntroComponents.push(trialKey);

        TrialIntroComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent)
                thisComponent.status = PsychoJS.Status.NOT_STARTED;
        });
        return Scheduler.Event.NEXT;
    }
}


function TrialIntroRoutineEachFrame() {
    return async function () {
        //--- Loop for each frame of Routine 'TrialIntro' ---
        // get current time
        t = TrialIntroClock.getTime();
        frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
        // update/draw components on each frame

        // *trialText* updates
        if (t >= 0.0 && trialText.status === PsychoJS.Status.NOT_STARTED) {
            // keep track of start time/frame for later
            trialText.tStart = t;  // (not accounting for frame time here)
            trialText.frameNStart = frameN;  // exact frame index

            trialText.setAutoDraw(true);
        }


        // if trialText is active this frame...
        if (trialText.status === PsychoJS.Status.STARTED) {
        }


        // *trialKey* updates
        if (t >= 0.0 && trialKey.status === PsychoJS.Status.NOT_STARTED) {
            // keep track of start time/frame for later
            trialKey.tStart = t;  // (not accounting for frame time here)
            trialKey.frameNStart = frameN;  // exact frame index

            // keyboard checking is just starting
            psychoJS.window.callOnFlip(function () {
                trialKey.clock.reset();
            });  // t=0 on next screen flip
            psychoJS.window.callOnFlip(function () {
                trialKey.start();
            }); // start on screen flip
            psychoJS.window.callOnFlip(function () {
                trialKey.clearEvents();
            });
        }

        // if trialKey is active this frame...
        if (trialKey.status === PsychoJS.Status.STARTED) {
            let theseKeys = trialKey.getKeys({keyList: ['return', 'enter', 'space'], waitRelease: false});
            _trialKey_allKeys = _trialKey_allKeys.concat(theseKeys);
            if (_trialKey_allKeys.length > 0) {
                trialKey.keys = _trialKey_allKeys[_trialKey_allKeys.length - 1].name;  // just the last key pressed
                trialKey.rt = _trialKey_allKeys[_trialKey_allKeys.length - 1].rt;
                trialKey.duration = _trialKey_allKeys[_trialKey_allKeys.length - 1].duration;
                // a response ends the routine
                continueRoutine = false;
            }
        }

        // check for quit (typically the Esc key)
        if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList: ['escape']}).length > 0) {
            return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
        }

        // check if the Routine should terminate
        if (!continueRoutine) {  // a component has requested a forced-end of Routine
            routineForceEnded = true;
            return Scheduler.Event.NEXT;
        }

        continueRoutine = false;  // reverts to True if at least one component still running
        TrialIntroComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
                continueRoutine = true;
            }
        });

        // refresh the screen if continuing
        if (continueRoutine) {
            return Scheduler.Event.FLIP_REPEAT;
        } else {
            return Scheduler.Event.NEXT;
        }
    };
}


function TrialIntroRoutineEnd(snapshot) {
    return async function () {
        //--- Ending Routine 'TrialIntro' ---
        TrialIntroComponents.forEach(function (thisComponent) {
            if (typeof thisComponent.setAutoDraw === 'function') {
                thisComponent.setAutoDraw(false);
            }
        });
        psychoJS.experiment.addData('TrialIntro.stopped', globalClock.getTime());
        // update the trial handler
        if (currentLoop instanceof MultiStairHandler) {
            currentLoop.addResponse(trialKey.corr, level);
        }
        psychoJS.experiment.addData('trialKey.keys', trialKey.keys);
        if (typeof trialKey.keys !== 'undefined') {  // we had a response
            psychoJS.experiment.addData('trialKey.rt', trialKey.rt);
            psychoJS.experiment.addData('trialKey.duration', trialKey.duration);
            routineTimer.reset();
        }

        trialKey.stop();
        // the Routine "TrialIntro" was not non-slip safe, so reset the non-slip timer
        routineTimer.reset();

        // Routines running outside a loop should always advance the datafile row
        if (currentLoop === psychoJS.experiment) {
            psychoJS.experiment.nextEntry(snapshot);
        }
        return Scheduler.Event.NEXT;
    }
}


var FrameMaxDurationReached;
var _resp_allKeys;
var FrameMaxDuration;
var FrameComponents;

function FrameRoutineBegin(snapshot) {
    return async function () {
        TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date

        //--- Prepare to start Routine 'Frame' ---
        t = 0;
        frameN = -1;
        continueRoutine = true; // until we're told otherwise
        // keep track of whether this Routine was forcibly ended
        routineForceEnded = false;
        FrameClock.reset(routineTimer.getTime());
        routineTimer.add(2.000000);
        FrameMaxDurationReached = false;
        // update component parameters for each repeat
        img.setImage(stimPaths[int(frames.thisN)]);
        resp.keys = undefined;
        resp.rt = undefined;
        _resp_allKeys = [];
        // Run 'Begin Routine' code from framPrep
        // advance within this trial's 6 frames
        frameIdx += 1;

        // guard against out-of-range
        if (frameIdx >= stimPaths.length) {
            continueRoutine = false;
        } else {
            // pick the current stimulus and expected key from the lists built in TrialIntro
            currStim = (stimPaths[frameIdx] !== undefined && stimPaths[frameIdx] !== null)
                ? stimPaths[frameIdx]
                : "images/157_Chairs.png";

            expected = String(
                (actKeys[frameIdx] !== undefined && actKeys[frameIdx] !== null) ? actKeys[frameIdx] : ""
            ).toLowerCase();

            // set the image BEFORE the Image component draws
            img.setImage(currStim);
            psychoJS.eventManager.clearEvents();
        }

        psychoJS.experiment.addData('Frame.started', globalClock.getTime());
        FrameMaxDuration = null
        // keep track of which components have finished
        FrameComponents = [];
        FrameComponents.push(img);
        FrameComponents.push(resp);

        FrameComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent)
                thisComponent.status = PsychoJS.Status.NOT_STARTED;
        });
        return Scheduler.Event.NEXT;
    }
}


var frameRemains;

function FrameRoutineEachFrame() {
    return async function () {
        //--- Loop for each frame of Routine 'Frame' ---
        // get current time
        t = FrameClock.getTime();
        frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
        // update/draw components on each frame

        // *img* updates
        if (t >= 0.0 && img.status === PsychoJS.Status.NOT_STARTED) {
            // keep track of start time/frame for later
            img.tStart = t;  // (not accounting for frame time here)
            img.frameNStart = frameN;  // exact frame index

            img.setAutoDraw(true);
        }


        // if img is active this frame...
        if (img.status === PsychoJS.Status.STARTED) {
        }

        frameRemains = 0.0 + 1.0 - psychoJS.window.monitorFramePeriod * 0.75;// most of one frame period left
        if (img.status === PsychoJS.Status.STARTED && t >= frameRemains) {
            // keep track of stop time/frame for later
            img.tStop = t;  // not accounting for scr refresh
            img.frameNStop = frameN;  // exact frame index
            // update status
            img.status = PsychoJS.Status.FINISHED;
            img.setAutoDraw(false);
        }


        // *resp* updates
        if (t >= 0.0 && resp.status === PsychoJS.Status.NOT_STARTED) {
            // keep track of start time/frame for later
            resp.tStart = t;  // (not accounting for frame time here)
            resp.frameNStart = frameN;  // exact frame index

            // keyboard checking is just starting
            psychoJS.window.callOnFlip(function () {
                resp.clock.reset();
            });  // t=0 on next screen flip
            psychoJS.window.callOnFlip(function () {
                resp.start();
            }); // start on screen flip
            psychoJS.window.callOnFlip(function () {
                resp.clearEvents();
            });
        }
        frameRemains = 0.0 + 2.0 - psychoJS.window.monitorFramePeriod * 0.75;// most of one frame period left
        if (resp.status === PsychoJS.Status.STARTED && t >= frameRemains) {
            // keep track of stop time/frame for later
            resp.tStop = t;  // not accounting for scr refresh
            resp.frameNStop = frameN;  // exact frame index
            // update status
            resp.status = PsychoJS.Status.FINISHED;
            frameRemains = 0.0 + 2.0 - psychoJS.window.monitorFramePeriod * 0.75;// most of one frame period left
            if (resp.status === PsychoJS.Status.STARTED && t >= frameRemains) {
                // keep track of stop time/frame for later
                resp.tStop = t;  // not accounting for scr refresh
                resp.frameNStop = frameN;  // exact frame index
                // update status
                resp.status = PsychoJS.Status.FINISHED;
                resp.status = PsychoJS.Status.FINISHED;
            }

        }

        // if resp is active this frame...
        if (resp.status === PsychoJS.Status.STARTED) {
            let theseKeys = resp.getKeys({keyList: ['x', 'b'], waitRelease: false});
            _resp_allKeys = _resp_allKeys.concat(theseKeys);
            if (_resp_allKeys.length > 0) {
                resp.keys = _resp_allKeys[_resp_allKeys.length - 1].name;  // just the last key pressed
                resp.rt = _resp_allKeys[_resp_allKeys.length - 1].rt;
                resp.duration = _resp_allKeys[_resp_allKeys.length - 1].duration;
            }
        }

        // check for quit (typically the Esc key)
        if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList: ['escape']}).length > 0) {
            return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
        }

        // check if the Routine should terminate
        if (!continueRoutine) {  // a component has requested a forced-end of Routine
            routineForceEnded = true;
            return Scheduler.Event.NEXT;
        }

        continueRoutine = false;  // reverts to True if at least one component still running
        FrameComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
                continueRoutine = true;
            }
        });

        // refresh the screen if continuing
        if (continueRoutine && routineTimer.getTime() > 0) {
            return Scheduler.Event.FLIP_REPEAT;
        } else {
            return Scheduler.Event.NEXT;
        }
    };
}


function FrameRoutineEnd(snapshot) {
    return async function () {
        //--- Ending Routine 'Frame' ---
        FrameComponents.forEach(function (thisComponent) {
            if (typeof thisComponent.setAutoDraw === 'function') {
                thisComponent.setAutoDraw(false);
            }
        });
        psychoJS.experiment.addData('Frame.stopped', globalClock.getTime());
        // update the trial handler
        if (currentLoop instanceof MultiStairHandler) {
            currentLoop.addResponse(resp.corr, level);
        }
        psychoJS.experiment.addData('resp.keys', resp.keys);
        if (typeof resp.keys !== 'undefined') {  // we had a response
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
        // Routines running outside a loop should always advance the datafile row
        if (currentLoop === psychoJS.experiment) {
            psychoJS.experiment.nextEntry(snapshot);
        }
        return Scheduler.Event.NEXT;
    }
}


var ITIMaxDurationReached;
var _itiKey_allKeys;
var _pj;
var itiClock;
var ITIMaxDuration;
var ITIComponents;

function ITIRoutineBegin(snapshot) {
    return async function () {
        TrialHandler.fromSnapshot(snapshot); // ensure that .thisN vals are up to date

        //--- Prepare to start Routine 'ITI' ---
        t = 0;
        frameN = -1;
        continueRoutine = true; // until we're told otherwise
        // keep track of whether this Routine was forcibly ended
        routineForceEnded = false;
        ITIClock.reset();
        routineTimer.reset();
        ITIMaxDurationReached = false;
        // update component parameters for each repeat
        itiKey.keys = undefined;
        itiKey.rt = undefined;
        _itiKey_allKeys = [];
        // Run 'Begin Routine' code from itiTimer
        var _pj;

        function _pj_snippets(container) {
            function in_es6(left, right) {
                if (((right instanceof Array) || ((typeof right) === "string"))) {
                    return (right.indexOf(left) > (-1));
                } else {
                    if (((right instanceof Map) || (right instanceof Set) || (right instanceof WeakMap) || (right instanceof WeakSet))) {
                        return right.has(left);
                    } else {
                        return (left in right);
                    }
                }
            }

            container["in_es6"] = in_es6;
            return container;
        }

        _pj = {};
        _pj_snippets(_pj);
        if ((!_pj.in_es6("itiClock", globals()))) {
            itiClock = new util.Clock();
        } else {
            itiClock.reset();
        }

        psychoJS.experiment.addData('ITI.started', globalClock.getTime());
        ITIMaxDuration = null
        // keep track of which components have finished
        ITIComponents = [];
        ITIComponents.push(itiText);
        ITIComponents.push(itiKey);

        ITIComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent)
                thisComponent.status = PsychoJS.Status.NOT_STARTED;
        });
        return Scheduler.Event.NEXT;
    }
}


function ITIRoutineEachFrame() {
    return async function () {
        //--- Loop for each frame of Routine 'ITI' ---
        // get current time
        t = ITIClock.getTime();
        frameN = frameN + 1;// number of completed frames (so 0 is the first frame)
        // update/draw components on each frame

        // *itiText* updates
        if (t >= 0.0 && itiText.status === PsychoJS.Status.NOT_STARTED) {
            // keep track of start time/frame for later
            itiText.tStart = t;  // (not accounting for frame time here)
            itiText.frameNStart = frameN;  // exact frame index

            itiText.setAutoDraw(true);
        }


        // if itiText is active this frame...
        if (itiText.status === PsychoJS.Status.STARTED) {
        }


        // *itiKey* updates
        if (t >= 0.0 && itiKey.status === PsychoJS.Status.NOT_STARTED) {
            // keep track of start time/frame for later
            itiKey.tStart = t;  // (not accounting for frame time here)
            itiKey.frameNStart = frameN;  // exact frame index

            // keyboard checking is just starting
            psychoJS.window.callOnFlip(function () {
                itiKey.clock.reset();
            });  // t=0 on next screen flip
            psychoJS.window.callOnFlip(function () {
                itiKey.start();
            }); // start on screen flip
            psychoJS.window.callOnFlip(function () {
                itiKey.clearEvents();
            });
        }

        // if itiKey is active this frame...
        if (itiKey.status === PsychoJS.Status.STARTED) {
            let theseKeys = itiKey.getKeys({keyList: ['return', 'enter', 'space'], waitRelease: false});
            _itiKey_allKeys = _itiKey_allKeys.concat(theseKeys);
            if (_itiKey_allKeys.length > 0) {
                itiKey.keys = _itiKey_allKeys[_itiKey_allKeys.length - 1].name;  // just the last key pressed
                itiKey.rt = _itiKey_allKeys[_itiKey_allKeys.length - 1].rt;
                itiKey.duration = _itiKey_allKeys[_itiKey_allKeys.length - 1].duration;
                // a response ends the routine
                continueRoutine = false;
            }
        }

        // Run 'Each Frame' code from itiTimer
        if ((itiClock.getTime() >= 5.0)) {
            continueRoutine = false;
        }

        // check for quit (typically the Esc key)
        if (psychoJS.experiment.experimentEnded || psychoJS.eventManager.getKeys({keyList: ['escape']}).length > 0) {
            return quitPsychoJS('The [Escape] key was pressed. Goodbye!', false);
        }

        // check if the Routine should terminate
        if (!continueRoutine) {  // a component has requested a forced-end of Routine
            routineForceEnded = true;
            return Scheduler.Event.NEXT;
        }

        continueRoutine = false;  // reverts to True if at least one component still running
        ITIComponents.forEach(function (thisComponent) {
            if ('status' in thisComponent && thisComponent.status !== PsychoJS.Status.FINISHED) {
                continueRoutine = true;
            }
        });

        // refresh the screen if continuing
        if (continueRoutine) {
            return Scheduler.Event.FLIP_REPEAT;
        } else {
            return Scheduler.Event.NEXT;
        }
    };
}


function ITIRoutineEnd(snapshot) {
    return async function () {
        //--- Ending Routine 'ITI' ---
        ITIComponents.forEach(function (thisComponent) {
            if (typeof thisComponent.setAutoDraw === 'function') {
                thisComponent.setAutoDraw(false);
            }
        });
        psychoJS.experiment.addData('ITI.stopped', globalClock.getTime());
        // update the trial handler
        if (currentLoop instanceof MultiStairHandler) {
            currentLoop.addResponse(itiKey.corr, level);
        }
        psychoJS.experiment.addData('itiKey.keys', itiKey.keys);
        if (typeof itiKey.keys !== 'undefined') {  // we had a response
            psychoJS.experiment.addData('itiKey.rt', itiKey.rt);
            psychoJS.experiment.addData('itiKey.duration', itiKey.duration);
            routineTimer.reset();
        }

        itiKey.stop();
        // the Routine "ITI" was not non-slip safe, so reset the non-slip timer
        routineTimer.reset();

        // Routines running outside a loop should always advance the datafile row
        if (currentLoop === psychoJS.experiment) {
            psychoJS.experiment.nextEntry(snapshot);
        }
        return Scheduler.Event.NEXT;
    }
}


function importConditions(currentLoop) {
    return async function () {
        psychoJS.importAttributes(currentLoop.getCurrentTrial());
        return Scheduler.Event.NEXT;
    };
}


async function quitPsychoJS(message, isCompleted) {
    // Check for and save orphaned data
    if (psychoJS.experiment.isEntryEmpty()) {
        psychoJS.experiment.nextEntry();
    }
    psychoJS.window.close();
    psychoJS.quit({message: message, isCompleted: isCompleted});

    return Scheduler.Event.QUIT;
}
