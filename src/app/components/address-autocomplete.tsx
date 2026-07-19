"use client";

import { useEffect, useRef, useState } from "react";
import { IconMapPin, IconPencil } from "@tabler/icons-react";
import Spinner from "./spinner";

export type AddressValue = {
  label: string;
  /** Resolved city (woonplaats) from PDOK; null when free text / unverified. */
  city: string | null;
  verified: boolean;
  lat?: number;
  lng?: number;
};

type Suggestion = {
  id: string;
  weergavenaam: string;
  type: string;
};

const SUGGEST_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest";
const LOOKUP_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup";

const inputClass =
  "w-full rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-page)] px-4 py-3 text-base text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-subtle)] focus:border-[var(--color-accent)]";

export default function AddressAutocomplete({
  label,
  value,
  onChange,
  placeholder = "Street, number or city…",
}: {
  label: string;
  value: AddressValue | null;
  onChange: (value: AddressValue | null) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(value?.label ?? "");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Debounced PDOK suggest.
  useEffect(() => {
    // Don't refetch right after a selection.
    if (value && text === value.label) return;

    if (text.trim().length < 3) {
      setItems([]);
      setOpen(false);
      return;
    }

    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: text.trim(),
          rows: "6",
          fq: "type:(adres OR weg OR woonplaats)",
        });
        const res = await fetch(`${SUGGEST_URL}?${params}`, {
          signal: ctrl.signal,
        });
        const json = await res.json();
        const docs = (json?.response?.docs ?? []) as Suggestion[];
        setItems(docs);
        setActive(-1);
        setOpen(true);
      } catch {
        /* aborted or offline — keep whatever we had */
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // Close on outside tap/click.
  useEffect(() => {
    function onDoc(e: MouseEvent | TouchEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, []);

  async function pick(s: Suggestion) {
    setOpen(false);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        id: s.id,
        fl: "id,weergavenaam,woonplaatsnaam,centroide_ll",
      });
      const res = await fetch(`${LOOKUP_URL}?${params}`);
      const json = await res.json();
      const doc = json?.response?.docs?.[0];
      const picked = doc?.weergavenaam ?? s.weergavenaam;
      const city = doc?.woonplaatsnaam ?? null;
      let lat: number | undefined;
      let lng: number | undefined;
      const m = /POINT\(([\d.]+) ([\d.]+)\)/.exec(doc?.centroide_ll ?? "");
      if (m) {
        lng = Number(m[1]);
        lat = Number(m[2]);
      }
      setText(picked);
      onChange({ label: picked, city, verified: Boolean(city), lat, lng });
    } catch {
      // Lookup failed — keep the suggestion text as unverified.
      setText(s.weergavenaam);
      onChange({ label: s.weergavenaam, city: null, verified: false });
    } finally {
      setLoading(false);
    }
  }

  function useAsTyped() {
    const typed = text.trim();
    if (!typed) return;
    setOpen(false);
    onChange({ label: typed, city: null, verified: false });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && items[active]) pick(items[active]);
      else if (items.length > 0) pick(items[0]);
      else useAsTyped();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
        {label}
      </span>
      <div className="relative">
        <input
          type="text"
          required
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (value) onChange(null); // editing invalidates the selection
          }}
          onFocus={() => {
            if (items.length > 0 && text.trim().length >= 3 && !value)
              setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={inputClass}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {loading && (
          <Spinner className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-accent)]" />
        )}
      </div>

      {open && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-surface)] py-1 shadow-lg shadow-black/40">
          {items.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => pick(s)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-start gap-2.5 px-4 py-2.5 text-left text-sm transition ${
                  i === active
                    ? "bg-[var(--color-surface-2)] text-[var(--color-ink)]"
                    : "text-[var(--color-ink-muted)]"
                }`}
              >
                <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                {s.weergavenaam}
              </button>
            </li>
          ))}
          {text.trim().length >= 3 && (
            <li className={items.length > 0 ? "border-t border-[var(--color-line)]" : ""}>
              <button
                type="button"
                onClick={useAsTyped}
                className="flex w-full items-start gap-2.5 px-4 py-2.5 text-left text-sm text-[var(--color-ink-subtle)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
              >
                <IconPencil className="mt-0.5 h-4 w-4 shrink-0" />
                Use “{text.trim()}” as entered
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
