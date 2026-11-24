// Small, dependency-free SVG charts. They size themselves to their container
// and use the --chart-* colors from index.css, so they follow dark mode.
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function niceMax(value: number) {
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow * 4 >= value) ?? 10;
  return step * pow * 4;
}

type Series = { name: string; values: number[]; color: string; dashed?: boolean; fill?: boolean };

export function AreaChart({ labels, series, height = 300, format }: { labels: string[]; series: Series[]; height?: number; format: (v: number) => string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { top: 12, right: 10, bottom: 28, left: 52 };
  const w = Math.max(width - pad.left - pad.right, 10);
  const h = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(...series.flatMap((s) => s.values)));
  const x = (i: number) => pad.left + (i / (labels.length - 1)) * w;
  const y = (v: number) => pad.top + h - (v / max) * h;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left - pad.left;
    setHover(Math.max(0, Math.min(labels.length - 1, Math.round((px / w) * (labels.length - 1)))));
  }

  return (
    <div ref={ref} className="relative">
      {width > 0 && (
        <svg width={width} height={height} onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label={`Line chart of ${series.map((s) => s.name).join(" and ")}`}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.name} id={`area-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={s.color} stopOpacity="0.28" />
                <stop offset="1" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + w} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
              <text x={pad.left - 10} y={y(t)} dy="0.32em" textAnchor="end" className="num fill-muted text-[11px]">
                {format(t)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            labels.length <= 12 || i % 2 === 0 ? (
              <text key={l} x={x(i)} y={height - 8} textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"} className="fill-muted text-[11px]">
                {width < 480 && i % 2 === 1 ? "" : l}
              </text>
            ) : null,
          )}
          {series.map((s, i) => {
            const line = s.values.map((v, j) => `${j ? "L" : "M"}${x(j)},${y(v)}`).join("");
            return (
              <g key={s.name}>
                {s.fill && <path d={`${line}L${x(s.values.length - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={`url(#area-${i})`} />}
                <path d={line} fill="none" stroke={s.color} strokeWidth={s.dashed ? 1.75 : 2.5} strokeDasharray={s.dashed ? "5 5" : undefined} strokeLinejoin="round" strokeLinecap="round" />
              </g>
            );
          })}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + h} stroke="var(--muted)" strokeOpacity="0.4" />
              {series.map((s) => (
                <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r="4.5" fill="var(--panel)" stroke={s.color} strokeWidth="2.5" />
              ))}
            </g>
          )}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-xl border border-line bg-panel px-3 py-2 text-sm shadow-lg"
          style={{ left: Math.min(Math.max(x(hover) - 80, 0), width - 170) }}
        >
          <p className="mb-1 text-xs font-semibold text-muted">{labels[hover]}</p>
          {series.map((s) => (
            <p key={s.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="num font-semibold">{format(s.values[hover])}</span>
            </p>
          ))}
        </div>
      )}
      <DataTableForScreenReaders labels={labels} series={series} format={format} />
    </div>
  );
}

export function BarChart({ data, height = 220, color = "var(--chart-1)" }: { data: { label: string; value: number }[]; height?: number; color?: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const pad = { top: 22, bottom: 26 };
  const h = height - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.value));
  const slot = width / data.length;
  const bw = Math.min(36, slot * 0.6);
  return (
    <div ref={ref}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Bar chart">
          {data.map((d, i) => {
            const bh = (d.value / max) * h;
            const cx = slot * i + slot / 2;
            const last = i === data.length - 1;
            return (
              <g key={d.label}>
                <rect x={cx - bw / 2} y={pad.top + h - bh} width={bw} height={bh} rx="7" fill={color} opacity={last ? 1 : 0.35} />
                <text x={cx} y={pad.top + h - bh - 7} textAnchor="middle" className="num fill-fg text-[11px] font-semibold">
                  {d.value}
                </text>
                <text x={cx} y={height - 6} textAnchor="middle" className="fill-muted text-[11px]">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      <DataTableForScreenReaders labels={data.map((d) => d.label)} series={[{ name: "Value", values: data.map((d) => d.value), color }]} format={String} />
    </div>
  );
}

export function Donut({ data, colors, center }: { data: { label: string; value: number }[]; colors: string[]; center: ReactNode }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 64;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col">
      <div className="relative size-44 shrink-0">
        <svg viewBox="0 0 160 160" className="size-full -rotate-90" role="img" aria-label="Donut chart">
          <circle cx="80" cy="80" r={r} fill="none" stroke="var(--grid)" strokeWidth="18" />
          {data.map((d, i) => {
            const len = (d.value / total) * c;
            const el = <circle key={d.label} cx="80" cy="80" r={r} fill="none" stroke={colors[i]} strokeWidth="18" strokeDasharray={`${Math.max(len - 3, 0)} ${c}`} strokeDashoffset={-offset} />;
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">{center}</div>
      </div>
      <ul className="w-full space-y-2.5 text-sm">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm" style={{ background: colors[i] }} aria-hidden="true" />
              {d.label}
            </span>
            <span className="num text-muted">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sparkline({ values, color }: { values: number[]; color: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 26}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-9 w-full" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function DataTableForScreenReaders({ labels, series, format }: { labels: string[]; series: Series[]; format: (v: number) => string }) {
  return (
    <table className="sr-only">
      <thead>
        <tr>
          <th>Label</th>
          {series.map((s) => (
            <th key={s.name}>{s.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {labels.map((l, i) => (
          <tr key={l}>
            <th>{l}</th>
            {series.map((s) => (
              <td key={s.name}>{format(s.values[i])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
