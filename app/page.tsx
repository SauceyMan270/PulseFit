"use client";

import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";

import BottomNav from "@/components/BottomNav";
import PopEffect from "@/components/PopEffect";
import Onboarding from "@/components/Onboarding";
import ActiveWorkoutScreen from "@/components/ActiveWorkoutScreen";

import HomeTab from "@/components/tabs/HomeTab";
import WorkoutsTab from "@/components/tabs/WorkoutsTab";
import ProgressTab from "@/components/tabs/ProgressTab";
import ScheduleTab from "@/components/tabs/ScheduleTab";
import ProfileTab from "@/components/tabs/ProfileTab";

import {
  WorkoutDetailSheet,
  NewWorkoutSheet,
  EditGoalSheet,
  EditProfileSheet,
  GoalsSheet,
  AddSessionSheet,
  AccountSheet,
  SettingsSheet,
  AchievementsSheet,
  InsightsSheet,
  ResetSheet,
  WorkoutTypeSheet,
  LibraryWorkoutSheet,
  HistorySheet,
} from "@/components/sheets";

import { blankState, reducer } from "@/lib/reducer";
import { clearStoredState, loadState, saveState } from "@/lib/storage";
import { THEMES } from "@/lib/types";
import type { TabKey, Workout } from "@/lib/types";

const tabMap = {
  home: HomeTab,
  workouts: WorkoutsTab,
  progress: ProgressTab,
  schedule: ScheduleTab,
  profile: ProfileTab,
} as const;

export default function Page() {
  const [state, dispatch] = useReducer(reducer, blankState);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: "hydrate", payload: saved });
    dispatch({ type: "checkWeekReset" });
    setHydrated(true);
  }, []);

  // iOS PWA: after keyboard dismisses, the body scroll offset stays non-zero
  // which offsets position:fixed elements and reveals the background beneath.
  // Force scroll to 0 whenever window resizes (keyboard open/close).
  useEffect(() => {
    const onResize = () => { window.scrollTo(0, 0); document.body.scrollTop = 0; };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  useLayoutEffect(() => {
    const t = THEMES[state.theme] ?? THEMES.mint;
    // Extract the 100%-stop color to use as background-color fallback.
    // The gradient only paints inside the element's box; iOS uses background-color
    // to fill the home-indicator zone (outside the box). Without this, it falls
    // back to transparent → white strip.
    const endColor = t.bg.match(/(#[0-9a-fA-F]+)\s+100%/)?.[1] ?? t.swatch[1];
    document.documentElement.style.background = t.bg;
    document.documentElement.style.backgroundColor = endColor;
    document.body.style.background = t.bg;
    document.body.style.backgroundColor = endColor;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
    meta.content = t.swatch[0];
  }, [state.theme]);

  const handleReset = () => {
    clearStoredState();
    dispatch({ type: "resetAll" });
  };

  const handleChange = (key: TabKey) => {
    if (key === state.tab) return;
    dispatch({ type: "setTab", tab: key });
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const openWorkout = (workout: Workout) => dispatch({ type: "openWorkout", workout });
  const startWorkout = (workout: Workout) => dispatch({ type: "startWorkout", workout });

  if (!hydrated) {
    return <div style={{ position: "fixed", inset: 0, background: "#e7f7ef" }} />;
  }

  const theme = THEMES[state.theme] ?? THEMES.mint;
  const Active = tabMap[state.tab];


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.bg,
        overflow: "hidden",
        ...(theme.vars as React.CSSProperties),
      }}
    >
      {!state.onboarded ? (
        <Onboarding onSubmit={(name, weightUnit) => dispatch({ type: "completeOnboarding", firstName: name, weightUnit })} />
      ) : state.activeWorkout ? (
        <ActiveWorkoutScreen
          workout={state.activeWorkout}
          onStop={() => dispatch({ type: "stopWorkout" })}
          onComplete={(seconds) => dispatch({ type: "completeWorkout", seconds })}
        />
      ) : (
        <>
          {/* ambient background blobs */}
          <div key={`b0-${state.theme}`} className="blob" style={{ width: 260, height: 260, background: theme.swatch[0], top: -80, right: -70 }} />
          <div key={`b1-${state.theme}`} className="blob" style={{ width: 230, height: 230, background: theme.swatch[1], top: 320, left: -90 }} />

          <div
            ref={scrollRef}
            className="hide-scroll"
            style={{
              position: "absolute",
              top: "env(safe-area-inset-top)",
              left: 0,
              right: 0,
              bottom: 0,
              overflowY: "auto",
              paddingBottom: "calc(120px + env(safe-area-inset-bottom))",
            }}
          >
            <Active
              key={state.theme}
              state={state}
              dispatch={dispatch}
              openWorkout={openWorkout}
              startWorkout={startWorkout}
            />
          </div>

          <BottomNav active={state.tab} onChange={handleChange} />
        </>
      )}

      {/* Sheets */}
      {state.openSheet === "editGoal" && <EditGoalSheet state={state} dispatch={dispatch} />}
      {state.openSheet === "editProfile" && <EditProfileSheet state={state} dispatch={dispatch} />}
      {state.openSheet === "goals" && <GoalsSheet state={state} dispatch={dispatch} />}
      {state.openSheet === "addSession" && <AddSessionSheet state={state} dispatch={dispatch} />}
      {state.openSheet === "newWorkout" && <NewWorkoutSheet state={state} dispatch={dispatch} />}
      {state.openSheet === "account" && <AccountSheet state={state} dispatch={dispatch} />}
      {state.openSheet === "settings" && <SettingsSheet state={state} dispatch={dispatch} />}
      {state.openSheet === "achievements" && <AchievementsSheet state={state} dispatch={dispatch} />}
      {state.openSheet === "insights" && <InsightsSheet state={state} dispatch={dispatch} />}
      {state.openSheet === "reset" && <ResetSheet dispatch={dispatch} onReset={handleReset} />}
      {state.openSheet === "workoutType" && <WorkoutTypeSheet dispatch={dispatch} />}
      {state.openSheet === "libraryWorkout" && <LibraryWorkoutSheet dispatch={dispatch} weightUnit={state.weightUnit} />}
      {state.openSheet === "history" && <HistorySheet state={state} dispatch={dispatch} />}

      {state.detailWorkout && (
        <WorkoutDetailSheet
          workout={state.detailWorkout}
          dispatch={dispatch}
          weightUnit={state.weightUnit}
          onStart={(w) => dispatch({ type: "startWorkout", workout: w })}
          onDelete={(id) => dispatch({ type: "deleteWorkout", id })}
          onClose={() => dispatch({ type: "closeWorkout" })}
        />
      )}

      {state.toast && <PopEffect msg={state.toast} onDone={() => dispatch({ type: "clearToast" })} />}
    </div>
  );
}
