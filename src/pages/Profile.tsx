import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

type NutritionProfile = {
  dietType: "vegetarian" | "vegan" | "non-vegetarian" | "pescatarian" | "mediterranean" | "keto" | "jain" | "other";
  restrictions: Array<
    | "dairy"
    | "gluten"
    | "nuts"
    | "eggs"
    | "soy"
    | "shellfish"
    | "none"
  >;
  caffeineIntake: "none" | "low" | "moderate" | "high";
  waterIntakeTargetCups: number; // cups/day
  mealPattern: "three_meals" | "two_meals" | "small_frequent" | "unstructured";
  moodFoodPatterns: Array<
    | "emotional_eating"
    | "appetite_loss_under_stress"
    | "sugar_cravings"
    | "comfort_foods"
    | "none"
  >;
  goals: Array<
    | "reduce_anxiety"
    | "improve_sleep"
    | "boost_energy"
    | "improve_focus"
    | "stabilize_mood"
  >;
  preferredCuisines: Array<"indian" | "mediterranean" | "asian" | "continental">;
  supplements: string;
  notes: string;
};

type PersonalizedPlan = {
  macros: { carbsPct: number; proteinPct: number; fatPct: number };
  hydration: { cupsPerDay: number; tips: string[] };
  includeFoods: string[];
  limitFoods: string[];
  dailyTips: string[];
  sampleDay: {
    breakfast: string;
    lunch: string;
    snack: string;
    dinner: string;
  };
};

const DEFAULT_NUTRITION: NutritionProfile = {
  dietType: "mediterranean",
  restrictions: [],
  caffeineIntake: "moderate",
  waterIntakeTargetCups: 8,
  mealPattern: "three_meals",
  moodFoodPatterns: [],
  goals: ["stabilize_mood"],
  preferredCuisines: ["indian"],
  supplements: "",
  notes: "",
};

function computePersonalizedPlan(n: NutritionProfile): PersonalizedPlan {
  // Base macros tuned for mood stability
  let macros: PersonalizedPlan["macros"] = { carbsPct: 50, proteinPct: 20, fatPct: 30 };
  if (n.goals.includes("boost_energy") || n.goals.includes("improve_focus")) {
    macros = { carbsPct: 45, proteinPct: 25, fatPct: 30 };
  }
  if (n.dietType === "keto") {
    macros = { carbsPct: 10, proteinPct: 25, fatPct: 65 };
  }

  // Include foods by diet type
  const includeFoods = new Set<string>([
    "whole grains (oats, brown rice, millets)",
    "leafy greens and colorful veggies",
    "legumes and beans",
    "fermented foods (yogurt, kefir, kimchi)",
    "berries and citrus",
    "seeds (chia, flax) for omega-3",
    "herbs/spices (turmeric, ginger, saffron)",
  ]);
  if (n.dietType === "non-vegetarian" || n.dietType === "pescatarian") includeFoods.add("fatty fish (salmon, mackerel) 2-3x/week");
  if (n.dietType === "vegan") includeFoods.add("fortified plant milks for B12 and calcium");
  if (n.dietType === "jain") includeFoods.add("non-root veg variety, pulses, dairy if preferred");

  // Restrictions
  const limitFoods = new Set<string>(["refined sugar", "ultra-processed snacks", "excess alcohol"]);
  if (n.caffeineIntake === "high") limitFoods.add("caffeine after 2 pm");
  if (n.restrictions.includes("dairy")) {
    includeFoods.delete("fermented foods (yogurt, kefir, kimchi)");
    includeFoods.add("fermented non-dairy (kimchi, sauerkraut)");
  }
  if (n.restrictions.includes("gluten")) limitFoods.add("gluten (wheat, barley)");
  if (n.restrictions.includes("nuts")) limitFoods.add("tree nuts");

  // Hydration
  const hydration = {
    cupsPerDay: n.waterIntakeTargetCups,
    tips: [
      "Start the day with 1 cup of water",
      "Keep a bottle within reach; sip regularly",
      "Add a pinch of salt/lemon if sweating a lot",
    ],
  };

  // Daily tips from goals and mood-food patterns
  const dailyTips: string[] = [];
  if (n.goals.includes("reduce_anxiety")) dailyTips.push("Include omega-3 sources 3-4x/week and magnesium-rich greens daily");
  if (n.goals.includes("improve_sleep")) dailyTips.push("Have complex carbs at dinner and avoid caffeine post-noon");
  if (n.goals.includes("stabilize_mood")) dailyTips.push("Aim for consistent mealtimes and balanced macros each meal");
  if (n.moodFoodPatterns.includes("sugar_cravings")) dailyTips.push("Pair carbs with protein/fat to reduce spikes");
  if (n.moodFoodPatterns.includes("emotional_eating")) dailyTips.push("Use a 5-minute pause + herbal tea before snacking");

  // Sample day adapted to diet type and restrictions
  const isVeg = n.dietType === "vegetarian" || n.dietType === "vegan" || n.dietType === "jain";
  const dairyOk = !n.restrictions.includes("dairy") && n.dietType !== "vegan";
  const breakfast = dairyOk
    ? "Overnight oats with chia, berries; nuts/seeds"
    : "Besan chilla with avocado; fruit";
  const lunch = isVeg
    ? "Buddha bowl: quinoa, mixed veg, legumes, tahini"
    : n.dietType === "pescatarian"
    ? "Grilled fish, brown rice, salad, olive oil"
    : "Chicken stir-fry, millets, sautéed greens";
  const snack = "Fruit + handful of seeds; or yogurt if suitable";
  const dinner = isVeg
    ? "Khichdi with veggies + salad; or tofu curry with roti"
    : n.dietType === "pescatarian"
    ? "Fish curry with veg and rice"
    : "Dal/chicken, mixed veg, roti/rice";

  return {
    macros,
    hydration,
    includeFoods: Array.from(includeFoods),
    limitFoods: Array.from(limitFoods),
    dailyTips,
    sampleDay: { breakfast, lunch, snack, dinner },
  };
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [nutrition, setNutrition] = useState<NutritionProfile>(DEFAULT_NUTRITION);

  const plan = useMemo(() => computePersonalizedPlan(nutrition), [nutrition]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url, bio")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          toast({ title: "Failed to load profile", description: error.message, variant: "destructive" as any });
        }
        if (data) {
          setProfile(data as any);
        } else {
          setProfile({ id: user.id, full_name: "", avatar_url: "", bio: "" });
        }
      });
  }, [user, toast]);

  const save = async () => {
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" as any });
    } else {
      toast({ title: "Profile updated" });
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      setProfile((p) => ({ ...(p || { id: user.id, full_name: "", avatar_url: "", bio: "" }), avatar_url: publicUrl }));
      toast({ title: "Avatar uploaded" });
    } catch (e: any) {
      toast({ title: "Avatar upload failed", description: e.message, variant: "destructive" as any });
    } finally {
      setUploading(false);
    }
  };

  // Nutrition persistence (local per-user)
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(`nutrition:${user.id}`);
      if (raw) setNutrition({ ...DEFAULT_NUTRITION, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, [user?.id]);

  const saveNutrition = () => {
    if (!user) return;
    try {
      localStorage.setItem(`nutrition:${user.id}`, JSON.stringify(nutrition));
      toast({ title: "Nutrition preferences saved" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message ?? "Couldn't save locally" , variant: "destructive" as any });
    }
  };

  if (!user) return <div className="p-6">Please sign in</div>;

  return (
    <section className="min-h-screen p-4 pt-24">
      <div className="container mx-auto max-w-3xl">
        <div className="therapeutic-card p-6">
          <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={profile?.avatar_url || "https://placehold.co/80x80"}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadAvatar(file);
                  }}
                />
                <Button type="button" variant="outline" disabled={uploading} onClick={() => fileInputRef.current?.click()}>
                  {uploading ? "Uploading..." : "Upload Avatar"}
                </Button>
              </div>
            </div>
            <Input
              placeholder="Full name"
              value={profile?.full_name ?? ""}
              onChange={(e) => setProfile((p) => ({ ...(p || { id: user.id, full_name: "", avatar_url: "", bio: "" }), full_name: e.target.value }))}
            />
            <Input
              placeholder="Avatar URL"
              value={profile?.avatar_url ?? ""}
              onChange={(e) => setProfile((p) => ({ ...(p || { id: user.id, full_name: "", avatar_url: "", bio: "" }), avatar_url: e.target.value }))}
            />
            <textarea
              className="w-full border rounded-md p-2 min-h-[120px]"
              placeholder="Short bio"
              value={profile?.bio ?? ""}
              onChange={(e) => setProfile((p) => ({ ...(p || { id: user.id, full_name: "", avatar_url: "", bio: "" }), bio: e.target.value }))}
            />
            <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>

        {/* Nutrition & Diet Section */}
        <div className="therapeutic-card p-6 mt-6">
          <h2 className="text-xl font-semibold mb-1">Diet & Nutrition</h2>
          <p className="text-sm text-muted-foreground mb-4">Answer a few questions to tailor nutrition tips for your mental well-being.</p>

          <div className="grid grid-cols-1 gap-5">
            {/* Diet type */}
            <div>
              <label className="block text-sm font-medium mb-2">Primary diet preference</label>
              <Select value={nutrition.dietType} onValueChange={(v) => setNutrition((n) => ({ ...n, dietType: v as NutritionProfile["dietType"] }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select diet" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="pescatarian">Pescatarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-vegetarian</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="jain">Jain</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Restrictions */}
            <div>
              <label className="block text-sm font-medium mb-2">Restrictions or allergies</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { k: "dairy", label: "Dairy" },
                  { k: "gluten", label: "Gluten" },
                  { k: "nuts", label: "Nuts" },
                  { k: "eggs", label: "Eggs" },
                  { k: "soy", label: "Soy" },
                  { k: "shellfish", label: "Shellfish" },
                  { k: "none", label: "None" },
                ].map(({ k, label }) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={nutrition.restrictions.includes(k as any)}
                      onCheckedChange={(c) => {
                        setNutrition((n) => {
                          const next = new Set(n.restrictions);
                          if (c) next.add(k as any); else next.delete(k as any);
                          // If "None" selected, clear others; if others selected, remove "None"
                          if (k === "none" && c) return { ...n, restrictions: ["none"] as any };
                          if (k !== "none" && c) next.delete("none" as any);
                          return { ...n, restrictions: Array.from(next) as any };
                        });
                      }}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Caffeine intake */}
            <div>
              <label className="block text-sm font-medium mb-2">Caffeine intake</label>
              <RadioGroup
                value={nutrition.caffeineIntake}
                onValueChange={(v) => setNutrition((n) => ({ ...n, caffeineIntake: v as any }))}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                {[
                  { v: "none", label: "None" },
                  { v: "low", label: "Low" },
                  { v: "moderate", label: "Moderate" },
                  { v: "high", label: "High" },
                ].map((o) => (
                  <label key={o.v} className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value={o.v} /> {o.label}
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Water target */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="block text-sm font-medium mb-2">Water intake target (cups/day)</label>
                <Input
                  type="number"
                  min={4}
                  max={16}
                  value={nutrition.waterIntakeTargetCups}
                  onChange={(e) => setNutrition((n) => ({ ...n, waterIntakeTargetCups: Number(e.target.value || 0) }))}
                />
              </div>

              {/* Meal pattern */}
              <div>
                <label className="block text-sm font-medium mb-2">Typical meal pattern</label>
                <Select value={nutrition.mealPattern} onValueChange={(v) => setNutrition((n) => ({ ...n, mealPattern: v as any }))}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="three_meals">3 meals</SelectItem>
                    <SelectItem value="two_meals">2 meals</SelectItem>
                    <SelectItem value="small_frequent">Several small meals</SelectItem>
                    <SelectItem value="unstructured">Unstructured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mood-food patterns */}
            <div>
              <label className="block text-sm font-medium mb-2">Food habits impacting mood</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { k: "emotional_eating", label: "Emotional eating" },
                  { k: "appetite_loss_under_stress", label: "Appetite loss under stress" },
                  { k: "sugar_cravings", label: "Sugar cravings" },
                  { k: "comfort_foods", label: "Dependence on comfort foods" },
                  { k: "none", label: "None" },
                ].map(({ k, label }) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={nutrition.moodFoodPatterns.includes(k as any)}
                      onCheckedChange={(c) =>
                        setNutrition((n) => {
                          const next = new Set(n.moodFoodPatterns);
                          if (c) next.add(k as any); else next.delete(k as any);
                          if (k === "none" && c) return { ...n, moodFoodPatterns: ["none"] as any };
                          if (k !== "none" && c) next.delete("none" as any);
                          return { ...n, moodFoodPatterns: Array.from(next) as any };
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium mb-2">Mental health nutrition goals</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { k: "reduce_anxiety", label: "Reduce anxiety" },
                  { k: "improve_sleep", label: "Improve sleep" },
                  { k: "boost_energy", label: "Boost mood & energy" },
                  { k: "improve_focus", label: "Improve focus" },
                  { k: "stabilize_mood", label: "Stabilize mood" },
                ].map(({ k, label }) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={nutrition.goals.includes(k as any)}
                      onCheckedChange={(c) =>
                        setNutrition((n) => {
                          const next = new Set(n.goals);
                          if (c) next.add(k as any); else next.delete(k as any);
                          return { ...n, goals: Array.from(next) as any };
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Cuisines */}
            <div>
              <label className="block text-sm font-medium mb-2">Preferred cuisines</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { k: "indian", label: "Indian" },
                  { k: "mediterranean", label: "Mediterranean" },
                  { k: "asian", label: "Asian" },
                  { k: "continental", label: "Continental" },
                ].map(({ k, label }) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={nutrition.preferredCuisines.includes(k as any)}
                      onCheckedChange={(c) =>
                        setNutrition((n) => {
                          const next = new Set(n.preferredCuisines);
                          if (c) next.add(k as any); else next.delete(k as any);
                          return { ...n, preferredCuisines: Array.from(next) as any };
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Supplements / Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Supplements currently taking (optional)</label>
                <Input value={nutrition.supplements} onChange={(e) => setNutrition((n) => ({ ...n, supplements: e.target.value }))} placeholder="e.g., B12, Vitamin D, Ashwagandha" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                <Input value={nutrition.notes} onChange={(e) => setNutrition((n) => ({ ...n, notes: e.target.value }))} placeholder="Anything else to consider" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={saveNutrition}>Save Nutrition</Button>
            </div>
          </div>

          {/* Personalized plan preview */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Your Personalized Plan</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium">Recommended macros</p>
                <p className="text-sm text-muted-foreground">Carbs {plan.macros.carbsPct}% • Protein {plan.macros.proteinPct}% • Fat {plan.macros.fatPct}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Hydration</p>
                <p className="text-sm text-muted-foreground">Target {plan.hydration.cupsPerDay} cups/day</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {plan.hydration.tips.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Include more</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {plan.includeFoods.map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Limit</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {plan.limitFoods.map((t, i) => (<li key={i}>{t}</li>))}
                  </ul>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Daily tips</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {plan.dailyTips.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium">Sample day</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  <li>Breakfast: {plan.sampleDay.breakfast}</li>
                  <li>Lunch: {plan.sampleDay.lunch}</li>
                  <li>Snack: {plan.sampleDay.snack}</li>
                  <li>Dinner: {plan.sampleDay.dinner}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;


