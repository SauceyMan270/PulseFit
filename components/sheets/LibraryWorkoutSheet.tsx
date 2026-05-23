"use client";

import { useState, useMemo } from "react";
import NumInput from "../NumInput";
import Sheet from "../Sheet";
import PillBtn from "../PillBtn";
import Icon from "../Icon";
import { icons } from "@/lib/icons";

import { EXERCISES, MUSCLE_TABS, EQUIPMENT_CHIPS, matchesEquipment } from "@/lib/exercises";
import type { Dispatch } from "@/lib/types";

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
  boxSizing: "border-box",
};

export function LibraryWorkoutSheet({ dispatch, weightUnit = "lbs" }: { dispatch: Dispatch; weightUnit?: "lbs" | "kg" }) {
  const [step, setStep] = useState<"browse" | "configure">("browse");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [activeEquip, setActiveEquip] = useState("all");
  const [search, setSearch] = useState("");

  const [title] = useState(() =>
    new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  );
  const [duration, setDuration] = useState(45);
  const [exercises, setExercises] = useState<{ name: string; sets: number; reps: number; weight: number }[]>([]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return EXERCISES.filter((ex) => {
      if (activeTab !== "all" && !ex.group.includes(activeTab)) return false;
      if (!matchesEquipment(ex, activeEquip)) return false;
      if (q && !ex.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [activeTab, activeEquip, search]);

  const toggle = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const goToConfigure = () => {
    const existing = exercises.filter((e) => e.name.trim());
    const existingNames = existing.map((e) => e.name);
    const newOnes = selected
      .filter((name) => !existingNames.includes(name))
      .map((name) => ({ name, sets: 3, reps: 10, weight: 0 }));
    setExercises([...existing, ...newOnes]);
    setStep("configure");
  };

  const goToAddMore = () => {
    setSelected(exercises.filter((e) => e.name.trim()).map((e) => e.name));
    setStep("browse");
  };

  const updateExercise = (i: number, field: "name" | "sets" | "reps" | "weight", val: string | number) => {
    const next = [...exercises];
    next[i] = { ...next[i], [field]: val };
    setExercises(next);
  };
  const removeExercise = (i: number) => setExercises(exercises.filter((_, j) => j !== i));

  const canSave = duration > 0 && exercises.some((e) => e.name.trim());

  const save = () => {
    const clean = exercises
      .filter((e) => e.name.trim())
      .map((e) => `${e.name.trim()} — ${e.sets}×${e.reps}${e.weight > 0 ? ` @ ${e.weight}${weightUnit}` : ""}`);
    dispatch({
      type: "addWorkout",
      workout: {
        title: title.trim(),
        duration,
        level: "Intermediate",
        equipment: "Mixed",
        iconKey: "dumbbell",
        exercises: clean.length,
        exerciseList: clean,
        custom: true,
      },
    });
  };

  const sheetTitle = step === "browse" ? "Exercise Library" : "New Workout";

  return (
    <Sheet open title={sheetTitle} onClose={() => dispatch({ type: "closeSheet" })}>
      {step === "browse" ? (
        <div style={{ paddingBottom: 8 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            style={INPUT_STYLE}
          />

          <div className="hide-scroll" style={{ display: "flex", gap: 6, overflowX: "auto", marginTop: 12, paddingBottom: 2 }}>
            {MUSCLE_TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flexShrink: 0,
                    padding: "7px 14px",
                    borderRadius: 999,
                    border: "none",
                    background: active ? "var(--accent)" : "var(--surface)",
                    color: active ? "#fff" : "var(--ink-soft)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: '"Quicksand", sans-serif',
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="hide-scroll" style={{ display: "flex", gap: 5, overflowX: "auto", marginTop: 8, paddingBottom: 2 }}>
            {EQUIPMENT_CHIPS.map((chip) => {
              const active = activeEquip === chip.key;
              return (
                <button
                  key={chip.key}
                  onClick={() => setActiveEquip(chip.key)}
                  style={{
                    flexShrink: 0,
                    padding: "5px 11px",
                    borderRadius: 999,
                    border: "none",
                    background: active ? "var(--accent-2-soft)" : "var(--surface)",
                    color: active ? "var(--accent-2)" : "var(--ink-faint)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: '"Quicksand", sans-serif',
                    whiteSpace: "nowrap",
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 10, marginBottom: 4, fontWeight: 700 }}>
            {filtered.length} exercise{filtered.length !== 1 ? "s" : ""}
            {selected.length > 0 && (
              <span style={{ color: "var(--accent)", marginLeft: 8 }}>· {selected.length} selected</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--ink-faint)" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink-soft)", marginBottom: 4 }}>No exercises match</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>Try adjusting the filters</div>
            </div>
          ) : (
            <div>
              {filtered.map((ex, i) => {
                const isSel = selected.includes(ex.name);
                return (
                  <div
                    key={ex.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border-inner)" : "none",
                    }}
                  >
                    <div style={{ flex: 1, marginRight: 12 }}>
                      <div style={{ fontSize: 14, color: "var(--ink)", fontWeight: 700, lineHeight: 1.3 }}>{ex.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2, fontWeight: 500 }}>
                        {ex.primary.slice(0, 2).join(", ").replace(/_/g, " ")}
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(ex.name)}
                      style={{
                        flexShrink: 0,
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        border: "none",
                        background: isSel ? "var(--accent)" : "var(--surface)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Icon
                        d={isSel ? icons.check : icons.plus}
                        size={14}
                        stroke={isSel ? 3 : 2.6}
                        style={{ color: isSel ? "#fff" : "var(--ink-soft)" }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {selected.length > 0 && (
            <div
              style={{
                position: "sticky",
                bottom: 0,
                background: "var(--sheet-bg)",
                paddingTop: 12,
                paddingBottom: 4,
                borderTop: "1px solid var(--border-inner)",
                marginTop: 8,
              }}
            >
              <PillBtn onClick={goToConfigure}>
                {exercises.length > 0
                  ? `Add ${selected.filter((n) => !exercises.map((e) => e.name).includes(n)).length} more →`
                  : `Continue with ${selected.length} exercise${selected.length !== 1 ? "s" : ""} →`}
              </PillBtn>
            </div>
          )}
        </div>
      ) : (
        <div style={{ paddingBottom: 8 }}>
          <button
            onClick={() => setStep("browse")}
            style={{
              background: "var(--surface)",
              border: "none",
              color: "var(--ink-soft)",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: '"Quicksand", sans-serif',
              padding: "7px 14px",
              borderRadius: 999,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ← Library
          </button>

          <div className="font-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: 16 }}>
            {title}
          </div>

          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 8, fontWeight: 700 }}>Duration</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[15, 30, 45, 60, 90].map((d) => {
                const active = duration === d;
                return (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    style={{
                      flex: 1,
                      padding: "11px 0",
                      borderRadius: 13,
                      background: active ? "var(--accent)" : "var(--surface)",
                      color: active ? "#fff" : "var(--ink-soft)",
                      border: "none",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: '"Quicksand", sans-serif',
                    }}
                  >
                    {d === 60 ? "1hr" : `${d}m`}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 18, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 700 }}>Exercises</span>
            <button
              onClick={goToAddMore}
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

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
            {exercises.map((ex, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                    value={ex.name}
                    onChange={(e) => updateExercise(i, "name", e.target.value)}
                    placeholder="Exercise name"
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
                <div style={{ display: "flex", gap: 6, paddingLeft: 36, paddingRight: exercises.length > 1 ? 32 : 0 }}>
                  {(["sets", "reps", "weight"] as const).map((field) => {
                    const labelMap = { sets: "SETS", reps: "REPS", weight: weightUnit.toUpperCase() };
                    return (
                      <div
                        key={field}
                        style={{
                          flex: 1,
                          background: "var(--surface)",
                          border: "1px solid var(--border-inner)",
                          borderRadius: 16,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "10px 6px 8px",
                          gap: 4,
                        }}
                      >
                        <NumInput
                          value={ex[field]}
                          onChange={(v) => updateExercise(i, field, v)}
                        />
                        <span style={{ fontSize: 10, fontWeight: 800, color: "var(--ink-faint)", letterSpacing: "0.06em" }}>
                          {labelMap[field]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <PillBtn onClick={save} disabled={!canSave}>
            Save Workout
          </PillBtn>
        </div>
      )}
    </Sheet>
  );
}
