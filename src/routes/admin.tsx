import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useHouseConfig } from "@/config/houseContext";
import type { HouseConfigData, SpotData, ManualItemData, ContactData, EventData } from "@/lib/houseConfigTypes";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Save, Home } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Salento Flow" }] }),
});

function AdminPage() {
  const navigate = useNavigate();
  const { config, configId, refetch, loading } = useHouseConfig();
  const [checking, setChecking] = useState(true);
  const [draft, setDraft] = useState<HouseConfigData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) { navigate({ to: "/auth" }); return; }
      setChecking(false);
    })();
  }, [navigate]);

  useEffect(() => {
    if (config) {
      const clone = structuredClone(config);
      if (!Array.isArray(clone.events)) clone.events = [];
      setDraft(clone);
    }
  }, [config]);

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  const save = async () => {
    if (!draft || !configId) return;
    setSaving(true);
    const { error } = await supabase
      .from("house_config" as never)
      .update({ data: draft } as never)
      .eq("id", configId);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Salvato"); refetch(); }
  };

  if (checking || loading || !draft) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">…</div>;
  }

  const upd = (patch: Partial<HouseConfigData>) => setDraft({ ...draft, ...patch });

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs">
            <Home className="h-3.5 w-3.5" /> Guida
          </Link>
          <h1 className="text-lg font-medium">CMS</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={save} disabled={saving}
            className="flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-medium disabled:opacity-60"
            style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>
            <Save className="h-3.5 w-3.5" /> {saving ? "…" : "Salva"}
          </button>
          <button onClick={signOut} className="flex h-9 w-9 items-center justify-center rounded-full border border-border" aria-label="logout">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-8 px-4 py-6">
        {/* BASICS */}
        <Section title="Testi base">
          <Field label="Nome ospite" value={draft.guest_name} onChange={(v) => upd({ guest_name: v })} />
          <Field label="Nome host" value={draft.host_name} onChange={(v) => upd({ host_name: v })} />
          <Field label="Immagine hero (URL)" value={draft.hero_image_url}
            onChange={(v) => upd({ hero_image_url: v })} placeholder="https://..." />
          <Grid2>
            <Field label="Kicker (IT)" value={draft.hero.kicker_it}
              onChange={(v) => upd({ hero: { ...draft.hero, kicker_it: v } })} />
            <Field label="Kicker (EN)" value={draft.hero.kicker_en}
              onChange={(v) => upd({ hero: { ...draft.hero, kicker_en: v } })} />
          </Grid2>
          <Grid2>
            <Textarea label="Sottotitolo (IT)" value={draft.hero.subtitle_it}
              onChange={(v) => upd({ hero: { ...draft.hero, subtitle_it: v } })} />
            <Textarea label="Sottotitolo (EN)" value={draft.hero.subtitle_en}
              onChange={(v) => upd({ hero: { ...draft.hero, subtitle_en: v } })} />
          </Grid2>
        </Section>

        <Section title="Wi-Fi">
          <Grid2>
            <Field label="SSID" value={draft.wifi.ssid} onChange={(v) => upd({ wifi: { ...draft.wifi, ssid: v } })} />
            <Field label="Password" value={draft.wifi.password} onChange={(v) => upd({ wifi: { ...draft.wifi, password: v } })} />
          </Grid2>
        </Section>

        <Section title="Mappa — centro">
          <Grid2>
            <Field label="Lat" value={String(draft.map.center_lat)}
              onChange={(v) => upd({ map: { ...draft.map, center_lat: parseFloat(v) || 0 } })} />
            <Field label="Lng" value={String(draft.map.center_lng)}
              onChange={(v) => upd({ map: { ...draft.map, center_lng: parseFloat(v) || 0 } })} />
          </Grid2>
          <Field label="Zoom" value={String(draft.map.zoom)}
            onChange={(v) => upd({ map: { ...draft.map, zoom: parseFloat(v) || 10 } })} />
        </Section>

        {/* SPOTS */}
        <Section title="Spot mappa"
          onAdd={() => upd({ spots: [...draft.spots, newSpot()] })}>
          <div className="space-y-4">
            {draft.spots.map((s, i) => (
              <SpotEditor key={i} spot={s}
                onChange={(next) => upd({ spots: draft.spots.map((x, j) => j === i ? next : x) })}
                onDelete={() => upd({ spots: draft.spots.filter((_, j) => j !== i) })} />
            ))}
          </div>
        </Section>

        {/* MANUAL */}
        <Section title="Manuale casa / FAQ"
          onAdd={() => upd({ manual: [...draft.manual, newManual()] })}>
          <div className="space-y-4">
            {draft.manual.map((m, i) => (
              <ManualEditor key={i} item={m}
                onChange={(next) => upd({ manual: draft.manual.map((x, j) => j === i ? next : x) })}
                onDelete={() => upd({ manual: draft.manual.filter((_, j) => j !== i) })} />
            ))}
          </div>
        </Section>

        {/* CONTACTS */}
        <Section title="Contatti">
          <div className="space-y-4">
            {draft.contacts.map((c, i) => (
              <ContactEditor key={i} contact={c}
                onChange={(next) => upd({ contacts: draft.contacts.map((x, j) => j === i ? next : x) })} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function newSpot(): SpotData {
  return { id: crypto.randomUUID().slice(0, 8), category: "locali", type: "ristorante",
    maps_query: "", lat: 40.35, lng: 18.17, name_it: "", name_en: "", desc_it: "", desc_en: "" };
}
function newManual(): ManualItemData {
  return { id: crypto.randomUUID().slice(0, 8), icon: "book", title_it: "", title_en: "", body_it: "", body_en: "" };
}
function newEvent(): EventData {
  return { id: crypto.randomUUID().slice(0, 8), date: "", title_it: "", title_en: "", desc_it: "", desc_en: "", location: "", maps_query: "" };
}


function Section({ title, children, onAdd }: { title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="flex h-8 items-center gap-1 rounded-full border border-border px-3 text-xs">
            <Plus className="h-3.5 w-3.5" /> Aggiungi
          </button>
        )}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
    </label>
  );
}
function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
    </label>
  );
}
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function SpotEditor({ spot, onChange, onDelete }: { spot: SpotData; onChange: (s: SpotData) => void; onDelete: () => void }) {
  const set = <K extends keyof SpotData>(k: K, v: SpotData[K]) => onChange({ ...spot, [k]: v });
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">#{spot.id}</span>
        <button onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
      </div>
      <Grid2>
        <Select label="Categoria" value={spot.category} options={["supermercati", "ristoranti", "essenziali", "locali"]} onChange={(v) => set("category", v as SpotData["category"])} />
        <Select label="Tipo" value={spot.type} options={["supermercato", "farmacia", "ristorante", "spiaggia", "chicca"]} onChange={(v) => set("type", v as SpotData["type"])} />
      </Grid2>

      <Grid2>
        <Field label="Nome IT" value={spot.name_it} onChange={(v) => set("name_it", v)} />
        <Field label="Nome EN" value={spot.name_en} onChange={(v) => set("name_en", v)} />
      </Grid2>
      <Grid2>
        <Textarea label="Descrizione IT" value={spot.desc_it} onChange={(v) => set("desc_it", v)} />
        <Textarea label="Descrizione EN" value={spot.desc_en} onChange={(v) => set("desc_en", v)} />
      </Grid2>
      <Field label="Google Maps query" value={spot.maps_query} onChange={(v) => set("maps_query", v)} />
      <Grid2>
        <Field label="Lat" value={String(spot.lat)} onChange={(v) => set("lat", parseFloat(v) || 0)} />
        <Field label="Lng" value={String(spot.lng)} onChange={(v) => set("lng", parseFloat(v) || 0)} />
      </Grid2>
    </div>
  );
}

function ManualEditor({ item, onChange, onDelete }: { item: ManualItemData; onChange: (m: ManualItemData) => void; onDelete: () => void }) {
  const set = <K extends keyof ManualItemData>(k: K, v: ManualItemData[K]) => onChange({ ...item, [k]: v });
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">#{item.id}</span>
        <button onClick={onDelete} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
      </div>
      <Select label="Icona" value={item.icon}
        options={["trash", "snowflake", "droplets", "key", "clock", "cigarette", "paw", "book"]}
        onChange={(v) => set("icon", v)} />
      <Grid2>
        <Field label="Titolo IT" value={item.title_it} onChange={(v) => set("title_it", v)} />
        <Field label="Titolo EN" value={item.title_en} onChange={(v) => set("title_en", v)} />
      </Grid2>
      <Grid2>
        <Textarea label="Testo IT" value={item.body_it} onChange={(v) => set("body_it", v)} />
        <Textarea label="Testo EN" value={item.body_en} onChange={(v) => set("body_en", v)} />
      </Grid2>
    </div>
  );
}

function ContactEditor({ contact, onChange }: { contact: ContactData; onChange: (c: ContactData) => void }) {
  const set = <K extends keyof ContactData>(k: K, v: ContactData[K]) => onChange({ ...contact, [k]: v });
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-3 space-y-2">
      <span className="text-xs text-muted-foreground">#{contact.key}</span>
      <Field label="Numero" value={contact.number} onChange={(v) => set("number", v)} />
      <Grid2>
        <Field label="Etichetta IT" value={contact.label_it} onChange={(v) => set("label_it", v)} />
        <Field label="Etichetta EN" value={contact.label_en} onChange={(v) => set("label_en", v)} />
      </Grid2>
      <Grid2>
        <Field label="Sotto IT" value={contact.sub_it} onChange={(v) => set("sub_it", v)} />
        <Field label="Sotto EN" value={contact.sub_en} onChange={(v) => set("sub_en", v)} />
      </Grid2>
      <div className="flex gap-4 text-xs">
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={!!contact.whatsapp} onChange={(e) => set("whatsapp", e.target.checked)} />
          WhatsApp
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={!!contact.emergency} onChange={(e) => set("emergency", e.target.checked)} />
          Emergenza
        </label>
      </div>
    </div>
  );
}
