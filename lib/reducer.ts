import type { Action, State, Workout } from "./types";

function calcXP(workout: Workout, seconds: number): number {
  const levelMult = workout.level === "Advanced" ? 1.5 : workout.level === "Intermediate" ? 1.25 : 1;
  let base = 0;
  for (const raw of workout.exerciseList ?? []) {
    const m = raw.match(/—\s*(\d+)×(\d+)(?:\s*@\s*([\d.]+))?/);
    if (m) {
      const sets = parseInt(m[1], 10);
      const reps = parseInt(m[2], 10);
      const weight = m[3] ? parseFloat(m[3]) : 0;
      base += sets * reps * (1 + weight / 100);
    } else {
      base += 30; // unstructured exercise fallback
    }
  }
  const durationBonus = Math.round(seconds / 60);
  return Math.max(25, Math.round(base * levelMult) + durationBonus);
}

function getMondayISO(): string {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

export const blankState: State = {
  onboarded: false,
  tab: "home",
  firstName: "",
  lastName: "",
  tier: "Free",
  level: 1,
  xp: 0,
  calories: 0,
  calorieGoal: 800,
  steps: 0,
  activeMin: 0,
  streak: 0,
  workoutsThisMonth: 0,
  caloriesThisMonth: 0,
  weekCompleted: [false, false, false, false, false, false, false],
  selectedDay: (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  })(),
  theme: "mint",
  goalLabel: "Build Strength",
  monthlyBars: Array(30).fill(0),
  weekHistory: [],
  weekStartDate: getMondayISO(),
  weightUnit: "lbs",
  workoutPlans: [],
  sessions: [],
  completedSessions: [],
  toast: null,
  openSheet: null,
  activeWorkout: null,
  detailWorkout: null,
  todayPlan: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate": {
      const validThemes = ["mint", "sky", "blossom", "peach", "lavender"];
      const payload = { ...action.payload };
      if (!validThemes.includes(payload.theme as string)) payload.theme = "mint";
      if (!payload.completedSessions) payload.completedSessions = [];
      return { ...blankState, ...payload };
    }
    case "completeOnboarding":
      return { ...state, onboarded: true, firstName: action.firstName, lastName: "", weightUnit: action.weightUnit };
    case "resetAll":
      return { ...blankState, onboarded: false };
    case "setTab":
      return { ...state, tab: action.tab };
    case "toggleWeekDay": {
      const next = [...state.weekCompleted];
      next[action.index] = !next[action.index];
      const delta = next[action.index] ? 1 : -1;
      return {
        ...state,
        weekCompleted: next,
        workoutsThisMonth: Math.max(0, state.workoutsThisMonth + delta),
      };
    }
    case "selectDay":
      return { ...state, selectedDay: action.day };
    case "setTheme":
      return { ...state, theme: action.theme };
    case "setGoal":
      return { ...state, goalLabel: action.goal, openSheet: null, toast: `Goal set: ${action.goal}` };
    case "openSheet":
      return { ...state, openSheet: action.sheet };
    case "closeSheet":
      return { ...state, openSheet: null };
    case "setCalorieGoal":
      return { ...state, calorieGoal: action.val, openSheet: null, toast: `Daily goal: ${action.val} kcal` };
    case "openWorkout":
      return { ...state, detailWorkout: action.workout };
    case "closeWorkout":
      return { ...state, detailWorkout: null };
    case "startWorkout":
      return { ...state, activeWorkout: action.workout, detailWorkout: null };
    case "stopWorkout":
      return { ...state, activeWorkout: null };
    case "completeWorkout": {
      const todayIdx = state.selectedDay;
      const next = [...state.weekCompleted];
      const wasDone = next[todayIdx];
      next[todayIdx] = true;
      const newBars = [...state.monthlyBars];
      const dayOfMonth = new Date().getDate() - 1;
      if (dayOfMonth >= 0 && dayOfMonth < 30) {
        newBars[dayOfMonth] = (newBars[dayOfMonth] || 0) + 1;
      }
      const newSession = {
        id: Date.now(),
        title: state.activeWorkout?.title ?? "Workout",
        date: new Date().toISOString(),
        durationMin: Math.round(action.seconds / 60),
        exerciseList: state.activeWorkout?.exerciseList ?? [],
      };
      const completedId = state.activeWorkout?.id;
      const earned = state.activeWorkout ? calcXP(state.activeWorkout, action.seconds) : 25;
      return {
        ...state,
        activeWorkout: null,
        workoutPlans: completedId != null ? state.workoutPlans.filter((w) => w.id !== completedId) : state.workoutPlans,
        weekCompleted: next,
        activeMin: state.activeMin + Math.round(action.seconds / 60),
        steps: state.steps + Math.round(action.seconds * 1.4),
        workoutsThisMonth: wasDone ? state.workoutsThisMonth : state.workoutsThisMonth + 1,
        xp: state.xp + earned,
        streak: wasDone ? state.streak : state.streak + 1,
        monthlyBars: newBars,
        completedSessions: [...(state.completedSessions ?? []), newSession],
        toast: `Nice work! +${earned} XP`,
      };
    }
    case "updateProfile":
      return {
        ...state,
        firstName: action.firstName,
        lastName: action.lastName,
        openSheet: null,
        toast: "Profile updated",
      };
    case "addSession":
      return {
        ...state,
        sessions: [...state.sessions, { ...action.session, id: Date.now() }],
        openSheet: null,
        toast: "Session added",
      };
    case "deleteSession":
      return {
        ...state,
        sessions: state.sessions.filter((s) => s.id !== action.id),
        toast: "Session removed",
      };
    case "addWorkout": {
      const wk = { ...action.workout, id: Date.now() };
      return {
        ...state,
        workoutPlans: [...state.workoutPlans, wk],
        openSheet: null,
        toast: "Workout created",
        todayPlan: state.todayPlan ?? wk,
      };
    }
    case "updateWorkout": {
      return {
        ...state,
        workoutPlans: state.workoutPlans.map((w) => w.id === action.workout.id ? action.workout : w),
        detailWorkout: action.workout,
        todayPlan: state.todayPlan?.id === action.workout.id ? action.workout : state.todayPlan,
        toast: "Workout updated",
      };
    }
    case "deleteWorkout": {
      const remaining = state.workoutPlans.filter((w) => w.id !== action.id);
      return {
        ...state,
        workoutPlans: remaining,
        todayPlan: state.todayPlan?.id === action.id ? remaining[0] ?? null : state.todayPlan,
        detailWorkout: null,
        toast: "Workout deleted",
      };
    }
    case "checkWeekReset": {
      const currentMonday = getMondayISO();
      const storedMonday = state.weekStartDate || "";
      if (storedMonday === currentMonday) return state;
      const completedCount = state.weekCompleted.filter(Boolean).length;
      const history = completedCount > 0 || storedMonday
        ? [
            { weekStart: storedMonday || currentMonday, completed: completedCount, goal: 7 },
            ...(state.weekHistory || []),
          ].slice(0, 12)
        : state.weekHistory || [];
      return {
        ...state,
        weekCompleted: [false, false, false, false, false, false, false],
        weekStartDate: currentMonday,
        weekHistory: history,
      };
    }
    case "toast":
      return { ...state, toast: action.msg };
    case "clearToast":
      return { ...state, toast: null };
    default:
      return state;
  }
}

export function greetingForHour(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
