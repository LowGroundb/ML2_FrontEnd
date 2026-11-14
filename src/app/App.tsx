import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  Activity,
  Apple,
  ArrowLeft,
  ArrowRight,
  Bike,
  CalendarDays,
  Check,
  ChevronRight,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { motion } from "motion/react";

type Modal = "meal" | "exercise" | "profile" | "goals" | null;
type ActivityLevel = "sedentary" | "light" | "moderate" | "active";
type FitnessGoal = "lose" | "maintain" | "gain";

interface Profile {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: "male" | "female";
  activity: ActivityLevel;
  goal: FitnessGoal;
  goalWeight: number;
}

interface LogItem {
  id: number;
  kind: "meal" | "exercise";
  title: string;
  detail: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

const foodOptions = [
  { name: "Greek yogurt bowl", serving: "1 bowl · 280 g", calories: 340, protein: 28, carbs: 42, fat: 7 },
  { name: "Chicken harvest plate", serving: "1 plate · 420 g", calories: 520, protein: 48, carbs: 54, fat: 14 },
  { name: "Avocado toast", serving: "2 slices · 210 g", calories: 410, protein: 14, carbs: 49, fat: 20 },
  { name: "Salmon rice bowl", serving: "1 bowl · 390 g", calories: 610, protein: 42, carbs: 68, fat: 19 },
];

const exerciseOptions = [
  { name: "Outdoor run", perMinute: 10.5, icon: Footprints },
  { name: "Strength training", perMinute: 7.2, icon: Dumbbell },
  { name: "Cycling", perMinute: 8.8, icon: Bike },
  { name: "Brisk walk", perMinute: 4.6, icon: Activity },
];

function calculateGoals(profile: Profile) {
  const bmr =
    10 * profile.weight +
    6.25 * profile.height -
    5 * profile.age +
    (profile.gender === "male" ? 5 : -161);
  const activityMultiplier = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }[profile.activity];
  const goalAdjustment = { lose: -400, maintain: 0, gain: 300 }[profile.goal];
  const calories = Math.round((bmr * activityMultiplier + goalAdjustment) / 10) * 10;
  return {
    calories,
    protein: Math.round(profile.weight * (profile.goal === "gain" ? 2 : 1.8)),
    carbs: Math.round((calories * 0.44) / 4),
    fat: Math.round((calories * 0.28) / 9),
  };
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${compact ? "size-9" : "size-12"} relative grid place-items-center rounded-[14px] bg-[#171813] text-[#eaff61] shadow-[0_8px_25px_rgba(23,24,19,.15)]`}>
        <HeartPulse className={compact ? "size-5" : "size-7"} strokeWidth={2.4} />
        <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[#f4f0e7] bg-[#ff6846]" />
      </div>
      <div>
        <div className={`${compact ? "text-[20px]" : "text-[28px]"} font-black leading-none tracking-[-0.055em]`}>McFitness</div>
        {!compact && <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-black/45">Fuel your momentum</div>}
      </div>
    </div>
  );
}

function DialogShell({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#171813]/45 p-0 backdrop-blur-[6px] sm:items-center sm:p-5" onMouseDown={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[30px] border border-white/50 bg-[#faf7f0] shadow-2xl sm:max-w-[500px] sm:rounded-[30px]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-black/8 bg-[#faf7f0]/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#e55235]">{eyebrow}</p>
            <h2 className="mt-1 font-black tracking-[-0.04em] text-[#171813]">{title}</h2>
          </div>
          <button onClick={onClose} className="grid size-10 place-items-center rounded-full bg-black/5 transition hover:bg-black/10" aria-label="Close dialog">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black/48">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#171813] outline-none transition placeholder:text-black/30 focus:border-[#e55235] focus:ring-2 focus:ring-[#e55235]/10";

function Onboarding({ onFinish }: { onFinish: (profile: Profile) => void }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    age: 0,
    height: 0,
    weight: 0,
    gender: "male",
    activity: "moderate",
    goal: "maintain",
    goalWeight: 0,
  });

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => setProfile((previous) => ({ ...previous, [key]: value }));
  const hasValidDetails = profile.name.trim() !== "" && profile.age > 0 && profile.height > 0 && profile.weight > 0;
  const next = () => {
    if (step === 3) {
      onFinish({ ...profile, goalWeight: profile.goalWeight || profile.weight });
      return;
    }
    setStep((value) => value + 1);
  };

  return (
    <main className="min-h-screen bg-[#dfded2] p-0 sm:grid sm:place-items-center sm:p-6">
      <div className="relative min-h-screen w-full overflow-hidden bg-[#f5f1e8] sm:min-h-[780px] sm:max-w-[430px] sm:rounded-[38px] sm:border-[7px] sm:border-[#171813] sm:shadow-[0_30px_100px_rgba(34,35,28,.2)]">
        <div className="absolute -right-24 -top-24 size-64 rounded-full bg-[#eaff61]/70 blur-3xl" />
        <header className="relative z-10 flex items-center justify-between px-6 pt-7">
          <BrandMark compact />
          <div className="font-mono text-[10px] font-bold tracking-[0.18em] text-black/45">0{step + 1} / 04</div>
        </header>

        <div className="relative z-10 flex min-h-[690px] flex-col px-6 pb-7 pt-10">
          {step === 0 && (
            <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col">
              <div className="mb-12 grid place-items-center pt-4">
                <div className="relative grid size-52 place-items-center rounded-full border border-black/10 bg-[#ff6846]">
                  <div className="absolute inset-4 rounded-full border border-dashed border-black/25" />
                  <Flame className="size-24 text-[#171813]" strokeWidth={1.4} />
                  <div className="absolute -bottom-2 right-1 rounded-full bg-[#eaff61] px-4 py-2 font-mono text-[10px] font-black uppercase tracking-wider shadow-lg">Let’s move</div>
                </div>
              </div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#e55235]">Your daily rhythm, simplified</p>
              <h1 className="mt-3 text-[48px] font-black leading-[0.92] tracking-[-0.065em]">Fitness that fits your life.</h1>
              <p className="mt-5 max-w-[320px] text-[15px] leading-6 text-black/57">Personal targets, effortless food logging, and progress you’ll actually want to follow.</p>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#e55235]">First, the basics</p>
              <h1 className="mt-3 text-[38px] font-black leading-[1] tracking-[-0.055em]">Tell us about yourself.</h1>
              <p className="mt-3 text-sm leading-6 text-black/52">We use this to calculate a target that’s uniquely yours.</p>
              <div className="mt-8 space-y-4">
                <Field label="Your name"><input required className={inputClass} placeholder="Enter your name" value={profile.name} onChange={(e) => update("name", e.target.value)} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Age"><input type="number" min="1" className={inputClass} value={profile.age || ""} onChange={(e) => update("age", +e.target.value)} /></Field>
                  <Field label="Gender">
                    <select className={inputClass} value={profile.gender} onChange={(e) => update("gender", e.target.value as Profile["gender"])}>
                      <option value="male">Male</option><option value="female">Female</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Height · cm"><input type="number" min="1" className={inputClass} value={profile.height || ""} onChange={(e) => update("height", +e.target.value)} /></Field>
                  <Field label="Weight · kg"><input type="number" min="1" className={inputClass} value={profile.weight || ""} onChange={(e) => update("weight", +e.target.value)} /></Field>
                </div>
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#e55235]">Set your direction</p>
              <h1 className="mt-3 text-[38px] font-black leading-[1] tracking-[-0.055em]">Where are you headed?</h1>
              <div className="mt-8 space-y-3">
                {[
                  ["lose", "Lose weight", "A steady, sustainable calorie deficit", Flame],
                  ["maintain", "Maintain", "Stay balanced and keep your rhythm", Target],
                  ["gain", "Build strength", "Fuel muscle growth and recovery", Dumbbell],
                ].map(([value, title, detail, Icon]) => (
                  <button key={value as string} onClick={() => update("goal", value as FitnessGoal)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${profile.goal === value ? "border-[#171813] bg-[#171813] text-white shadow-lg" : "border-black/9 bg-white/70 hover:border-black/25"}`}>
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${profile.goal === value ? "bg-[#eaff61] text-black" : "bg-black/5"}`}><Icon className="size-5" /></span>
                    <span className="flex-1"><span className="block text-sm font-extrabold">{title as string}</span><span className={`mt-1 block text-xs ${profile.goal === value ? "text-white/55" : "text-black/45"}`}>{detail as string}</span></span>
                    {profile.goal === value && <Check className="size-5 text-[#eaff61]" />}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <Field label="Weekly activity">
                  <select className={inputClass} value={profile.activity} onChange={(e) => update("activity", e.target.value as ActivityLevel)}>
                    <option value="sedentary">Mostly sedentary</option><option value="light">Light · 1–3 days</option><option value="moderate">Moderate · 3–5 days</option><option value="active">Very active · 6–7 days</option>
                  </select>
                </Field>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="relative grid size-40 place-items-center rounded-full bg-[#eaff61]">
                <Sparkles className="size-16" strokeWidth={1.5} />
                <span className="absolute -left-3 top-4 size-7 rounded-full bg-[#ff6846]" />
                <span className="absolute -right-1 bottom-5 size-4 rounded-full bg-[#6e8cff]" />
              </div>
              <p className="mt-10 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#e55235]">You’re all set, {profile.name.split(" ")[0]}</p>
              <h1 className="mt-3 text-[45px] font-black leading-[0.95] tracking-[-0.065em]">Now the journey begins!</h1>
              <p className="mt-5 text-base leading-6 text-black/55">Your plan is ready. Show up, stay curious, and celebrate the small wins. Good luck.</p>
            </motion.section>
          )}

          <div className="mt-6 flex items-center gap-3">
            {step > 0 && <button onClick={() => setStep((value) => value - 1)} className="grid size-14 place-items-center rounded-2xl border border-black/10 bg-white/60 transition hover:bg-white"><ArrowLeft className="size-5" /></button>}
            <button onClick={next} disabled={step === 1 && !hasValidDetails} className="flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-[#171813] px-5 font-bold text-white shadow-[0_12px_30px_rgba(23,24,19,.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
              {step === 3 ? "Open my dashboard" : step === 0 ? "Get started" : "Continue"} <ArrowRight className="size-5 text-[#eaff61]" />
            </button>
          </div>
          <div className="mt-6 flex gap-1.5">
            {[0, 1, 2, 3].map((item) => <span key={item} className={`h-1.5 rounded-full transition-all ${item === step ? "w-10 bg-[#ff6846]" : item < step ? "w-5 bg-[#171813]" : "w-5 bg-black/10"}`} />)}
          </div>
        </div>
      </div>
    </main>
  );
}

function AddMealDialog({ onClose, onAdd }: { onClose: () => void; onAdd: (item: LogItem) => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(foodOptions[0]);
  const [servings, setServings] = useState(1);
  const filtered = foodOptions.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()));
  const add = () => {
    onAdd({
      id: Date.now(), kind: "meal", title: selected.name, detail: `${servings} serving${servings === 1 ? "" : "s"} · Just now`,
      calories: Math.round(selected.calories * servings), protein: Math.round(selected.protein * servings),
      carbs: Math.round(selected.carbs * servings), fat: Math.round(selected.fat * servings),
    });
    onClose();
  };
  return (
    <DialogShell title="Add a meal" eyebrow="Nutrition database" onClose={onClose}>
      <div className="p-6">
        <div className="relative"><Search className="absolute left-4 top-3.5 size-5 text-black/35" /><input autoFocus className={`${inputClass} pl-12`} placeholder="Search foods and meals" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
        <div className="mt-5 space-y-2">
          {filtered.map((food) => (
            <button key={food.name} onClick={() => setSelected(food)} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selected.name === food.name ? "border-[#e55235] bg-[#ff6846]/8" : "border-transparent bg-white hover:border-black/10"}`}>
              <span className={`grid size-11 place-items-center rounded-xl ${selected.name === food.name ? "bg-[#ff6846] text-white" : "bg-[#eeeae0]"}`}><Apple className="size-5" /></span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-extrabold">{food.name}</span><span className="text-xs text-black/42">{food.serving}</span></span>
              <span className="font-mono text-xs font-bold">{food.calories} cal</span>
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-[#171813] p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Portions</span>
            <div className="flex items-center gap-3"><button onClick={() => setServings(Math.max(0.5, servings - 0.5))} className="grid size-8 place-items-center rounded-full bg-white/10">−</button><strong>{servings}</strong><button onClick={() => setServings(servings + 0.5)} className="grid size-8 place-items-center rounded-full bg-[#eaff61] text-black">+</button></div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2 border-t border-white/10 pt-4 text-center">
            {[["Calories", selected.calories * servings], ["Protein", `${selected.protein * servings}g`], ["Carbs", `${selected.carbs * servings}g`], ["Fat", `${selected.fat * servings}g`]].map(([label, value]) => <div key={label}><div className="text-sm font-black">{value}</div><div className="mt-1 text-[9px] uppercase tracking-wide text-white/40">{label}</div></div>)}
          </div>
        </div>
        <button onClick={add} className="mt-5 h-13 w-full rounded-2xl bg-[#ff6846] font-extrabold text-white transition hover:bg-[#e55235]">Add to today</button>
      </div>
    </DialogShell>
  );
}

function AddExerciseDialog({ onClose, onAdd }: { onClose: () => void; onAdd: (item: LogItem) => void }) {
  const [selected, setSelected] = useState(exerciseOptions[0]);
  const [duration, setDuration] = useState(30);
  const calories = Math.round(selected.perMinute * duration);
  return (
    <DialogShell title="Add exercise" eyebrow="Movement log" onClose={onClose}>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {exerciseOptions.map((exercise) => {
            const Icon = exercise.icon;
            return <button key={exercise.name} onClick={() => setSelected(exercise)} className={`rounded-2xl border p-4 text-left transition ${selected.name === exercise.name ? "border-[#171813] bg-[#171813] text-white" : "border-black/8 bg-white"}`}><Icon className={`mb-5 size-6 ${selected.name === exercise.name ? "text-[#eaff61]" : "text-[#e55235]"}`} /><strong className="block text-sm">{exercise.name}</strong><span className={`mt-1 block text-xs ${selected.name === exercise.name ? "text-white/45" : "text-black/40"}`}>{exercise.perMinute} cal/min</span></button>;
          })}
        </div>
        <div className="mt-6 rounded-2xl border border-black/8 bg-white p-5">
          <div className="flex items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-black/40">Duration</p><p className="mt-1 text-3xl font-black tracking-[-0.05em]">{duration}<span className="ml-1 text-sm text-black/35">min</span></p></div><div className="text-right"><p className="font-mono text-[10px] uppercase tracking-widest text-black/40">Est. burn</p><p className="mt-1 text-xl font-black text-[#e55235]">{calories} cal</p></div></div>
          <input aria-label="Exercise duration" type="range" min="10" max="120" step="5" value={duration} onChange={(e) => setDuration(+e.target.value)} className="mt-6 w-full accent-[#ff6846]" />
          <div className="mt-1 flex justify-between font-mono text-[9px] text-black/30"><span>10 MIN</span><span>120 MIN</span></div>
        </div>
        <button onClick={() => { onAdd({ id: Date.now(), kind: "exercise", title: selected.name, detail: `${duration} min · Just now`, calories }); onClose(); }} className="mt-5 h-13 w-full rounded-2xl bg-[#ff6846] font-extrabold text-white transition hover:bg-[#e55235]">Log {calories} calories burned</button>
      </div>
    </DialogShell>
  );
}

function ProfileDialog({ profile, onClose, onSave, onRestart }: { profile: Profile; onClose: () => void; onSave: (p: Profile) => void; onRestart: () => void }) {
  const [draft, setDraft] = useState(profile);
  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => setDraft((p) => ({ ...p, [key]: value }));
  const submit = (e: FormEvent) => { e.preventDefault(); onSave(draft); onClose(); };
  return (
    <DialogShell title="Personal details" eyebrow="Edit profile" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4 p-6">
        <Field label="Name"><input className={inputClass} value={draft.name} onChange={(e) => update("name", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="Age"><input type="number" className={inputClass} value={draft.age} onChange={(e) => update("age", +e.target.value)} /></Field><Field label="Gender"><select className={inputClass} value={draft.gender} onChange={(e) => update("gender", e.target.value as Profile["gender"])}><option value="male">Male</option><option value="female">Female</option></select></Field></div>
        <div className="grid grid-cols-2 gap-3"><Field label="Height · cm"><input type="number" className={inputClass} value={draft.height} onChange={(e) => update("height", +e.target.value)} /></Field><Field label="Weight · kg"><input type="number" className={inputClass} value={draft.weight} onChange={(e) => update("weight", +e.target.value)} /></Field></div>
        <Field label="Activity level"><select className={inputClass} value={draft.activity} onChange={(e) => update("activity", e.target.value as ActivityLevel)}><option value="sedentary">Mostly sedentary</option><option value="light">Light · 1–3 days</option><option value="moderate">Moderate · 3–5 days</option><option value="active">Very active · 6–7 days</option></select></Field>
        <button className="h-13 w-full rounded-2xl bg-[#171813] font-bold text-white">Save profile</button>
        <button type="button" onClick={onRestart} className="h-11 w-full text-sm font-bold text-[#e55235] hover:underline">Restart onboarding</button>
      </form>
    </DialogShell>
  );
}

function GoalsDialog({ profile, onClose, onSave }: { profile: Profile; onClose: () => void; onSave: (p: Profile) => void }) {
  const [goal, setGoal] = useState(profile.goal);
  const [goalWeight, setGoalWeight] = useState(profile.goalWeight);
  return (
    <DialogShell title="Adjust your goals" eyebrow="Goal settings" onClose={onClose}>
      <div className="p-6">
        <div className="space-y-2">
          {([["lose", "Lose weight"], ["maintain", "Maintain weight"], ["gain", "Build strength"]] as const).map(([value, label]) => <button key={value} onClick={() => setGoal(value)} className={`flex h-14 w-full items-center justify-between rounded-2xl border px-4 text-sm font-bold ${goal === value ? "border-[#171813] bg-[#171813] text-white" : "border-black/8 bg-white"}`}>{label}{goal === value && <Check className="size-5 text-[#eaff61]" />}</button>)}
        </div>
        <div className="mt-5"><Field label="Goal weight · kg"><input type="number" className={inputClass} value={goalWeight} onChange={(e) => setGoalWeight(+e.target.value)} /></Field></div>
        <div className="mt-5 rounded-2xl bg-[#eaff61] p-4 text-sm leading-6"><strong>Targets update automatically.</strong><br /><span className="text-black/55">We use the Mifflin–St Jeor equation, your activity level, and this goal.</span></div>
        <button onClick={() => { onSave({ ...profile, goal, goalWeight }); onClose(); }} className="mt-5 h-13 w-full rounded-2xl bg-[#ff6846] font-bold text-white">Recalculate my plan</button>
      </div>
    </DialogShell>
  );
}

function App() {
  const [onboarding, setOnboarding] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [profile, setProfile] = useState<Profile>({
    name: "", age: 0, height: 0, weight: 0, gender: "male", activity: "moderate", goal: "maintain", goalWeight: 0,
  });
  const [logs, setLogs] = useState<LogItem[]>([]);
  const goals = useMemo(() => calculateGoals(profile), [profile]);
  const meals = logs.filter((item) => item.kind === "meal");
  const exercises = logs.filter((item) => item.kind === "exercise");
  const eaten = meals.reduce((sum, item) => sum + item.calories, 0);
  const burned = exercises.reduce((sum, item) => sum + item.calories, 0);
  const protein = meals.reduce((sum, item) => sum + (item.protein || 0), 0);
  const carbs = meals.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const fat = meals.reduce((sum, item) => sum + (item.fat || 0), 0);
  const remaining = Math.max(0, goals.calories - eaten + burned);
  const progress = Math.min(100, Math.round(((eaten - burned) / goals.calories) * 100));
  const profileInitials = profile.name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
  const today = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  const addLog = (item: LogItem) => setLogs((current) => [item, ...current]);

  if (onboarding) return <Onboarding onFinish={(data) => { setProfile(data); setOnboarding(false); }} />;

  return (
    <main className="min-h-screen bg-[#dcdcd1] text-[#171813]">
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[290px_1fr]">
        <aside className="hidden border-r border-black/10 bg-[#f4f0e7] px-7 py-8 lg:flex lg:flex-col">
          <BrandMark />
          <nav className="mt-14 space-y-2">
            <button className="flex h-12 w-full items-center gap-3 rounded-xl bg-[#171813] px-4 text-sm font-bold text-white"><Activity className="size-5 text-[#eaff61]" />Today</button>
            <button className="flex h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-bold text-black/50 transition hover:bg-black/5"><CalendarDays className="size-5" />History</button>
            <button onClick={() => setModal("goals")} className="flex h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-bold text-black/50 transition hover:bg-black/5"><Target className="size-5" />Goals</button>
          </nav>
          <div className="mt-auto">
            <button onClick={() => setModal("profile")} className="flex w-full items-center gap-3 border-t border-black/10 pt-5 text-left">
              <span className="grid size-10 place-items-center rounded-full bg-[#ff6846] font-black text-white">{profileInitials}</span>
              <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{profile.name}</strong><span className="text-xs text-black/40">View profile</span></span>
              <Settings className="size-4 text-black/35" />
            </button>
          </div>
        </aside>

        <section className="min-w-0 bg-[#f4f0e7] lg:bg-[#ece9e0] lg:p-5">
          <div className="min-h-screen bg-[#f8f5ee] pb-24 lg:min-h-[calc(100vh-40px)] lg:rounded-[30px] lg:border lg:border-white/70 lg:pb-8 lg:shadow-[0_20px_70px_rgba(25,25,20,.08)]">
            <header className="flex items-center justify-between px-5 pb-5 pt-6 sm:px-8 lg:px-10 lg:pt-8">
              <div className="lg:hidden"><BrandMark compact /></div>
              <div className="hidden lg:block"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/38">{today}</p><h1 className="mt-1 text-2xl font-black tracking-[-0.04em]">Good morning, {profile.name.split(" ")[0]}.</h1></div>
              <button onClick={() => setModal("profile")} className="grid size-10 place-items-center rounded-full border border-black/8 bg-white lg:size-11" aria-label="Open profile"><UserRound className="size-5" /></button>
            </header>

            <div className="grid gap-5 px-4 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(330px,.8fr)] lg:px-10">
              <div className="space-y-5">
                <section className="overflow-hidden rounded-[28px] bg-[#171813] text-white shadow-[0_20px_45px_rgba(23,24,19,.16)]">
                  <div className="grid p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                    <div>
                      <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#eaff61]" /><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Daily energy balance</p></div>
                      <div className="mt-5 flex items-end gap-2"><span className="text-[66px] font-black leading-none tracking-[-0.07em]">{remaining.toLocaleString()}</span><span className="pb-2 text-sm font-bold text-white/42">cal left</span></div>
                      <p className="mt-3 text-sm text-white/45">{eaten} eaten <span className="mx-2 text-white/15">/</span> {burned} burned</p>
                    </div>
                    <div className="relative mx-auto mt-8 grid size-36 place-items-center sm:mt-0">
                      <svg className="size-36 -rotate-90" viewBox="0 0 120 120" aria-label={`${progress}% of calorie goal`}>
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#eaff61" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${Math.max(progress, 2) * 3.14} 314`} />
                      </svg>
                      <div className="absolute text-center"><strong className="text-2xl font-black">{progress}%</strong><span className="block font-mono text-[8px] uppercase tracking-widest text-white/35">of goal</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 border-t border-white/10">
                    {[
                      ["Protein", protein, goals.protein, "#ff6846"],
                      ["Carbs", carbs, goals.carbs, "#eaff61"],
                      ["Fat", fat, goals.fat, "#8da2ff"],
                    ].map(([label, value, goal, color], index) => {
                      const width = Math.min(100, Math.round((Number(value) / Number(goal)) * 100));
                      return <div key={label} className={`p-4 sm:p-5 ${index > 0 ? "border-l border-white/10" : ""}`}><div className="flex justify-between text-xs"><strong>{label}</strong><span className="text-white/35">{value}/{goal}g</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${color === "#ff6846" ? "bg-[#ff6846]" : color === "#eaff61" ? "bg-[#eaff61]" : "bg-[#8da2ff]"}`} style={{ width: `${width}%` }} /></div></div>;
                    })}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setModal("meal")} className="group flex min-h-24 items-center justify-between rounded-[22px] bg-[#ff6846] p-5 text-left text-white transition hover:-translate-y-0.5 hover:shadow-lg"><span><span className="block font-mono text-[9px] uppercase tracking-widest text-white/60">Nutrition</span><strong className="mt-1 block text-base">Add a meal</strong></span><span className="grid size-10 place-items-center rounded-full bg-white text-[#e55235] transition group-hover:rotate-90"><Plus className="size-5" /></span></button>
                  <button onClick={() => setModal("exercise")} className="group flex min-h-24 items-center justify-between rounded-[22px] border border-black/8 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"><span><span className="block font-mono text-[9px] uppercase tracking-widest text-black/35">Movement</span><strong className="mt-1 block text-base">Add exercise</strong></span><span className="grid size-10 place-items-center rounded-full bg-[#eaff61] transition group-hover:rotate-90"><Plus className="size-5" /></span></button>
                </div>

                <section className="rounded-[26px] border border-black/7 bg-white p-5 sm:p-6">
                  <div className="flex items-center justify-between"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#e55235]">Today’s log</p><h2 className="mt-1 text-xl font-black tracking-[-0.04em]">Your activity</h2></div><button className="grid size-9 place-items-center rounded-full bg-black/4"><MoreHorizontal className="size-5" /></button></div>
                  <div className="mt-5 divide-y divide-black/7">
                    {logs.length === 0 && <p className="py-8 text-center text-sm text-black/40">Your day is ready for its first entry.</p>}
                    {logs.map((item) => (
                      <motion.div layout key={item.id} className="group flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                        <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${item.kind === "meal" ? "bg-[#ff6846]/12 text-[#e55235]" : "bg-[#eaff61]"}`}>{item.kind === "meal" ? <Apple className="size-5" /> : <Footprints className="size-5" />}</span>
                        <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{item.title}</strong><span className="mt-0.5 block text-xs text-black/38">{item.detail}</span></span>
                        <span className="text-right"><strong className={`block text-sm ${item.kind === "exercise" ? "text-[#3d6c36]" : ""}`}>{item.kind === "exercise" ? "−" : "+"}{item.calories}</strong><span className="text-[10px] text-black/35">cal</span></span>
                        <button onClick={() => setLogs((all) => all.filter((log) => log.id !== item.id))} className="hidden size-8 place-items-center rounded-full text-black/30 hover:bg-red-50 hover:text-red-500 group-hover:grid" aria-label={`Delete ${item.title}`}><Trash2 className="size-4" /></button>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-5">
                <section className="rounded-[26px] bg-[#eaff61] p-6">
                  <div className="flex items-start justify-between"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black/42">Weekly pulse</p><h2 className="mt-1 text-xl font-black tracking-[-0.04em]">No weekly data yet</h2></div><Flame className="size-7" /></div>
                  <p className="mt-5 rounded-2xl bg-black/5 p-4 text-sm leading-6 text-black/55">Your weekly activity summary will appear here once your saved activity data is connected.</p>
                </section>
                <section className="rounded-[26px] border border-black/7 bg-white p-6">
                  <div className="flex items-center justify-between"><div><p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black/35">Current plan</p><h2 className="mt-1 text-xl font-black capitalize tracking-[-0.04em]">{profile.goal} weight</h2></div><button onClick={() => setModal("goals")} className="grid size-10 place-items-center rounded-full border border-black/8 hover:bg-black/5"><ChevronRight className="size-5" /></button></div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#f4f1e9] p-4"><span className="font-mono text-[9px] uppercase tracking-wide text-black/35">Daily goal</span><strong className="mt-2 block text-xl">{goals.calories}</strong><span className="text-xs text-black/35">calories</span></div>
                    <div className="rounded-2xl bg-[#f4f1e9] p-4"><span className="font-mono text-[9px] uppercase tracking-wide text-black/35">Goal weight</span><strong className="mt-2 block text-xl">{profile.goalWeight}</strong><span className="text-xs text-black/35">kilograms</span></div>
                  </div>
                  <div className="mt-5 flex items-center gap-3 border-t border-black/7 pt-5"><span className="grid size-9 place-items-center rounded-full bg-[#8da2ff]/20 text-[#5267c7]"><Target className="size-4" /></span><p className="text-xs leading-5 text-black/50">Targets calculated from your body and activity profile.</p></div>
                </section>
              </aside>
            </div>
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex h-20 max-w-md items-center justify-around border-t border-black/8 bg-[#faf7f0]/95 px-4 backdrop-blur-lg lg:hidden">
        <button className="flex flex-col items-center gap-1 text-[#e55235]"><Activity className="size-5" /><span className="text-[10px] font-bold">Today</span></button>
        <button className="flex flex-col items-center gap-1 text-black/35"><CalendarDays className="size-5" /><span className="text-[10px] font-bold">History</span></button>
        <button onClick={() => setModal("goals")} className="flex flex-col items-center gap-1 text-black/35"><Target className="size-5" /><span className="text-[10px] font-bold">Goals</span></button>
        <button onClick={() => setModal("profile")} className="flex flex-col items-center gap-1 text-black/35"><UserRound className="size-5" /><span className="text-[10px] font-bold">Profile</span></button>
      </nav>

      {modal === "meal" && <AddMealDialog onClose={() => setModal(null)} onAdd={addLog} />}
      {modal === "exercise" && <AddExerciseDialog onClose={() => setModal(null)} onAdd={addLog} />}
      {modal === "profile" && <ProfileDialog profile={profile} onClose={() => setModal(null)} onSave={setProfile} onRestart={() => { setModal(null); setOnboarding(true); }} />}
      {modal === "goals" && <GoalsDialog profile={profile} onClose={() => setModal(null)} onSave={setProfile} />}
    </main>
  );
}

export default App;
