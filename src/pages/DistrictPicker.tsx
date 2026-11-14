import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { IconCheck, IconPin } from '../components/ui/icons';

/** Berlin districts offered in the onboarding spec, with their postal codes. */
export const DISTRICT_OPTIONS: { name: string; zips: string[] }[] = [
  { name: 'Mitte / Tiergarten', zips: ['10115', '10117', '10178'] },
  { name: 'Friedrichshain-Kreuzberg', zips: ['10243', '10997'] },
  { name: 'Prenzlauer Berg / Pankow', zips: ['10405', '10437'] },
  { name: 'Charlottenburg-Wilmersdorf', zips: ['10585', '10623'] },
  { name: 'Neukölln', zips: ['12043', '12049'] },
  { name: 'Schöneberg / Tempelhof', zips: ['10777', '12101'] },
  { name: 'Wedding / Moabit', zips: ['13347', '10551'] },
  { name: 'Spandau / Reinickendorf', zips: ['13581', '13403'] },
];

const OTHER = 'Other';
const labelOf = (d: { name: string; zips: string[] }) => `${d.name} (${d.zips.join(', ')})`;

interface Option {
  value: string;
  title: string;
  hint: string;
}

/**
 * Searchable district / postal-code picker (ARIA combobox). Type a district
 * name or a postal code to filter; "Other" asks for the rider's own
 * postal code. Submits `district` (and `postalCode` for Other).
 */
export function DistrictPicker() {
  const id = useId().replace(/:/g, '');
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<number>();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<string>('');
  const [otherZip, setOtherZip] = useState('');

  // Once something is chosen, reopening shows the full list again.
  const q = selected ? '' : query.trim().toLowerCase();
  const digits = q.replace(/\D/g, '');
  const options = useMemo<Option[]>(() => {
    const matches = DISTRICT_OPTIONS.filter(
      (d) => !q || d.name.toLowerCase().includes(q) || (digits.length > 0 && d.zips.some((z) => z.startsWith(digits))),
    );
    const list: Option[] = matches.map((d) => ({ value: labelOf(d), title: d.name, hint: d.zips.join(' · ') }));
    const typedZip = digits.length === 5 && matches.length === 0;
    list.push({
      value: OTHER,
      title: typedZip ? `Other — postal code ${digits}` : 'Other',
      hint: typedZip ? 'Not in the list? Use this postal code' : 'My postal code isn’t listed',
    });
    return list;
  }, [q, digits]);

  const choose = (o: Option) => {
    setSelected(o.value);
    setOpen(false);
    if (o.value === OTHER) {
      setQuery('Other — postal code below');
      if (digits.length === 5) setOtherZip(digits);
      requestAnimationFrame(() => document.getElementById(`${id}-zip`)?.focus());
    } else {
      setQuery(o.value);
    }
    inputRef.current?.setCustomValidity('');
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) setOpen(true);
      setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length);
    } else if (e.key === 'Enter' && open) {
      e.preventDefault();
      if (options[active]) choose(options[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const submitted = selected === OTHER ? `${OTHER} (postal code ${otherZip || '—'})` : selected;

  return (
    <div className="combo-wrap">
      <div className="combo-anchor">
      <label className="field combo" htmlFor={`${id}-input`}>
        <span className="field__label">Current Berlin district / postal code</span>
        <span className="combo__control">
          <IconPin className="combo__icon" />
          <input
            ref={inputRef}
            id={`${id}-input`}
            className="field__input combo__input"
            type="text"
            inputMode="search"
            autoComplete="off"
            placeholder="Type a postal code or district, e.g. 10437"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
            required
            data-combobox
            data-valid={selected ? '1' : '0'}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected('');
              setOpen(true);
              setActive(0);
            }}
            onFocus={(e) => {
              window.clearTimeout(blurTimer.current);
              e.currentTarget.select(); // typing replaces the current choice
              setOpen(true);
            }}
            onClick={(e) => {
              // Already focused (e.g. after choosing with Enter): reopen and select.
              if (!open) {
                e.currentTarget.select();
                setOpen(true);
              }
            }}
            onBlur={() => {
              blurTimer.current = window.setTimeout(() => setOpen(false), 120);
            }}
            onKeyDown={onKey}
          />
          <span className="combo__chev" aria-hidden="true" />
        </span>
      </label>
      {open && (
        <ul id={`${id}-list`} className="combo__list lg-glass lg-glass--strong" role="listbox" aria-label="Berlin districts">
          {options.map((o, i) => (
            <li
              key={o.value + o.title}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={selected === o.value}
              className={`combo__opt ${i === active ? 'is-active' : ''} ${o.value === OTHER ? 'combo__opt--other' : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(o);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span>
                <strong>{o.title}</strong>
                <small>{o.hint}</small>
              </span>
              {selected === o.value && <IconCheck className="combo__tick" />}
            </li>
          ))}
        </ul>
      )}
      </div>
      <input type="hidden" name="district" value={submitted} />
      {selected === OTHER && (
        <label className="field combo__other" htmlFor={`${id}-zip`}>
          <span className="field__label">Your postal code</span>
          <input
            id={`${id}-zip`}
            className="field__input"
            name="postalCode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="e.g. 12555"
            pattern="^[0-9]{5}$"
            title="Please enter a 5-digit postal code"
            maxLength={5}
            required
            value={otherZip}
            onChange={(e) => setOtherZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
          />
          <span className="field__hint">5 digits — we’ll match you to the nearest delivery area.</span>
        </label>
      )}
    </div>
  );
}
