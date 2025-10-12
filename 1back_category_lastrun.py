#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
This experiment was created using PsychoPy3 Experiment Builder (v2025.1.1),
    on Sun 12 Oct 15:57:32 2025
If you publish work using this script the most relevant publication is:

    Peirce J, Gray JR, Simpson S, MacAskill M, Höchenberger R, Sogo H, Kastman E, Lindeløv JK. (2019) 
        PsychoPy2: Experiments in behavior made easy Behav Res 51: 195. 
        https://doi.org/10.3758/s13428-018-01193-y

"""

# --- Import packages ---
from psychopy import locale_setup
from psychopy import prefs
from psychopy import plugins
plugins.activatePlugins()
prefs.hardware['audioLib'] = 'ptb'
from psychopy import sound, gui, visual, core, data, event, logging, clock, colors, layout, hardware
from psychopy.tools import environmenttools
from psychopy.constants import (
    NOT_STARTED, STARTED, PLAYING, PAUSED, STOPPED, STOPPING, FINISHED, PRESSED, 
    RELEASED, FOREVER, priority
)

import numpy as np  # whole numpy lib is available, prepend 'np.'
from numpy import (sin, cos, tan, log, log10, pi, average,
                   sqrt, std, deg2rad, rad2deg, linspace, asarray)
from numpy.random import random, randint, normal, shuffle, choice as randchoice
import os  # handy system and path functions
import sys  # to get file system encoding

from psychopy.hardware import keyboard

# --- Setup global variables (available in all functions) ---
# create a device manager to handle hardware (keyboards, mice, mirophones, speakers, etc.)
deviceManager = hardware.DeviceManager()
# ensure that relative paths start from the same directory as this script
_thisDir = os.path.dirname(os.path.abspath(__file__))
# store info about the experiment session
psychopyVersion = '2025.1.1'
expName = '1back_category'  # from the Builder filename that created this script
expVersion = ''
# a list of functions to run when the experiment ends (starts off blank)
runAtExit = []
# information about this experiment
expInfo = {
    'participant': '',
    'date|hid': data.getDateStr(),
    'expName|hid': expName,
    'expVersion|hid': expVersion,
    'psychopyVersion|hid': psychopyVersion,
}

# --- Define some variables which will change depending on pilot mode ---
'''
To run in pilot mode, either use the run/pilot toggle in Builder, Coder and Runner, 
or run the experiment with `--pilot` as an argument. To change what pilot 
#mode does, check out the 'Pilot mode' tab in preferences.
'''
# work out from system args whether we are running in pilot mode
PILOTING = core.setPilotModeFromArgs()
# start off with values from experiment settings
_fullScr = False
_winSize = [720, 720]
# if in pilot mode, apply overrides according to preferences
if PILOTING:
    # force windowed mode
    if prefs.piloting['forceWindowed']:
        _fullScr = False
        # set window size
        _winSize = prefs.piloting['forcedWindowSize']
    # replace default participant ID
    if prefs.piloting['replaceParticipantID']:
        expInfo['participant'] = 'pilot'

def showExpInfoDlg(expInfo):
    """
    Show participant info dialog.
    Parameters
    ==========
    expInfo : dict
        Information about this experiment.
    
    Returns
    ==========
    dict
        Information about this experiment.
    """
    # show participant info dialog
    dlg = gui.DlgFromDict(
        dictionary=expInfo, sortKeys=False, title=expName, alwaysOnTop=True
    )
    if dlg.OK == False:
        core.quit()  # user pressed cancel
    # return expInfo
    return expInfo


def setupData(expInfo, dataDir=None):
    """
    Make an ExperimentHandler to handle trials and saving.
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    dataDir : Path, str or None
        Folder to save the data to, leave as None to create a folder in the current directory.    
    Returns
    ==========
    psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    """
    # remove dialog-specific syntax from expInfo
    for key, val in expInfo.copy().items():
        newKey, _ = data.utils.parsePipeSyntax(key)
        expInfo[newKey] = expInfo.pop(key)
    
    # data file name stem = absolute path + name; later add .psyexp, .csv, .log, etc
    if dataDir is None:
        dataDir = _thisDir
    filename = u'data/%s_%s_%s' % (expInfo['participant'], expName, expInfo['date'])
    # make sure filename is relative to dataDir
    if os.path.isabs(filename):
        dataDir = os.path.commonprefix([dataDir, filename])
        filename = os.path.relpath(filename, dataDir)
    
    # an ExperimentHandler isn't essential but helps with data saving
    thisExp = data.ExperimentHandler(
        name=expName, version=expVersion,
        extraInfo=expInfo, runtimeInfo=None,
        originPath='/Users/xiaoxuan/Desktop/202510_proj_nat_abs_pyschopy/1back_category/1back_category_lastrun.py',
        savePickle=True, saveWideText=True,
        dataFileName=dataDir + os.sep + filename, sortColumns='time'
    )
    thisExp.setPriority('thisRow.t', priority.CRITICAL)
    thisExp.setPriority('expName', priority.LOW)
    # return experiment handler
    return thisExp


def setupLogging(filename):
    """
    Setup a log file and tell it what level to log at.
    
    Parameters
    ==========
    filename : str or pathlib.Path
        Filename to save log file and data files as, doesn't need an extension.
    
    Returns
    ==========
    psychopy.logging.LogFile
        Text stream to receive inputs from the logging system.
    """
    # set how much information should be printed to the console / app
    if PILOTING:
        logging.console.setLevel(
            prefs.piloting['pilotConsoleLoggingLevel']
        )
    else:
        logging.console.setLevel('warning')
    # save a log file for detail verbose info
    logFile = logging.LogFile(filename+'.log')
    if PILOTING:
        logFile.setLevel(
            prefs.piloting['pilotLoggingLevel']
        )
    else:
        logFile.setLevel(
            logging.getLevel('exp')
        )
    
    return logFile


def setupWindow(expInfo=None, win=None):
    """
    Setup the Window
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    win : psychopy.visual.Window
        Window to setup - leave as None to create a new window.
    
    Returns
    ==========
    psychopy.visual.Window
        Window in which to run this experiment.
    """
    if win is None:
        # if not given a window to setup, make one
        win = visual.Window(
            size=_winSize, fullscr=_fullScr, screen=0,
            winType='pyglet', allowGUI=True, allowStencil=False,
            monitor='testMonitor', color=[0,0,0], colorSpace='rgb',
            backgroundImage='', backgroundFit='none',
            blendMode='avg', useFBO=True,
            units='height',
            checkTiming=False  # we're going to do this ourselves in a moment
        )
    else:
        # if we have a window, just set the attributes which are safe to set
        win.color = [0,0,0]
        win.colorSpace = 'rgb'
        win.backgroundImage = ''
        win.backgroundFit = 'none'
        win.units = 'height'
    if expInfo is not None:
        # get/measure frame rate if not already in expInfo
        if win._monitorFrameRate is None:
            win._monitorFrameRate = win.getActualFrameRate(infoMsg='Attempting to measure frame rate of screen, please wait...')
        expInfo['frameRate'] = win._monitorFrameRate
    win.hideMessage()
    if PILOTING:
        # show a visual indicator if we're in piloting mode
        if prefs.piloting['showPilotingIndicator']:
            win.showPilotingIndicator()
        # always show the mouse in piloting mode
        if prefs.piloting['forceMouseVisible']:
            win.mouseVisible = True
    
    return win


def setupDevices(expInfo, thisExp, win):
    """
    Setup whatever devices are available (mouse, keyboard, speaker, eyetracker, etc.) and add them to 
    the device manager (deviceManager)
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    win : psychopy.visual.Window
        Window in which to run this experiment.
    Returns
    ==========
    bool
        True if completed successfully.
    """
    # --- Setup input devices ---
    ioConfig = {}
    ioSession = ioServer = eyetracker = None
    
    # store ioServer object in the device manager
    deviceManager.ioServer = ioServer
    
    # create a default keyboard (e.g. to check for escape)
    if deviceManager.getDevice('defaultKeyboard') is None:
        deviceManager.addDevice(
            deviceClass='keyboard', deviceName='defaultKeyboard', backend='ptb'
        )
    if deviceManager.getDevice('sessKey') is None:
        # initialise sessKey
        sessKey = deviceManager.addDevice(
            deviceClass='keyboard',
            deviceName='sessKey',
        )
    if deviceManager.getDevice('trialKey') is None:
        # initialise trialKey
        trialKey = deviceManager.addDevice(
            deviceClass='keyboard',
            deviceName='trialKey',
        )
    if deviceManager.getDevice('resp') is None:
        # initialise resp
        resp = deviceManager.addDevice(
            deviceClass='keyboard',
            deviceName='resp',
        )
    if deviceManager.getDevice('itiKey') is None:
        # initialise itiKey
        itiKey = deviceManager.addDevice(
            deviceClass='keyboard',
            deviceName='itiKey',
        )
    # return True if completed successfully
    return True

def pauseExperiment(thisExp, win=None, timers=[], currentRoutine=None):
    """
    Pause this experiment, preventing the flow from advancing to the next routine until resumed.
    
    Parameters
    ==========
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    win : psychopy.visual.Window
        Window for this experiment.
    timers : list, tuple
        List of timers to reset once pausing is finished.
    currentRoutine : psychopy.data.Routine
        Current Routine we are in at time of pausing, if any. This object tells PsychoPy what Components to pause/play/dispatch.
    """
    # if we are not paused, do nothing
    if thisExp.status != PAUSED:
        return
    
    # start a timer to figure out how long we're paused for
    pauseTimer = core.Clock()
    # pause any playback components
    if currentRoutine is not None:
        for comp in currentRoutine.getPlaybackComponents():
            comp.pause()
    # make sure we have a keyboard
    defaultKeyboard = deviceManager.getDevice('defaultKeyboard')
    if defaultKeyboard is None:
        defaultKeyboard = deviceManager.addKeyboard(
            deviceClass='keyboard',
            deviceName='defaultKeyboard',
            backend='PsychToolbox',
        )
    # run a while loop while we wait to unpause
    while thisExp.status == PAUSED:
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=['escape']):
            endExperiment(thisExp, win=win)
        # dispatch messages on response components
        if currentRoutine is not None:
            for comp in currentRoutine.getDispatchComponents():
                comp.device.dispatchMessages()
        # sleep 1ms so other threads can execute
        clock.time.sleep(0.001)
    # if stop was requested while paused, quit
    if thisExp.status == FINISHED:
        endExperiment(thisExp, win=win)
    # resume any playback components
    if currentRoutine is not None:
        for comp in currentRoutine.getPlaybackComponents():
            comp.play()
    # reset any timers
    for timer in timers:
        timer.addTime(-pauseTimer.getTime())


def run(expInfo, thisExp, win, globalClock=None, thisSession=None):
    """
    Run the experiment flow.
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    psychopy.visual.Window
        Window in which to run this experiment.
    globalClock : psychopy.core.clock.Clock or None
        Clock to get global time from - supply None to make a new one.
    thisSession : psychopy.session.Session or None
        Handle of the Session object this experiment is being run from, if any.
    """
    # mark experiment as started
    thisExp.status = STARTED
    # make sure window is set to foreground to prevent losing focus
    win.winHandle.activate()
    # make sure variables created by exec are available globally
    exec = environmenttools.setExecEnvironment(globals())
    # get device handles from dict of input devices
    ioServer = deviceManager.ioServer
    # get/create a default keyboard (e.g. to check for escape)
    defaultKeyboard = deviceManager.getDevice('defaultKeyboard')
    if defaultKeyboard is None:
        deviceManager.addDevice(
            deviceClass='keyboard', deviceName='defaultKeyboard', backend='PsychToolbox'
        )
    eyetracker = deviceManager.getDevice('eyetracker')
    # make sure we're running in the directory for this experiment
    os.chdir(_thisDir)
    # get filename from ExperimentHandler for convenience
    filename = thisExp.dataFileName
    frameTolerance = 0.001  # how close to onset before 'same' frame
    endExpNow = False  # flag for 'escape' or other condition => quit the exp
    # get frame duration from frame rate in expInfo
    if 'frameRate' in expInfo and expInfo['frameRate'] is not None:
        frameDur = 1.0 / round(expInfo['frameRate'])
    else:
        frameDur = 1.0 / 60.0  # could not measure, so guess
    
    # Start Code - component code to be run after the window creation
    
    # --- Initialize components for Routine "Globals" ---
    # Run 'Begin Experiment' code from globals
    prevSession = None    # track when session changes
    frameIdx = -1         # 0..5 within a trial
    stimPaths = []        # 6 strings for this trial
    actKeys = []          # [None, act2..act6]
    
    
    # --- Initialize components for Routine "SessionIntro" ---
    sessText = visual.TextStim(win=win, name='sessText',
        text='Press Enter to start',
        font='Open Sans',
        pos=(0, 0), draggable=False, height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    sessKey = keyboard.Keyboard(deviceName='sessKey')
    
    # --- Initialize components for Routine "TrialIntro" ---
    trialText = visual.TextStim(win=win, name='trialText',
        text='Press Enter to start the trial',
        font='Open Sans',
        pos=(0, 0), draggable=False, height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    trialKey = keyboard.Keyboard(deviceName='trialKey')
    
    # --- Initialize components for Routine "Frame" ---
    img = visual.ImageStim(
        win=win,
        name='img', 
        image='default.png', mask=None, anchor='center',
        ori=0.0, pos=(0, 0), draggable=False, size=(0.5, 0.5),
        color=[1,1,1], colorSpace='rgb', opacity=None,
        flipHoriz=False, flipVert=False,
        texRes=128.0, interpolate=True, depth=0.0)
    resp = keyboard.Keyboard(deviceName='resp')
    
    # --- Initialize components for Routine "ITI" ---
    itiText = visual.TextStim(win=win, name='itiText',
        text='Next trial in 5s - press Enter to start now',
        font='Open Sans',
        pos=(0, 0), draggable=False, height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    itiKey = keyboard.Keyboard(deviceName='itiKey')
    
    # create some handy timers
    
    # global clock to track the time since experiment started
    if globalClock is None:
        # create a clock if not given one
        globalClock = core.Clock()
    if isinstance(globalClock, str):
        # if given a string, make a clock accoridng to it
        if globalClock == 'float':
            # get timestamps as a simple value
            globalClock = core.Clock(format='float')
        elif globalClock == 'iso':
            # get timestamps in ISO format
            globalClock = core.Clock(format='%Y-%m-%d_%H:%M:%S.%f%z')
        else:
            # get timestamps in a custom format
            globalClock = core.Clock(format=globalClock)
    if ioServer is not None:
        ioServer.syncClock(globalClock)
    logging.setDefaultClock(globalClock)
    # routine timer to track time remaining of each (possibly non-slip) routine
    routineTimer = core.Clock()
    win.flip()  # flip window to reset last flip timer
    # store the exact time the global clock started
    expInfo['expStart'] = data.getDateStr(
        format='%Y-%m-%d %Hh%M.%S.%f %z', fractionalSecondDigits=6
    )
    
    # --- Prepare to start Routine "Globals" ---
    # create an object to store info about Routine Globals
    Globals = data.Routine(
        name='Globals',
        components=[],
    )
    Globals.status = NOT_STARTED
    continueRoutine = True
    # update component parameters for each repeat
    # store start times for Globals
    Globals.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
    Globals.tStart = globalClock.getTime(format='float')
    Globals.status = STARTED
    thisExp.addData('Globals.started', Globals.tStart)
    Globals.maxDuration = None
    # keep track of which components have finished
    GlobalsComponents = Globals.components
    for thisComponent in Globals.components:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    frameN = -1
    
    # --- Run Routine "Globals" ---
    Globals.forceEnded = routineForceEnded = not continueRoutine
    while continueRoutine:
        # get current time
        t = routineTimer.getTime()
        tThisFlip = win.getFutureFlipTime(clock=routineTimer)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=["escape"]):
            thisExp.status = FINISHED
        if thisExp.status == FINISHED or endExpNow:
            endExperiment(thisExp, win=win)
            return
        # pause experiment here if requested
        if thisExp.status == PAUSED:
            pauseExperiment(
                thisExp=thisExp, 
                win=win, 
                timers=[routineTimer, globalClock], 
                currentRoutine=Globals,
            )
            # skip the frame we paused on
            continue
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            Globals.forceEnded = routineForceEnded = True
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in Globals.components:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # --- Ending Routine "Globals" ---
    for thisComponent in Globals.components:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    # store stop times for Globals
    Globals.tStop = globalClock.getTime(format='float')
    Globals.tStopRefresh = tThisFlipGlobal
    thisExp.addData('Globals.stopped', Globals.tStop)
    thisExp.nextEntry()
    # the Routine "Globals" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    
    # set up handler to look after randomisation of conditions etc
    trials = data.TrialHandler2(
        name='trials',
        nReps=1.0, 
        method='sequential', 
        extraInfo=expInfo, 
        originPath=-1, 
        trialList=data.importConditions('1back_category_trials.csv'), 
        seed=None, 
    )
    thisExp.addLoop(trials)  # add the loop to the experiment
    thisTrial = trials.trialList[0]  # so we can initialise stimuli with some values
    # abbreviate parameter names if possible (e.g. rgb = thisTrial.rgb)
    if thisTrial != None:
        for paramName in thisTrial:
            globals()[paramName] = thisTrial[paramName]
    if thisSession is not None:
        # if running in a Session with a Liaison client, send data up to now
        thisSession.sendExperimentData()
    
    for thisTrial in trials:
        trials.status = STARTED
        if hasattr(thisTrial, 'status'):
            thisTrial.status = STARTED
        currentLoop = trials
        thisExp.timestampOnFlip(win, 'thisRow.t', format=globalClock.format)
        if thisSession is not None:
            # if running in a Session with a Liaison client, send data up to now
            thisSession.sendExperimentData()
        # abbreviate parameter names if possible (e.g. rgb = thisTrial.rgb)
        if thisTrial != None:
            for paramName in thisTrial:
                globals()[paramName] = thisTrial[paramName]
        
        # --- Prepare to start Routine "SessionIntro" ---
        # create an object to store info about Routine SessionIntro
        SessionIntro = data.Routine(
            name='SessionIntro',
            components=[sessText, sessKey],
        )
        SessionIntro.status = NOT_STARTED
        continueRoutine = True
        # update component parameters for each repeat
        # create starting attributes for sessKey
        sessKey.keys = []
        sessKey.rt = []
        _sessKey_allKeys = []
        # Run 'Begin Routine' code from sessGate
        if prevSession is None or session != prevSession:
            continueRoutine = True
            sessText.setText(f"Session: {session}\nPress Enter to start")
        else:
            continueRoutine = False
        
        # store start times for SessionIntro
        SessionIntro.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
        SessionIntro.tStart = globalClock.getTime(format='float')
        SessionIntro.status = STARTED
        thisExp.addData('SessionIntro.started', SessionIntro.tStart)
        SessionIntro.maxDuration = None
        # keep track of which components have finished
        SessionIntroComponents = SessionIntro.components
        for thisComponent in SessionIntro.components:
            thisComponent.tStart = None
            thisComponent.tStop = None
            thisComponent.tStartRefresh = None
            thisComponent.tStopRefresh = None
            if hasattr(thisComponent, 'status'):
                thisComponent.status = NOT_STARTED
        # reset timers
        t = 0
        _timeToFirstFrame = win.getFutureFlipTime(clock="now")
        frameN = -1
        
        # --- Run Routine "SessionIntro" ---
        SessionIntro.forceEnded = routineForceEnded = not continueRoutine
        while continueRoutine:
            # if trial has changed, end Routine now
            if hasattr(thisTrial, 'status') and thisTrial.status == STOPPING:
                continueRoutine = False
            # get current time
            t = routineTimer.getTime()
            tThisFlip = win.getFutureFlipTime(clock=routineTimer)
            tThisFlipGlobal = win.getFutureFlipTime(clock=None)
            frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
            # update/draw components on each frame
            
            # *sessText* updates
            
            # if sessText is starting this frame...
            if sessText.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                # keep track of start time/frame for later
                sessText.frameNStart = frameN  # exact frame index
                sessText.tStart = t  # local t and not account for scr refresh
                sessText.tStartRefresh = tThisFlipGlobal  # on global time
                win.timeOnFlip(sessText, 'tStartRefresh')  # time at next scr refresh
                # add timestamp to datafile
                thisExp.timestampOnFlip(win, 'sessText.started')
                # update status
                sessText.status = STARTED
                sessText.setAutoDraw(True)
            
            # if sessText is active this frame...
            if sessText.status == STARTED:
                # update params
                pass
            
            # *sessKey* updates
            waitOnFlip = False
            
            # if sessKey is starting this frame...
            if sessKey.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                # keep track of start time/frame for later
                sessKey.frameNStart = frameN  # exact frame index
                sessKey.tStart = t  # local t and not account for scr refresh
                sessKey.tStartRefresh = tThisFlipGlobal  # on global time
                win.timeOnFlip(sessKey, 'tStartRefresh')  # time at next scr refresh
                # add timestamp to datafile
                thisExp.timestampOnFlip(win, 'sessKey.started')
                # update status
                sessKey.status = STARTED
                # keyboard checking is just starting
                waitOnFlip = True
                win.callOnFlip(sessKey.clock.reset)  # t=0 on next screen flip
                win.callOnFlip(sessKey.clearEvents, eventType='keyboard')  # clear events on next screen flip
            if sessKey.status == STARTED and not waitOnFlip:
                theseKeys = sessKey.getKeys(keyList=['return','enter','space'], ignoreKeys=["escape"], waitRelease=False)
                _sessKey_allKeys.extend(theseKeys)
                if len(_sessKey_allKeys):
                    sessKey.keys = _sessKey_allKeys[-1].name  # just the last key pressed
                    sessKey.rt = _sessKey_allKeys[-1].rt
                    sessKey.duration = _sessKey_allKeys[-1].duration
                    # a response ends the routine
                    continueRoutine = False
            
            # check for quit (typically the Esc key)
            if defaultKeyboard.getKeys(keyList=["escape"]):
                thisExp.status = FINISHED
            if thisExp.status == FINISHED or endExpNow:
                endExperiment(thisExp, win=win)
                return
            # pause experiment here if requested
            if thisExp.status == PAUSED:
                pauseExperiment(
                    thisExp=thisExp, 
                    win=win, 
                    timers=[routineTimer, globalClock], 
                    currentRoutine=SessionIntro,
                )
                # skip the frame we paused on
                continue
            
            # check if all components have finished
            if not continueRoutine:  # a component has requested a forced-end of Routine
                SessionIntro.forceEnded = routineForceEnded = True
                break
            continueRoutine = False  # will revert to True if at least one component still running
            for thisComponent in SessionIntro.components:
                if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                    continueRoutine = True
                    break  # at least one component has not yet finished
            
            # refresh the screen
            if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
                win.flip()
        
        # --- Ending Routine "SessionIntro" ---
        for thisComponent in SessionIntro.components:
            if hasattr(thisComponent, "setAutoDraw"):
                thisComponent.setAutoDraw(False)
        # store stop times for SessionIntro
        SessionIntro.tStop = globalClock.getTime(format='float')
        SessionIntro.tStopRefresh = tThisFlipGlobal
        thisExp.addData('SessionIntro.stopped', SessionIntro.tStop)
        # check responses
        if sessKey.keys in ['', [], None]:  # No response was made
            sessKey.keys = None
        trials.addData('sessKey.keys',sessKey.keys)
        if sessKey.keys != None:  # we had a response
            trials.addData('sessKey.rt', sessKey.rt)
            trials.addData('sessKey.duration', sessKey.duration)
        # Run 'End Routine' code from sessGate
        prevSession = session
        
        # the Routine "SessionIntro" was not non-slip safe, so reset the non-slip timer
        routineTimer.reset()
        
        # --- Prepare to start Routine "TrialIntro" ---
        # create an object to store info about Routine TrialIntro
        TrialIntro = data.Routine(
            name='TrialIntro',
            components=[trialText, trialKey],
        )
        TrialIntro.status = NOT_STARTED
        continueRoutine = True
        # update component parameters for each repeat
        # create starting attributes for trialKey
        trialKey.keys = []
        trialKey.rt = []
        _trialKey_allKeys = []
        # Run 'Begin Routine' code from trialPrep
        frameIdx = -1
        
        # Lowercase helper
        def low(s): return s.lower() if isinstance(s, str) else s
        
        # Build lists from your CSV columns
        stimPaths = [stim1, stim2, stim3, stim4, stim5, stim6]
        actKeys   = [None, low(act2), low(act3), low(act4), low(act5), low(act6)]
        
        
        # store start times for TrialIntro
        TrialIntro.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
        TrialIntro.tStart = globalClock.getTime(format='float')
        TrialIntro.status = STARTED
        thisExp.addData('TrialIntro.started', TrialIntro.tStart)
        TrialIntro.maxDuration = None
        # keep track of which components have finished
        TrialIntroComponents = TrialIntro.components
        for thisComponent in TrialIntro.components:
            thisComponent.tStart = None
            thisComponent.tStop = None
            thisComponent.tStartRefresh = None
            thisComponent.tStopRefresh = None
            if hasattr(thisComponent, 'status'):
                thisComponent.status = NOT_STARTED
        # reset timers
        t = 0
        _timeToFirstFrame = win.getFutureFlipTime(clock="now")
        frameN = -1
        
        # --- Run Routine "TrialIntro" ---
        TrialIntro.forceEnded = routineForceEnded = not continueRoutine
        while continueRoutine:
            # if trial has changed, end Routine now
            if hasattr(thisTrial, 'status') and thisTrial.status == STOPPING:
                continueRoutine = False
            # get current time
            t = routineTimer.getTime()
            tThisFlip = win.getFutureFlipTime(clock=routineTimer)
            tThisFlipGlobal = win.getFutureFlipTime(clock=None)
            frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
            # update/draw components on each frame
            
            # *trialText* updates
            
            # if trialText is starting this frame...
            if trialText.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                # keep track of start time/frame for later
                trialText.frameNStart = frameN  # exact frame index
                trialText.tStart = t  # local t and not account for scr refresh
                trialText.tStartRefresh = tThisFlipGlobal  # on global time
                win.timeOnFlip(trialText, 'tStartRefresh')  # time at next scr refresh
                # add timestamp to datafile
                thisExp.timestampOnFlip(win, 'trialText.started')
                # update status
                trialText.status = STARTED
                trialText.setAutoDraw(True)
            
            # if trialText is active this frame...
            if trialText.status == STARTED:
                # update params
                pass
            
            # *trialKey* updates
            waitOnFlip = False
            
            # if trialKey is starting this frame...
            if trialKey.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                # keep track of start time/frame for later
                trialKey.frameNStart = frameN  # exact frame index
                trialKey.tStart = t  # local t and not account for scr refresh
                trialKey.tStartRefresh = tThisFlipGlobal  # on global time
                win.timeOnFlip(trialKey, 'tStartRefresh')  # time at next scr refresh
                # add timestamp to datafile
                thisExp.timestampOnFlip(win, 'trialKey.started')
                # update status
                trialKey.status = STARTED
                # keyboard checking is just starting
                waitOnFlip = True
                win.callOnFlip(trialKey.clock.reset)  # t=0 on next screen flip
                win.callOnFlip(trialKey.clearEvents, eventType='keyboard')  # clear events on next screen flip
            if trialKey.status == STARTED and not waitOnFlip:
                theseKeys = trialKey.getKeys(keyList=['return','enter','space'], ignoreKeys=["escape"], waitRelease=False)
                _trialKey_allKeys.extend(theseKeys)
                if len(_trialKey_allKeys):
                    trialKey.keys = _trialKey_allKeys[-1].name  # just the last key pressed
                    trialKey.rt = _trialKey_allKeys[-1].rt
                    trialKey.duration = _trialKey_allKeys[-1].duration
                    # a response ends the routine
                    continueRoutine = False
            
            # check for quit (typically the Esc key)
            if defaultKeyboard.getKeys(keyList=["escape"]):
                thisExp.status = FINISHED
            if thisExp.status == FINISHED or endExpNow:
                endExperiment(thisExp, win=win)
                return
            # pause experiment here if requested
            if thisExp.status == PAUSED:
                pauseExperiment(
                    thisExp=thisExp, 
                    win=win, 
                    timers=[routineTimer, globalClock], 
                    currentRoutine=TrialIntro,
                )
                # skip the frame we paused on
                continue
            
            # check if all components have finished
            if not continueRoutine:  # a component has requested a forced-end of Routine
                TrialIntro.forceEnded = routineForceEnded = True
                break
            continueRoutine = False  # will revert to True if at least one component still running
            for thisComponent in TrialIntro.components:
                if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                    continueRoutine = True
                    break  # at least one component has not yet finished
            
            # refresh the screen
            if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
                win.flip()
        
        # --- Ending Routine "TrialIntro" ---
        for thisComponent in TrialIntro.components:
            if hasattr(thisComponent, "setAutoDraw"):
                thisComponent.setAutoDraw(False)
        # store stop times for TrialIntro
        TrialIntro.tStop = globalClock.getTime(format='float')
        TrialIntro.tStopRefresh = tThisFlipGlobal
        thisExp.addData('TrialIntro.stopped', TrialIntro.tStop)
        # check responses
        if trialKey.keys in ['', [], None]:  # No response was made
            trialKey.keys = None
        trials.addData('trialKey.keys',trialKey.keys)
        if trialKey.keys != None:  # we had a response
            trials.addData('trialKey.rt', trialKey.rt)
            trials.addData('trialKey.duration', trialKey.duration)
        # the Routine "TrialIntro" was not non-slip safe, so reset the non-slip timer
        routineTimer.reset()
        
        # set up handler to look after randomisation of conditions etc
        frames = data.TrialHandler2(
            name='frames',
            nReps=6.0, 
            method='sequential', 
            extraInfo=expInfo, 
            originPath=-1, 
            trialList=[None], 
            seed=None, 
        )
        thisExp.addLoop(frames)  # add the loop to the experiment
        thisFrame = frames.trialList[0]  # so we can initialise stimuli with some values
        # abbreviate parameter names if possible (e.g. rgb = thisFrame.rgb)
        if thisFrame != None:
            for paramName in thisFrame:
                globals()[paramName] = thisFrame[paramName]
        if thisSession is not None:
            # if running in a Session with a Liaison client, send data up to now
            thisSession.sendExperimentData()
        
        for thisFrame in frames:
            frames.status = STARTED
            if hasattr(thisFrame, 'status'):
                thisFrame.status = STARTED
            currentLoop = frames
            thisExp.timestampOnFlip(win, 'thisRow.t', format=globalClock.format)
            if thisSession is not None:
                # if running in a Session with a Liaison client, send data up to now
                thisSession.sendExperimentData()
            # abbreviate parameter names if possible (e.g. rgb = thisFrame.rgb)
            if thisFrame != None:
                for paramName in thisFrame:
                    globals()[paramName] = thisFrame[paramName]
            
            # --- Prepare to start Routine "Frame" ---
            # create an object to store info about Routine Frame
            Frame = data.Routine(
                name='Frame',
                components=[img, resp],
            )
            Frame.status = NOT_STARTED
            continueRoutine = True
            # update component parameters for each repeat
            img.setImage(stimPaths[int(frames.thisN)])
            # create starting attributes for resp
            resp.keys = []
            resp.rt = []
            _resp_allKeys = []
            # Run 'Begin Routine' code from framPrep
            # advance within this trial's 6 frames
            frameIdx += 1
            
            # guard against out-of-range
            if frameIdx >= len(stimPaths):
                continueRoutine = False
            else:
                # pick the current stimulus and expected key from the lists built in TrialIntro
                currStim = stimPaths[frameIdx]
                expected = (actKeys[frameIdx] or "")
                if isinstance(expected, str):
                    expected = expected.lower()
            
                # set the image BEFORE the Image component draws
                img.setImage(currStim)
                event.clearEvents()
            
            # store start times for Frame
            Frame.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
            Frame.tStart = globalClock.getTime(format='float')
            Frame.status = STARTED
            thisExp.addData('Frame.started', Frame.tStart)
            Frame.maxDuration = None
            # keep track of which components have finished
            FrameComponents = Frame.components
            for thisComponent in Frame.components:
                thisComponent.tStart = None
                thisComponent.tStop = None
                thisComponent.tStartRefresh = None
                thisComponent.tStopRefresh = None
                if hasattr(thisComponent, 'status'):
                    thisComponent.status = NOT_STARTED
            # reset timers
            t = 0
            _timeToFirstFrame = win.getFutureFlipTime(clock="now")
            frameN = -1
            
            # --- Run Routine "Frame" ---
            Frame.forceEnded = routineForceEnded = not continueRoutine
            while continueRoutine and routineTimer.getTime() < 2.0:
                # if trial has changed, end Routine now
                if hasattr(thisFrame, 'status') and thisFrame.status == STOPPING:
                    continueRoutine = False
                # get current time
                t = routineTimer.getTime()
                tThisFlip = win.getFutureFlipTime(clock=routineTimer)
                tThisFlipGlobal = win.getFutureFlipTime(clock=None)
                frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
                # update/draw components on each frame
                
                # *img* updates
                
                # if img is starting this frame...
                if img.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                    # keep track of start time/frame for later
                    img.frameNStart = frameN  # exact frame index
                    img.tStart = t  # local t and not account for scr refresh
                    img.tStartRefresh = tThisFlipGlobal  # on global time
                    win.timeOnFlip(img, 'tStartRefresh')  # time at next scr refresh
                    # add timestamp to datafile
                    thisExp.timestampOnFlip(win, 'img.started')
                    # update status
                    img.status = STARTED
                    img.setAutoDraw(True)
                
                # if img is active this frame...
                if img.status == STARTED:
                    # update params
                    pass
                
                # if img is stopping this frame...
                if img.status == STARTED:
                    # is it time to stop? (based on global clock, using actual start)
                    if tThisFlipGlobal > img.tStartRefresh + 1.0-frameTolerance:
                        # keep track of stop time/frame for later
                        img.tStop = t  # not accounting for scr refresh
                        img.tStopRefresh = tThisFlipGlobal  # on global time
                        img.frameNStop = frameN  # exact frame index
                        # add timestamp to datafile
                        thisExp.timestampOnFlip(win, 'img.stopped')
                        # update status
                        img.status = FINISHED
                        img.setAutoDraw(False)
                
                # *resp* updates
                waitOnFlip = False
                
                # if resp is starting this frame...
                if resp.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
                    # keep track of start time/frame for later
                    resp.frameNStart = frameN  # exact frame index
                    resp.tStart = t  # local t and not account for scr refresh
                    resp.tStartRefresh = tThisFlipGlobal  # on global time
                    win.timeOnFlip(resp, 'tStartRefresh')  # time at next scr refresh
                    # add timestamp to datafile
                    thisExp.timestampOnFlip(win, 'resp.started')
                    # update status
                    resp.status = STARTED
                    # keyboard checking is just starting
                    waitOnFlip = True
                    win.callOnFlip(resp.clock.reset)  # t=0 on next screen flip
                    win.callOnFlip(resp.clearEvents, eventType='keyboard')  # clear events on next screen flip
                
                # if resp is stopping this frame...
                if resp.status == STARTED:
                    # is it time to stop? (based on global clock, using actual start)
                    if tThisFlipGlobal > resp.tStartRefresh + 2.0-frameTolerance:
                        # keep track of stop time/frame for later
                        resp.tStop = t  # not accounting for scr refresh
                        resp.tStopRefresh = tThisFlipGlobal  # on global time
                        resp.frameNStop = frameN  # exact frame index
                        # add timestamp to datafile
                        thisExp.timestampOnFlip(win, 'resp.stopped')
                        # update status
                        resp.status = FINISHED
                        resp.status = FINISHED
                if resp.status == STARTED and not waitOnFlip:
                    theseKeys = resp.getKeys(keyList=['x','b'], ignoreKeys=["escape"], waitRelease=False)
                    _resp_allKeys.extend(theseKeys)
                    if len(_resp_allKeys):
                        resp.keys = _resp_allKeys[-1].name  # just the last key pressed
                        resp.rt = _resp_allKeys[-1].rt
                        resp.duration = _resp_allKeys[-1].duration
                
                # check for quit (typically the Esc key)
                if defaultKeyboard.getKeys(keyList=["escape"]):
                    thisExp.status = FINISHED
                if thisExp.status == FINISHED or endExpNow:
                    endExperiment(thisExp, win=win)
                    return
                # pause experiment here if requested
                if thisExp.status == PAUSED:
                    pauseExperiment(
                        thisExp=thisExp, 
                        win=win, 
                        timers=[routineTimer, globalClock], 
                        currentRoutine=Frame,
                    )
                    # skip the frame we paused on
                    continue
                
                # check if all components have finished
                if not continueRoutine:  # a component has requested a forced-end of Routine
                    Frame.forceEnded = routineForceEnded = True
                    break
                continueRoutine = False  # will revert to True if at least one component still running
                for thisComponent in Frame.components:
                    if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                        continueRoutine = True
                        break  # at least one component has not yet finished
                
                # refresh the screen
                if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
                    win.flip()
            
            # --- Ending Routine "Frame" ---
            for thisComponent in Frame.components:
                if hasattr(thisComponent, "setAutoDraw"):
                    thisComponent.setAutoDraw(False)
            # store stop times for Frame
            Frame.tStop = globalClock.getTime(format='float')
            Frame.tStopRefresh = tThisFlipGlobal
            thisExp.addData('Frame.stopped', Frame.tStop)
            # check responses
            if resp.keys in ['', [], None]:  # No response was made
                resp.keys = None
            frames.addData('resp.keys',resp.keys)
            if resp.keys != None:  # we had a response
                frames.addData('resp.rt', resp.rt)
                frames.addData('resp.duration', resp.duration)
            # using non-slip timing so subtract the expected duration of this Routine (unless ended on request)
            if Frame.maxDurationReached:
                routineTimer.addTime(-Frame.maxDuration)
            elif Frame.forceEnded:
                routineTimer.reset()
            else:
                routineTimer.addTime(-2.000000)
            # mark thisFrame as finished
            if hasattr(thisFrame, 'status'):
                thisFrame.status = FINISHED
            # if awaiting a pause, pause now
            if frames.status == PAUSED:
                thisExp.status = PAUSED
                pauseExperiment(
                    thisExp=thisExp, 
                    win=win, 
                    timers=[globalClock], 
                )
                # once done pausing, restore running status
                frames.status = STARTED
            thisExp.nextEntry()
            
        # completed 6.0 repeats of 'frames'
        frames.status = FINISHED
        
        if thisSession is not None:
            # if running in a Session with a Liaison client, send data up to now
            thisSession.sendExperimentData()
        # mark thisTrial as finished
        if hasattr(thisTrial, 'status'):
            thisTrial.status = FINISHED
        # if awaiting a pause, pause now
        if trials.status == PAUSED:
            thisExp.status = PAUSED
            pauseExperiment(
                thisExp=thisExp, 
                win=win, 
                timers=[globalClock], 
            )
            # once done pausing, restore running status
            trials.status = STARTED
        thisExp.nextEntry()
        
    # completed 1.0 repeats of 'trials'
    trials.status = FINISHED
    
    if thisSession is not None:
        # if running in a Session with a Liaison client, send data up to now
        thisSession.sendExperimentData()
    
    # --- Prepare to start Routine "ITI" ---
    # create an object to store info about Routine ITI
    ITI = data.Routine(
        name='ITI',
        components=[itiText, itiKey],
    )
    ITI.status = NOT_STARTED
    continueRoutine = True
    # update component parameters for each repeat
    # create starting attributes for itiKey
    itiKey.keys = []
    itiKey.rt = []
    _itiKey_allKeys = []
    # Run 'Begin Routine' code from itiTimer
    # make/reset a clock for this routine
    if 'itiClock' not in globals():
        itiClock = core.Clock()
    else:
        itiClock.reset()
    
    # store start times for ITI
    ITI.tStartRefresh = win.getFutureFlipTime(clock=globalClock)
    ITI.tStart = globalClock.getTime(format='float')
    ITI.status = STARTED
    thisExp.addData('ITI.started', ITI.tStart)
    ITI.maxDuration = None
    # keep track of which components have finished
    ITIComponents = ITI.components
    for thisComponent in ITI.components:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    frameN = -1
    
    # --- Run Routine "ITI" ---
    ITI.forceEnded = routineForceEnded = not continueRoutine
    while continueRoutine:
        # get current time
        t = routineTimer.getTime()
        tThisFlip = win.getFutureFlipTime(clock=routineTimer)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # *itiText* updates
        
        # if itiText is starting this frame...
        if itiText.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            itiText.frameNStart = frameN  # exact frame index
            itiText.tStart = t  # local t and not account for scr refresh
            itiText.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(itiText, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'itiText.started')
            # update status
            itiText.status = STARTED
            itiText.setAutoDraw(True)
        
        # if itiText is active this frame...
        if itiText.status == STARTED:
            # update params
            pass
        
        # *itiKey* updates
        waitOnFlip = False
        
        # if itiKey is starting this frame...
        if itiKey.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            itiKey.frameNStart = frameN  # exact frame index
            itiKey.tStart = t  # local t and not account for scr refresh
            itiKey.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(itiKey, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'itiKey.started')
            # update status
            itiKey.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(itiKey.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(itiKey.clearEvents, eventType='keyboard')  # clear events on next screen flip
        if itiKey.status == STARTED and not waitOnFlip:
            theseKeys = itiKey.getKeys(keyList=['return','enter','space'], ignoreKeys=["escape"], waitRelease=False)
            _itiKey_allKeys.extend(theseKeys)
            if len(_itiKey_allKeys):
                itiKey.keys = _itiKey_allKeys[-1].name  # just the last key pressed
                itiKey.rt = _itiKey_allKeys[-1].rt
                itiKey.duration = _itiKey_allKeys[-1].duration
                # a response ends the routine
                continueRoutine = False
        # Run 'Each Frame' code from itiTimer
        if itiClock.getTime() >= 5.0:
            continueRoutine = False
        
        
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=["escape"]):
            thisExp.status = FINISHED
        if thisExp.status == FINISHED or endExpNow:
            endExperiment(thisExp, win=win)
            return
        # pause experiment here if requested
        if thisExp.status == PAUSED:
            pauseExperiment(
                thisExp=thisExp, 
                win=win, 
                timers=[routineTimer, globalClock], 
                currentRoutine=ITI,
            )
            # skip the frame we paused on
            continue
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            ITI.forceEnded = routineForceEnded = True
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in ITI.components:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # --- Ending Routine "ITI" ---
    for thisComponent in ITI.components:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    # store stop times for ITI
    ITI.tStop = globalClock.getTime(format='float')
    ITI.tStopRefresh = tThisFlipGlobal
    thisExp.addData('ITI.stopped', ITI.tStop)
    # check responses
    if itiKey.keys in ['', [], None]:  # No response was made
        itiKey.keys = None
    thisExp.addData('itiKey.keys',itiKey.keys)
    if itiKey.keys != None:  # we had a response
        thisExp.addData('itiKey.rt', itiKey.rt)
        thisExp.addData('itiKey.duration', itiKey.duration)
    thisExp.nextEntry()
    # the Routine "ITI" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    
    # mark experiment as finished
    endExperiment(thisExp, win=win)


def saveData(thisExp):
    """
    Save data from this experiment
    
    Parameters
    ==========
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    """
    filename = thisExp.dataFileName
    # these shouldn't be strictly necessary (should auto-save)
    thisExp.saveAsWideText(filename + '.csv', delim='auto')
    thisExp.saveAsPickle(filename)


def endExperiment(thisExp, win=None):
    """
    End this experiment, performing final shut down operations.
    
    This function does NOT close the window or end the Python process - use `quit` for this.
    
    Parameters
    ==========
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    win : psychopy.visual.Window
        Window for this experiment.
    """
    if win is not None:
        # remove autodraw from all current components
        win.clearAutoDraw()
        # Flip one final time so any remaining win.callOnFlip() 
        # and win.timeOnFlip() tasks get executed
        win.flip()
    # return console logger level to WARNING
    logging.console.setLevel(logging.WARNING)
    # mark experiment handler as finished
    thisExp.status = FINISHED
    # run any 'at exit' functions
    for fcn in runAtExit:
        fcn()
    logging.flush()


def quit(thisExp, win=None, thisSession=None):
    """
    Fully quit, closing the window and ending the Python process.
    
    Parameters
    ==========
    win : psychopy.visual.Window
        Window to close.
    thisSession : psychopy.session.Session or None
        Handle of the Session object this experiment is being run from, if any.
    """
    thisExp.abort()  # or data files will save again on exit
    # make sure everything is closed down
    if win is not None:
        # Flip one final time so any remaining win.callOnFlip() 
        # and win.timeOnFlip() tasks get executed before quitting
        win.flip()
        win.close()
    logging.flush()
    if thisSession is not None:
        thisSession.stop()
    # terminate Python process
    core.quit()


# if running this experiment as a script...
if __name__ == '__main__':
    # call all functions in order
    expInfo = showExpInfoDlg(expInfo=expInfo)
    thisExp = setupData(expInfo=expInfo)
    logFile = setupLogging(filename=thisExp.dataFileName)
    win = setupWindow(expInfo=expInfo)
    setupDevices(expInfo=expInfo, thisExp=thisExp, win=win)
    run(
        expInfo=expInfo, 
        thisExp=thisExp, 
        win=win,
        globalClock='float'
    )
    saveData(thisExp=thisExp)
    quit(thisExp=thisExp, win=win)
