"use client";

import { useState, useMemo } from "react";
import Icon from "../Icon";
import Sheet from "../Sheet";
import PillBtn from "../PillBtn";
import NumInput from "../NumInput";
import { icons, workoutIconOptions } from "@/lib/icons";
import { THEMES } from "@/lib/types";
import { EXERCISES, MUSCLE_TABS, EQUIPMENT_CHIPS, matchesEquipment } from "@/lib/exercises";
import type {
  Dispatch,
  IconKey,
  State,
  ThemeName,
  Workout,
  WorkoutLevel,
} from "@/lib/types";

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "var(--surface)",
  border: "1px solid var(--border-inner)",
  borderRadius: 16,
  padding: "13px 15px",
  color: "var(--ink)",
  fontSize: 15,
  fontWeight: 600,
  fontFamily: "inherit",
  outline: "none",
  marginTop: 6,
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 13,
  color: "var(--ink-soft)",
  fontWeight: 700,
  display: "block",
};

// ─── Workout Detail ────────────────────────────────────────────────────────
function parseExLine(raw: string): { name: string; sets: number; reps: number; weight: number } {
  const m = raw.match(/^(.+?)\s*—\s*(\d+)×(\d+)(?:\s*@\s*([\d.]+))?/);
  if (m) return { name: m[1], sets: parseInt(m[2]), reps: parseInt(m[3]), weight: m[4] ? parseFloat(m[4]) : 0 };
  return { name: raw, sets: 3, reps: 10, weight: 0 };
}

export function WorkoutDetailSheet({
  workout,
  onStart,
  onDelete,
  onClose,
  dispatch,
  weightUnit = "lbs",
}: {
  workout: Workout | null;
  onStart: (w: Workout) => void;
  onDelete?: (id: number) => void;
  onClose: () => void;
  dispatch?: Dispatch;
  weightUnit?: "lbs" | "kg";
}) {
  const [editing, setEditing] = useState(false);
  const [browsing, setBrowsing] = useState(false);
  const [browseSearch, setBrowseSearch] = useState("");
  const [browseTab, setBrowseTab] = useState("all");
  const [browseEquip, setBrowseEquip] = useState("all");
  const [browseSelected, setBrowseSelected] = useState<string[]>([]);
  const [editExercises, setEditExercises] = useState<{ name: string; sets: number; reps: number; weight: number }[]>([]);
  const [editDuration, setEditDuration] = useState(workout?.duration ?? 30);

  const browseFiltered = useMemo(() => {
    const q = browseSearch.toLowerCase();
    return EXERCISES.filter((ex) => {
      if (browseTab !== "all" && !ex.group.includes(browseTab)) return false;
      if (!matchesEquipment(ex, browseEquip)) return false;
      if (q && !ex.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [browseSearch, browseTab, browseEquip]);

  if (!workout) return null;

  const exerciseList =
    workout.exerciseList && workout.exerciseList.length > 0
      ? workout.exerciseList
      : Array.from({ length: workout.exercises || 6 }, (_, i) => `Exercise ${i + 1}`);

  const startEditing = () => {
    setEditExercises(exerciseList.map(parseExLine));
    setEditDuration(workout.duration ?? 30);
    setEditing(true);
  };

  const saveEdit = () => {
    if (!dispatch) return;
    const clean = editExercises
      .filter((e) => e.name.trim())
      .map((e) => `${e.name.trim()} — ${e.sets}×${e.reps}${e.weight > 0 ? ` @ ${e.weight}${weightUnit}` : ""}`);
    dispatch({
      type: "updateWorkout",
      workout: { ...workout, duration: editDuration, exerciseList: clean, exercises: clean.length },
    });
    setEditing(false);
  };

  const updateEx = (i: number, field: "name" | "sets" | "reps" | "weight", val: string | number) => {
    const next = [...editExercises];
    next[i] = { ...next[i], [field]: val };
    setEditExercises(next);
  };

  const iconBtn: React.CSSProperties = {
    width: 58, height: 58, borderRadius: 999,
    background: "var(--surface)", border: "1.6px solid var(--border-inner)",
    color: "var(--ink-soft)", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  };

  return (
    <Sheet open title={editing ? "Edit Workout" : workout.title} onClose={() => { setEditing(false); onClose(); }}>
      <div style={{ paddingBottom: 8 }}>
        {!editing ? (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
              {[`${workout.duration} min`, `${workout.exercises || exerciseList.length} exercises`, workout.level, workout.equipment]
                .filter(Boolean).map((t, i) => (
                  <div key={i} style={{ padding: "7px 13px", borderRadius: 999, background: "var(--accent-soft)", fontSize: 12.5, color: "var(--accent-text)", fontWeight: 700 }}>{t}</div>
                ))}
            </div>

            {workout.description && (
              <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55, marginBottom: 20, fontWeight: 500 }}>{workout.description}</div>
            )}

            <div style={{ fontSize: 13, color: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10, fontWeight: 800 }}>Exercises</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
              {exerciseList.map((ex, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface)", borderRadius: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--accent-text)", fontWeight: 800 }}>{i + 1}</div>
                  <span style={{ flex: 1, fontSize: 14.5, color: "var(--ink)", fontWeight: 600 }}>{ex}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {onDelete && workout.id && (
                <button onClick={() => onDelete(workout.id)} style={iconBtn}>
                  <Icon d={icons.trash} size={19} stroke={2} />
                </button>
              )}
              {dispatch && (
                <button onClick={startEditing} style={iconBtn}>
                  <Icon d={icons.pencil} size={19} stroke={2} />
                </button>
              )}
              <button
                onClick={() => onStart(workout)}
                style={{
                  flex: 1, height: 58, borderRadius: 999, border: "none", cursor: "pointer",
                  background: "var(--accent)", display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 10,
                  fontSize: 16.5, fontWeight: 700, fontFamily: '"Quicksand", sans-serif',
                  color: "#fff", letterSpacing: "0.01em",
                }}
              >
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon d={icons.play} size={14} fill="#fff" stroke={0} style={{ color: "#fff" }} />
                </div>
                Begin Workout
              </button>
            </div>
          </>
        ) : browsing ? (
          /* ── Browse library to add exercises ── */
          <>
            <input
              value={browseSearch}
              onChange={(e) => setBrowseSearch(e.target.value)}
              placeholder="Search exercises..."
              style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border-inner)", borderRadius: 16, padding: "13px 15px", color: "var(--ink)", fontSize: 15, fontWeight: 600, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 10 }}
            />
            <div className="hide-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 8, paddingBottom: 2 }}>
              {MUSCLE_TABS.map((tab) => (
                <button key={tab.key} onClick={() => setBrowseTab(tab.key)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 999, border: "none", background: browseTab === tab.key ? "var(--accent)" : "var(--surface)", color: browseTab === tab.key ? "#fff" : "var(--ink-soft)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{tab.label}</button>
              ))}
            </div>
            <div className="hide-scroll" style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 10, paddingBottom: 2 }}>
              {EQUIPMENT_CHIPS.map((chip) => (
                <button key={chip.key} onClick={() => setBrowseEquip(chip.key)} style={{ flexShrink: 0, padding: "5px 11px", borderRadius: 999, border: "none", background: browseEquip === chip.key ? "var(--accent-2-soft)" : "var(--surface)", color: browseEquip === chip.key ? "var(--accent-2)" : "var(--ink-faint)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{chip.label}</button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-faint)", marginBottom: 6, fontWeight: 700 }}>
              {browseFiltered.length} exercise{browseFiltered.length !== 1 ? "s" : ""}
              {browseSelected.length > 0 && <span style={{ color: "var(--accent)", marginLeft: 8 }}>· {browseSelected.length} selected</span>}
            </div>
            <div style={{ marginBottom: 16 }}>
              {browseFiltered.map((ex, i) => {
                const isSel = browseSelected.includes(ex.name);
                return (
                  <div key={ex.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: i < browseFiltered.length - 1 ? "1px solid var(--border-inner)" : "none" }}>
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <div style={{ fontSize: 14, color: "var(--ink)", fontWeight: 700 }}>{ex.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2, fontWeight: 500 }}>{ex.primary.slice(0, 2).join(", ").replace(/_/g, " ")}</div>
                    </div>
                    <button onClick={() => setBrowseSelected(prev => prev.includes(ex.name) ? prev.filter(n => n !== ex.name) : [...prev, ex.name])} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: isSel ? "var(--accent)" : "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                      <Icon d={isSel ? icons.check : icons.plus} size={14} stroke={isSel ? 3 : 2.6} style={{ color: isSel ? "#fff" : "var(--ink-soft)" }} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div style={{ position: "sticky", bottom: 0, background: "var(--sheet-bg)", paddingTop: 10, paddingBottom: 4, borderTop: "1px solid var(--border-inner)", display: "flex", gap: 10 }}>
              <button onClick={() => { setBrowsing(false); setBrowseSelected([]); setBrowseSearch(""); }} style={iconBtn}>
                <Icon d={icons.x} size={19} stroke={2.4} />
              </button>
              <div style={{ flex: 1 }}>
                <PillBtn
                  disabled={browseSelected.length === 0}
                  onClick={() => {
                    const existing = editExercises.map(e => e.name);
                    const newOnes = browseSelected.filter(n => !existing.includes(n)).map(n => ({ name: n, sets: 3, reps: 10, weight: 0 }));
                    setEditExercises([...editExercises, ...newOnes]);
                    setBrowsing(false);
                    setBrowseSelected([]);
                    setBrowseSearch("");
                  }}
                >
                  Add {browseSelected.length > 0 ? browseSelected.length : ""} Exercise{browseSelected.length !== 1 ? "s" : ""}
                </PillBtn>
              </div>
            </div>
          </>
        ) : (
          /* ── Edit exercise list ── */
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 8 }}>Duration</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ val: 15, label: "15m" }, { val: 30, label: "30m" }, { val: 45, label: "45m" }, { val: 60, label: "1hr" }, { val: 90, label: "90m" }].map(({ val, label }) => {
                  const active = editDuration === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setEditDuration(val)}
                      style={{
                        flex: 1, height: 44, borderRadius: 14, border: "none", cursor: "pointer",
                        background: active ? "var(--accent)" : "var(--surface)",
                        color: active ? "#fff" : "var(--ink-soft)",
                        fontSize: 13.5, fontWeight: 700, fontFamily: "inherit",
                        transition: "background 0.15s, color 0.15s",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
              {editExercises.map((ex, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--accent-text)", fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                    <input
                      value={ex.name}
                      onChange={(e) => updateEx(i, "name", e.target.value)}
                      style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border-inner)", borderRadius: 13, padding: "11px 14px", color: "var(--ink)", fontSize: 14, fontWeight: 600, fontFamily: "inherit", outline: "none" }}
                    />
                    {editExercises.length > 1 && (
                      <button onClick={() => setEditExercises(editExercises.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                        <Icon d={icons.x} size={16} stroke={2.4} style={{ color: "var(--ink-faint)" }} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 6, paddingLeft: 36, paddingRight: editExercises.length > 1 ? 32 : 0 }}>
                    {(["sets", "reps", "weight"] as const).map((field) => (
                      <div key={field} style={{ flex: 1, background: "var(--surface)", border: "1px solid var(--border-inner)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 6px 8px", gap: 4 }}>
                        <NumInput value={ex[field]} onChange={(v) => updateEx(i, field, v)} />
                        <span style={{ fontSize: 10, fontWeight: 800, color: "var(--ink-faint)", letterSpacing: "0.06em" }}>{field === "weight" ? weightUnit.toUpperCase() : field.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => { setBrowseSelected([]); setBrowsing(true); }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 13, background: "var(--accent-soft)", border: "none", color: "var(--accent-text)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
              >
                <Icon d={icons.plus} size={13} stroke={2.6} /> Add exercise
              </button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(false)} style={iconBtn}>
                <Icon d={icons.x} size={19} stroke={2.4} />
              </button>
              <div style={{ flex: 1 }}>
                <PillBtn onClick={saveEdit}>Save Changes</PillBtn>
              </div>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}

// ─── New Workout ───────────────────────────────────────────────────────────
export function NewWorkoutSheet({ dispatch }: { state: State; dispatch: Dispatch }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(30);
  const [level, setLevel] = useState<WorkoutLevel>("Intermediate");
  const [equipment, setEquipment] = useState("");
  const [iconKey, setIconKey] = useState<IconKey>("dumbbell");
  const [exercises, setExercises] = useState<string[]>([""]);
  const [description, setDescription] = useState("");

  const updateExercise = (i: number, val: string) => {
    const next = [...exercises];
    next[i] = val;
    setExercises(next);
  };
  const addExercise = () => setExercises([...exercises, ""]);
  const removeExercise = (i: number) => setExercises(exercises.filter((_, j) => j !== i));

  const canSave = title.trim() && duration > 0 && exercises.some((e) => e.trim());

  const save = () => {
    const cleanExercises = exercises.map((e) => e.trim()).filter(Boolean);
    dispatch({
      type: "addWorkout",
      workout: {
        title: title.trim(),
        duration,
        level,
        equipment: equipment.trim() || "Mixed",
        iconKey,
        exercises: cleanExercises.length,
        exerciseList: cleanExercises,
        description: description.trim(),
        custom: true,
      },
    });
  };

  return (
    <Sheet open title="New Workout" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ paddingBottom: 8 }}>
        <label style={LABEL_STYLE}>
          Workout name
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Morning Push"
            style={INPUT_STYLE}
            autoFocus
          />
        </label>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <label style={{ ...LABEL_STYLE, flex: 1 }}>
            Duration (min)
            <input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(Math.max(1, Number(e.target.value) || 0))}
              style={INPUT_STYLE}
            />
          </label>
          <label style={{ ...LABEL_STYLE, flex: 1 }}>
            Equipment
            <input
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="Optional"
              style={INPUT_STYLE}
            />
          </label>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Difficulty</div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["Beginner", "Intermediate", "Advanced"] as WorkoutLevel[]).map((l) => {
              const active = level === l;
              return (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    borderRadius: 13,
                    background: active ? "var(--accent)" : "var(--surface)",
                    color: active ? "#fff" : "var(--ink-soft)",
                    border: "none",
                    fontSize: 12.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: '"Quicksand", sans-serif',
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Icon</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {workoutIconOptions.map((opt) => {
              const d = icons[opt.key];
              const active = iconKey === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setIconKey(opt.key)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 16,
                    background: active ? "var(--accent)" : "var(--surface)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={active ? "#fff" : "var(--ink-soft)"}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {Array.isArray(d) ? d.map((p, j) => <path key={j} d={p} />) : <path d={d} />}
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        <label style={{ ...LABEL_STYLE, marginTop: 16 }}>
          Description (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief notes about the workout..."
            rows={2}
            style={{ ...INPUT_STYLE, resize: "none", lineHeight: 1.4 }}
          />
        </label>

        <div style={{ marginTop: 18, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={LABEL_STYLE}>Exercises</span>
          <button
            onClick={addExercise}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 12px",
              borderRadius: 999,
              background: "var(--accent-soft)",
              border: "none",
              color: "var(--accent-text)",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            <Icon d={icons.plus} size={12} stroke={2.6} />
            Add
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "var(--accent-text)",
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <input
                value={ex}
                onChange={(e) => updateExercise(i, e.target.value)}
                placeholder="e.g. Bench Press"
                style={{
                  flex: 1,
                  background: "var(--surface)",
                  border: "1px solid var(--border-inner)",
                  borderRadius: 13,
                  padding: "11px 14px",
                  color: "var(--ink)",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              {exercises.length > 1 && (
                <button
                  onClick={() => removeExercise(i)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
                >
                  <Icon d={icons.x} size={16} stroke={2.4} style={{ color: "var(--ink-faint)" }} />
                </button>
              )}
            </div>
          ))}
        </div>

        <PillBtn onClick={save} disabled={!canSave}>
          Save Workout
        </PillBtn>
      </div>
    </Sheet>
  );
}

// ─── Edit Goal ─────────────────────────────────────────────────────────────
export function EditGoalSheet({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  const [val, setVal] = useState(state.calorieGoal);
  return (
    <Sheet open title="Daily Calorie Goal" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ paddingBottom: 8 }}>
        <div style={{ textAlign: "center", padding: "20px 0 26px" }}>
          <div
            className="font-display"
            style={{ fontSize: 56, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
          >
            {val}
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4, fontWeight: 600 }}>kcal per day</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <button
            onClick={() => setVal((v) => Math.max(200, v - 50))}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "none",
              background: "var(--surface)",
              color: "var(--ink)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon d={icons.minus} size={18} stroke={2.4} />
          </button>
          <input
            type="range"
            min={200}
            max={2000}
            step={50}
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
            style={{ flex: 1, accentColor: "var(--accent)" }}
          />
          <button
            onClick={() => setVal((v) => Math.min(2000, v + 50))}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "none",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon d={icons.plus} size={18} stroke={2.4} />
          </button>
        </div>
        <PillBtn onClick={() => dispatch({ type: "setCalorieGoal", val })}>Save</PillBtn>
      </div>
    </Sheet>
  );
}

// ─── Edit Profile ──────────────────────────────────────────────────────────
export function EditProfileSheet({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  const [first, setFirst] = useState(state.firstName);
  const [last, setLast] = useState(state.lastName);
  return (
    <Sheet open title="Edit Profile" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ paddingBottom: 8 }}>
        <label style={{ ...LABEL_STYLE, marginTop: 8 }}>
          First name
          <input value={first} onChange={(e) => setFirst(e.target.value)} style={{ ...INPUT_STYLE, padding: "14px 16px" }} />
        </label>
        <label style={{ ...LABEL_STYLE, marginTop: 16, marginBottom: 24, display: "block" }}>
          Last name (optional)
          <input value={last} onChange={(e) => setLast(e.target.value)} style={{ ...INPUT_STYLE, padding: "14px 16px" }} />
        </label>
        <PillBtn
          onClick={() => dispatch({ type: "updateProfile", firstName: first.trim(), lastName: last.trim() })}
          disabled={!first.trim()}
        >
          Save Changes
        </PillBtn>
      </div>
    </Sheet>
  );
}

// ─── Goals ─────────────────────────────────────────────────────────────────
export function GoalsSheet({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  const opts = ["Build Strength", "Lose Weight", "Build Muscle", "Improve Endurance", "Stay Active"];
  return (
    <Sheet open title="Fitness Goal" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingBottom: 8 }}>
        {opts.map((o) => {
          const active = state.goalLabel === o;
          return (
            <button
              key={o}
              onClick={() => dispatch({ type: "setGoal", goal: o })}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 18px",
                background: active ? "var(--accent)" : "var(--surface)",
                border: "none",
                borderRadius: 18,
                color: active ? "#fff" : "var(--ink)",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: '"Quicksand", sans-serif',
              }}
            >
              {o}
              {active && <Icon d={icons.check} size={18} stroke={3} style={{ color: "#fff" }} />}
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

// ─── Add Session ───────────────────────────────────────────────────────────
export function AddSessionSheet({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(state.selectedDay);
  const [time, setTime] = useState("7:00 AM");
  const [dur, setDur] = useState(30);
  const [iconKey, setIconKey] = useState<IconKey>("dumbbell");
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const presetFromWorkout = (w: Workout) => {
    setTitle(w.title);
    setDur(w.duration);
    setIconKey(w.iconKey || "dumbbell");
  };

  return (
    <Sheet open title="New Session" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ paddingBottom: 8 }}>
        {state.workoutPlans.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...LABEL_STYLE, marginBottom: 8 }}>Quick pick from your workouts</div>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }} className="hide-scroll">
              {state.workoutPlans.map((w) => (
                <button
                  key={w.id}
                  onClick={() => presetFromWorkout(w)}
                  style={{
                    flexShrink: 0,
                    padding: "8px 14px",
                    background: "var(--accent-soft)",
                    border: "none",
                    borderRadius: 999,
                    color: "var(--accent-text)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: '"Quicksand", sans-serif',
                    whiteSpace: "nowrap",
                  }}
                >
                  {w.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <label style={LABEL_STYLE}>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Morning Run"
            style={INPUT_STYLE}
          />
        </label>

        <div style={{ ...LABEL_STYLE, marginTop: 16, marginBottom: 6 }}>Day</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {days.map((d, i) => {
            const active = day === i;
            return (
              <button
                key={d}
                onClick={() => setDay(i)}
                style={{
                  padding: "11px 0",
                  borderRadius: 13,
                  background: active ? "var(--accent)" : "var(--surface)",
                  color: active ? "#fff" : "var(--ink-soft)",
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: '"Quicksand", sans-serif',
                }}
              >
                {d}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 16, marginBottom: 24 }}>
          <label style={{ ...LABEL_STYLE, flex: 1 }}>
            Time
            <input value={time} onChange={(e) => setTime(e.target.value)} style={INPUT_STYLE} />
          </label>
          <label style={{ ...LABEL_STYLE, flex: 1 }}>
            Duration (min)
            <input
              type="number"
              value={dur}
              onChange={(e) => setDur(Number(e.target.value))}
              style={INPUT_STYLE}
            />
          </label>
        </div>

        <PillBtn
          disabled={!title.trim()}
          onClick={() =>
            dispatch({
              type: "addSession",
              session: { day, iconKey, title: title.trim(), sub: "Scheduled session", time, dur },
            })
          }
        >
          Add to Schedule
        </PillBtn>
      </div>
    </Sheet>
  );
}

// ─── Account ───────────────────────────────────────────────────────────────
export function AccountSheet({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  return (
    <Sheet open title="Account" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingBottom: 8 }}>
        {[
          { label: "Name", val: `${state.firstName}${state.lastName ? " " + state.lastName : ""}` },
          { label: "Subscription", val: state.tier },
          { label: "Level", val: `${state.level} (${state.xp.toLocaleString()} XP)` },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px 17px",
              background: "var(--surface)",
              borderRadius: 16,
            }}
          >
            <span style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 600 }}>{r.label}</span>
            <span style={{ fontSize: 14, color: "var(--ink)", fontWeight: 700 }}>{r.val}</span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ─── Settings ──────────────────────────────────────────────────────────────
export function SettingsSheet({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  const themeList = (Object.keys(THEMES) as ThemeName[]).map((key) => ({
    key,
    label: THEMES[key].label,
    swatch: THEMES[key].swatch,
  }));
  return (
    <Sheet open title="Settings" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ marginBottom: 24, paddingBottom: 8 }}>
        <div style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 14 }}>
          Theme
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {themeList.map((t) => {
            const active = state.theme === t.key;
            return (
              <button
                key={t.key}
                onClick={() => dispatch({ type: "setTheme", theme: t.key })}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 17,
                    background: `linear-gradient(140deg, ${t.swatch[0]} 0%, ${t.swatch[1]} 100%)`,
                    border: active ? "3px solid var(--accent)" : "3px solid transparent",
                    boxShadow: "0 4px 10px -4px rgba(0,0,0,0.25)",
                    transition: "border 0.15s",
                  }}
                />
                <span style={{ fontSize: 11, color: active ? "var(--ink)" : "var(--ink-faint)", fontWeight: active ? 800 : 600 }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => dispatch({ type: "toast", msg: "Pulse v2.0.0" })}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 18px",
            width: "100%",
            background: "var(--surface)",
            border: "none",
            borderRadius: 16,
            color: "var(--ink)",
            cursor: "pointer",
            fontFamily: "inherit",
            textAlign: "left",
            marginTop: 20,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700 }}>About</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 600 }}>v2.0.0</span>
            <Icon d={icons.chevronRight} size={15} stroke={2.4} style={{ color: "var(--ink-faint)" }} />
          </span>
        </button>
      </div>
    </Sheet>
  );
}

// ─── Achievements ──────────────────────────────────────────────────────────
export function AchievementsSheet({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  const items = [
    { title: "First Workout", sub: "Complete your first session", earned: state.workoutsThisMonth >= 1 },
    { title: "Week Warrior", sub: "Complete 7 workouts", earned: state.workoutsThisMonth >= 7 },
    { title: "10 Day Streak", sub: "Stay consistent for 10 days", earned: state.streak >= 10 },
    { title: "Strength Builder", sub: "Hit 25 sessions", earned: state.workoutsThisMonth >= 25 },
    { title: "Iron Will", sub: "30 day streak", earned: state.streak >= 30 },
    { title: "Century Club", sub: "100 total workouts", earned: state.workoutsThisMonth >= 100 },
  ];
  return (
    <Sheet open title="Achievements" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingBottom: 8 }}>
        {items.map((a, i) => (
          <div
            key={i}
            style={{
              padding: 16,
              background: a.earned ? "var(--accent-soft)" : "var(--surface)",
              borderRadius: 20,
              textAlign: "center",
              opacity: a.earned ? 1 : 0.6,
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: a.earned ? "var(--accent)" : "var(--card-solid)",
                margin: "0 auto 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: a.earned ? "0 8px 16px -8px var(--accent)" : "none",
              }}
            >
              <Icon d={icons.trophy} size={22} stroke={2} style={{ color: a.earned ? "#fff" : "var(--ink-faint)" }} />
            </div>
            <div className="font-display" style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 3 }}>{a.title}</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.4, fontWeight: 500 }}>{a.sub}</div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ─── Insights ──────────────────────────────────────────────────────────────
export function InsightsSheet({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  const avgLen = state.workoutsThisMonth > 0 ? Math.round(state.activeMin / state.workoutsThisMonth) : 0;
  const insights = [
    { label: "Total workouts", val: state.workoutsThisMonth, trend: state.workoutsThisMonth === 0 ? "Start your first one" : "This month", tone: "accent" },
    { label: "Avg. workout length", val: `${avgLen} min`, trend: avgLen > 0 ? "Per session" : "Complete a workout", tone: "accent-2" },
    { label: "Calories burned", val: state.caloriesThisMonth.toLocaleString(), trend: "Total this month", tone: "accent-3" },
    { label: "Current streak", val: `${state.streak} ${state.streak === 1 ? "day" : "days"}`, trend: state.streak > 0 ? "Keep going!" : "Get started today", tone: "accent" },
  ] as const;
  return (
    <Sheet open title="Insights" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 8 }}>
        {insights.map((it, i) => (
          <div
            key={i}
            style={{
              padding: "16px 18px",
              background: `var(--${it.tone}-soft)`,
              borderRadius: 18,
            }}
          >
            <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 6, fontWeight: 700 }}>{it.label}</div>
            <div
              className="font-display"
              style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}
            >
              {it.val}
            </div>
            <div style={{ fontSize: 12, color: `var(--${it.tone})`, marginTop: 6, fontWeight: 700 }}>{it.trend}</div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ─── Reset ─────────────────────────────────────────────────────────────────
export function ResetSheet({ dispatch, onReset }: { dispatch: Dispatch; onReset: () => void }) {
  return (
    <Sheet open title="Reset All Data" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ padding: "8px 0 16px" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Icon d={icons.refresh} size={26} stroke={2} style={{ color: "var(--ink-soft)" }} />
        </div>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="font-display" style={{ fontSize: 19, fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>
            Are you sure?
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5, maxWidth: 290, margin: "0 auto", fontWeight: 500 }}>
            This permanently deletes your profile, workouts, sessions, and progress. You&apos;ll need to set up your name again.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onReset}
            style={{
              height: 58,
              borderRadius: 999,
              background: "var(--accent)",
              border: "none",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            Yes, reset everything
          </button>
          <button
            onClick={() => dispatch({ type: "closeSheet" })}
            style={{
              height: 58,
              borderRadius: 999,
              background: "transparent",
              border: "1.6px solid var(--border-inner)",
              color: "var(--ink)",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: '"Quicksand", sans-serif',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Sheet>
  );
}

// ─── Workout Type Picker ────────────────────────────────────────────────────
export function WorkoutTypeSheet({ dispatch }: { dispatch: Dispatch }) {
  const opts = [
    { key: "newWorkout" as const, label: "Custom", sub: "Build from scratch", iconD: icons.pencil, tone: "accent" },
    { key: "libraryWorkout" as const, label: "From Library", sub: "300+ exercises", iconD: icons.dumbbell, tone: "accent-2" },
  ];
  return (
    <Sheet open title="New Workout" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ display: "flex", gap: 12, padding: "8px 0 16px" }}>
        {opts.map((opt) => (
          <button
            key={opt.key}
            onClick={() => dispatch({ type: "openSheet", sheet: opt.key })}
            style={{
              flex: 1,
              padding: "22px 16px",
              background: `var(--${opt.tone}-soft)`,
              border: "none",
              borderRadius: 22,
              cursor: "pointer",
              textAlign: "center",
              fontFamily: "inherit",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 17,
                background: `var(--${opt.tone})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
              }}
            >
              <svg width={23} height={23} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                {Array.isArray(opt.iconD) ? opt.iconD.map((p, i) => <path key={i} d={p} />) : <path d={opt.iconD} />}
              </svg>
            </div>
            <div className="font-display" style={{ fontSize: 15.5, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>{opt.label}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>{opt.sub}</div>
          </button>
        ))}
      </div>
    </Sheet>
  );
}

export { LibraryWorkoutSheet } from "./LibraryWorkoutSheet";

// ─── History ───────────────────────────────────────────────────────────────
export function HistorySheet({ state, dispatch }: { state: State; dispatch: Dispatch }) {
  return (
    <Sheet open title="Workout History" onClose={() => dispatch({ type: "closeSheet" })}>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, paddingBottom: 8 }}>
        {!state.completedSessions || state.completedSessions.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "var(--ink-faint)", fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>
            No workouts logged yet.<br />Complete a workout to see your history.
          </div>
        ) : (
          [...state.completedSessions].reverse().map((s) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 15px",
                background: "var(--surface)",
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 13,
                  background: "var(--accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon d={icons.dumbbell} size={19} stroke={2} style={{ color: "var(--accent)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)", fontWeight: 600 }}>
                  {new Date(s.date).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-soft)", flexShrink: 0 }}>
                {s.durationMin} min
              </div>
            </div>
          ))
        )}
      </div>
    </Sheet>
  );
}
