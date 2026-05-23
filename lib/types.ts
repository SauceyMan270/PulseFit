import type { ReactNode } from "react";

export type ThemeName = "mint" | "sky" | "blossom" | "peach" | "lavender" | "mono";

export const THEMES: Record<ThemeName, {
  label: string;
  bg: string;
  swatch: [string, string];
  vars: Record<string, string>;
}> = {
  mint: {
    label: "Mint",
    bg: "linear-gradient(165deg, #e7f7ef 0%, #e3f1fb 55%, #f3ecfb 100%)",
    swatch: ["#7fe3b8", "#7cc6f5"],
    vars: {
      "--accent": "#34c98a", "--accent-soft": "#d8f5e8", "--accent-text": "#0c5239",
      "--accent-2": "#52b6f0", "--accent-2-soft": "#dbeefc",
      "--accent-3": "#b69ce8", "--accent-3-soft": "#ece4fa",
      "--ink": "#1f3b34", "--ink-soft": "#5e7a72", "--ink-faint": "#9bb0a9",
      "--card-bg": "rgba(255,255,255,0.78)", "--card-solid": "#ffffff",
      "--surface": "#f1f7f4", "--sheet-bg": "#f4faf7",
      "--border-color": "rgba(255,255,255,0.9)", "--border-inner": "rgba(31,59,52,0.07)",
      "--nav-bg": "rgba(255,255,255,0.86)", "--nav-border": "rgba(31,59,52,0.06)",
      "--ring-track": "#e2efe9",
      "--shadow": "0 14px 34px -16px rgba(45,99,80,0.34)",
      "--shadow-soft": "0 8px 22px -14px rgba(45,99,80,0.28)",
    },
  },
  sky: {
    label: "Sky",
    bg: "linear-gradient(165deg, #e3f0fc 0%, #e7f5f6 55%, #eef0fc 100%)",
    swatch: ["#7cc6f5", "#9fd4dc"],
    vars: {
      "--accent": "#3aa6ee", "--accent-soft": "#d9ebfc", "--accent-text": "#0b3f63",
      "--accent-2": "#46c7c0", "--accent-2-soft": "#d6f1ef",
      "--accent-3": "#8aa0ec", "--accent-3-soft": "#e3e7fb",
      "--ink": "#1f3447", "--ink-soft": "#5d728a", "--ink-faint": "#9aaabc",
      "--card-bg": "rgba(255,255,255,0.78)", "--card-solid": "#ffffff",
      "--surface": "#eef5fb", "--sheet-bg": "#f2f8fc",
      "--border-color": "rgba(255,255,255,0.9)", "--border-inner": "rgba(31,52,71,0.07)",
      "--nav-bg": "rgba(255,255,255,0.86)", "--nav-border": "rgba(31,52,71,0.06)",
      "--ring-track": "#e1ecf5",
      "--shadow": "0 14px 34px -16px rgba(43,90,140,0.34)",
      "--shadow-soft": "0 8px 22px -14px rgba(43,90,140,0.28)",
    },
  },
  blossom: {
    label: "Blossom",
    bg: "linear-gradient(165deg, #fdeaf1 0%, #f6e9fa 55%, #eae9fb 100%)",
    swatch: ["#f7a8c8", "#c9a3ec"],
    vars: {
      "--accent": "#ec6fa0", "--accent-soft": "#fbe1ec", "--accent-text": "#6e1f43",
      "--accent-2": "#b07fe6", "--accent-2-soft": "#ece1fa",
      "--accent-3": "#6fb8e8", "--accent-3-soft": "#dcecfa",
      "--ink": "#3d2436", "--ink-soft": "#806174", "--ink-faint": "#b69eab",
      "--card-bg": "rgba(255,255,255,0.8)", "--card-solid": "#ffffff",
      "--surface": "#faf0f5", "--sheet-bg": "#fcf4f8",
      "--border-color": "rgba(255,255,255,0.92)", "--border-inner": "rgba(61,36,54,0.07)",
      "--nav-bg": "rgba(255,255,255,0.87)", "--nav-border": "rgba(61,36,54,0.06)",
      "--ring-track": "#f3e3eb",
      "--shadow": "0 14px 34px -16px rgba(150,60,100,0.32)",
      "--shadow-soft": "0 8px 22px -14px rgba(150,60,100,0.26)",
    },
  },
  peach: {
    label: "Peach",
    bg: "linear-gradient(165deg, #ffeede 0%, #fdece8 55%, #fbe9f1 100%)",
    swatch: ["#ffc28a", "#f7a8a0"],
    vars: {
      "--accent": "#f7945d", "--accent-soft": "#fde7d6", "--accent-text": "#7a3413",
      "--accent-2": "#ef7d8e", "--accent-2-soft": "#fbdee2",
      "--accent-3": "#e0a85f", "--accent-3-soft": "#f8ecd6",
      "--ink": "#46302a", "--ink-soft": "#8a6f64", "--ink-faint": "#bda99f",
      "--card-bg": "rgba(255,255,255,0.8)", "--card-solid": "#ffffff",
      "--surface": "#fdf1e8", "--sheet-bg": "#fef5ef",
      "--border-color": "rgba(255,255,255,0.92)", "--border-inner": "rgba(70,48,42,0.07)",
      "--nav-bg": "rgba(255,255,255,0.87)", "--nav-border": "rgba(70,48,42,0.06)",
      "--ring-track": "#f7e6d8",
      "--shadow": "0 14px 34px -16px rgba(170,90,55,0.32)",
      "--shadow-soft": "0 8px 22px -14px rgba(170,90,55,0.26)",
    },
  },
  lavender: {
    label: "Lavender",
    bg: "linear-gradient(165deg, #eee9fb 0%, #e8ecfb 55%, #e6f3f7 100%)",
    swatch: ["#c0a8ee", "#94b6ef"],
    vars: {
      "--accent": "#9d7fe6", "--accent-soft": "#e8e1fa", "--accent-text": "#3c2173",
      "--accent-2": "#6f9bea", "--accent-2-soft": "#e0e8fb",
      "--accent-3": "#5cc2c0", "--accent-3-soft": "#d8f0ef",
      "--ink": "#2f2a42", "--ink-soft": "#6f6885", "--ink-faint": "#a8a2bb",
      "--card-bg": "rgba(255,255,255,0.79)", "--card-solid": "#ffffff",
      "--surface": "#f2effb", "--sheet-bg": "#f6f3fc",
      "--border-color": "rgba(255,255,255,0.92)", "--border-inner": "rgba(47,42,66,0.07)",
      "--nav-bg": "rgba(255,255,255,0.87)", "--nav-border": "rgba(47,42,66,0.06)",
      "--ring-track": "#e7e1f5",
      "--shadow": "0 14px 34px -16px rgba(95,70,160,0.32)",
      "--shadow-soft": "0 8px 22px -14px rgba(95,70,160,0.26)",
    },
  },
  mono: {
    label: "Mono",
    bg: "linear-gradient(165deg, #ffffff 0%, #b0b0b0 50%, #1a1a1a 100%)",
    swatch: ["#1a1a1a", "#888888"],
    vars: {
      "--accent": "#1a1a1a", "--accent-soft": "#e0e0e0", "--accent-text": "#000000",
      "--accent-2": "#555555", "--accent-2-soft": "#e8e8e8",
      "--accent-3": "#888888", "--accent-3-soft": "#efefef",
      "--ink": "#111111", "--ink-soft": "#333333", "--ink-faint": "#666666",
      "--card-bg": "rgba(255,255,255,0.80)", "--card-solid": "#ffffff",
      "--surface": "#f0f0f0", "--sheet-bg": "#f5f5f5",
      "--border-color": "rgba(255,255,255,0.92)", "--border-inner": "rgba(0,0,0,0.07)",
      "--nav-bg": "rgba(255,255,255,0.88)", "--nav-border": "rgba(0,0,0,0.06)",
      "--ring-track": "#e0e0e0",
      "--shadow": "0 14px 34px -16px rgba(0,0,0,0.28)",
      "--shadow-soft": "0 8px 22px -14px rgba(0,0,0,0.20)",
    },
  },
};

export type TabKey = "home" | "workouts" | "progress" | "schedule" | "profile";

export type IconKey =
  | "home" | "dumbbell" | "chart" | "calendar" | "user" | "bell"
  | "settings" | "chevronRight" | "chevronDown" | "plus" | "flame"
  | "footprints" | "clock" | "check" | "trophy" | "pencil" | "target"
  | "moon" | "star" | "trending" | "zap" | "crown" | "x" | "pause"
  | "play" | "minus" | "sun" | "trash" | "refresh" | "heart" | "sparkle";

export type WorkoutLevel = "Beginner" | "Intermediate" | "Advanced";

export type Workout = {
  id: number;
  title: string;
  duration: number;
  level: WorkoutLevel;
  equipment: string;
  iconKey: IconKey;
  exercises: number;
  exerciseList: string[];
  description?: string;
  custom?: boolean;
};

export type ScheduledSession = {
  id: number;
  day: number; // 0-6, Mon-Sun
  title: string;
  sub: string;
  time: string;
  dur: number;
  iconKey: IconKey;
};

export type WeekRecord = {
  weekStart: string; // "2025-05-12" — ISO date of that Monday
  completed: number;
  goal: number;
};

export type CompletedSession = {
  id: number;
  title: string;
  date: string;
  durationMin: number;
  exerciseList?: string[];
};

export type SheetKey =
  | "editGoal" | "editProfile" | "goals"
  | "addSession" | "newWorkout" | "workoutType" | "libraryWorkout" | "account" | "settings"
  | "achievements" | "insights" | "reset" | "history" | null;

export type State = {
  onboarded: boolean;
  tab: TabKey;
  firstName: string;
  lastName: string;
  tier: string;
  level: number;
  xp: number;
  calories: number;
  calorieGoal: number;
  steps: number;
  activeMin: number;
  streak: number;
  workoutsThisMonth: number;
  caloriesThisMonth: number;
  weekCompleted: boolean[];
  selectedDay: number;
  theme: ThemeName;
  goalLabel: string;
  monthlyBars: number[];
  weekHistory: WeekRecord[];
  weekStartDate: string;
  weightUnit: "lbs" | "kg";
  workoutPlans: Workout[];
  sessions: ScheduledSession[];
  completedSessions: CompletedSession[];
  toast: string | null;
  openSheet: SheetKey;
  activeWorkout: Workout | null;
  detailWorkout: Workout | null;
  todayPlan: Workout | null;
};

export type Action =
  | { type: "hydrate"; payload: Partial<State> }
  | { type: "completeOnboarding"; firstName: string; weightUnit: "lbs" | "kg" }
  | { type: "resetAll" }
  | { type: "setTab"; tab: TabKey }
  | { type: "toggleWeekDay"; index: number }
  | { type: "selectDay"; day: number }
  | { type: "setTheme"; theme: ThemeName }
  | { type: "setGoal"; goal: string }
  | { type: "openSheet"; sheet: SheetKey }
  | { type: "closeSheet" }
  | { type: "setCalorieGoal"; val: number }
  | { type: "openWorkout"; workout: Workout }
  | { type: "closeWorkout" }
  | { type: "startWorkout"; workout: Workout }
  | { type: "stopWorkout" }
  | { type: "completeWorkout"; seconds: number }
  | { type: "updateProfile"; firstName: string; lastName: string }
  | { type: "addSession"; session: Omit<ScheduledSession, "id"> }
  | { type: "deleteSession"; id: number }
  | { type: "addWorkout"; workout: Omit<Workout, "id"> }
  | { type: "updateWorkout"; workout: Workout }
  | { type: "deleteWorkout"; id: number }
  | { type: "checkWeekReset" }
  | { type: "toast"; msg: string }
  | { type: "clearToast" };

export type Dispatch = (action: Action) => void;

export type IconProps = {
  d: string | string[];
  size?: number;
  stroke?: number;
  fill?: string;
  style?: React.CSSProperties;
};

export type WithChildren = { children: ReactNode };
