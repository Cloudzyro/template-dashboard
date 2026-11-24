// Small, dependency-free SVG charts. They size themselves to their container
// and use the --chart-* and --grid colors from index.css, so they follow dark mode.
import { useLayoutEffect, useRef, useState } from "react";

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
                <stop offset="0" stopColor={s.color} stopOpacity="0.16" />
                <stop offset="1" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + w} y1={y(t)} y2={y(t)} stroke="var(--grid)" />
              <text x={pad.left - 10} y={y(t)} dy="0.32em" textAnchor="end" className="num fill-muted font-mono text-[11px]">
                {format(t)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            labels.length <= 12 || i % 2 === 0 ? (
              <text key={l} x={x(i)} y={height - 8} textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"} className="fill-muted font-mono text-[11px]">
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
          {series
            .filter((s) => s.fill)
            .map((s) => {
              const last = s.values.length - 1;
              return <circle key={`end-${s.name}`} cx={x(last)} cy={y(s.values[last])} r="5" fill="var(--panel)" stroke={s.color} strokeWidth="3" />;
            })}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + h} stroke="var(--muted)" strokeOpacity="0.4" />
              {series.map((s) => (
                <circle key={s.name} cx={x(hover)} cy={y(s.values[hover])} r="4" fill="var(--panel)" stroke={s.color} strokeWidth="2" />
              ))}
            </g>
          )}
        </svg>
      )}
      {hover !== null && width > 0 && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-lg border border-line bg-panel px-3 py-2 text-sm shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          style={{ left: Math.min(Math.max(x(hover) - 80, 0), width - 170) }}
        >
          <p className="mb-1 font-mono text-xs text-muted">{labels[hover]}</p>
          {series.map((s) => (
            <p key={s.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: s.color }} />
                {s.name}
              </span>
              <span className="num font-medium">{format(s.values[hover])}</span>
            </p>
          ))}
        </div>
      )}
      <DataTableForScreenReaders labels={labels} series={series} format={format} />
    </div>
  );
}

export function BarChart({ data, height = 220 }: { data: { label: string; value: number }[]; height?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const pad = { top: 24, bottom: 24 };
  const h = height - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.value));
  const slot = width / data.length;
  const bw = Math.min(28, slot * 0.56);
  return (
    <div ref={ref} className="relative">
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Bar chart">
          <line x1="0" x2={width} y1={pad.top + h} y2={pad.top + h} stroke="var(--grid)" />
          {data.map((d, i) => {
            const bh = (d.value / max) * h;
            const cx = slot * i + slot / 2;
            const last = i === data.length - 1;
            return (
              <g key={d.label}>
                <rect x={cx - bw / 2} y={pad.top + h - bh} width={bw} height={bh} rx="3" fill={last ? "var(--chart-1)" : "var(--chart-bar)"} />
                <text x={cx} y={pad.top + h - bh - 8} textAnchor="middle" className={last ? "num fill-fg font-mono text-[11px] font-medium" : "num fill-muted font-mono text-[11px]"}>
                  {d.value}
                </text>
                <text x={cx} y={height - 6} textAnchor="middle" className="fill-muted font-mono text-[11px]">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      <DataTableForScreenReaders labels={data.map((d) => d.label)} series={[{ name: "Value", values: data.map((d) => d.value), color: "" }]} format={String} />
    </div>
  );
}

// A share as a ranked list with thin bars: easier to read than a donut and
// quiet enough to sit next to the main chart.
export function ShareList({ data, format }: { data: { label: string; value: number }[]; format: (v: number) => string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ul className="space-y-4 text-sm">
      {data.map((d) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span>{d.label}</span>
            <span className="num text-muted">
              <span className="text-fg">{format(d.value)}</span>
              <span className="ml-2 inline-block w-9 text-right font-mono text-xs">{Math.round((d.value / total) * 100)}%</span>
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-[var(--grid)]">
            <div className="h-full rounded-full bg-[var(--chart-muted)]" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DataTableForScreenReaders({ labels, series, format }: { labels: string[]; series: Series[]; format: (v: number) => string }) {
  return (
    // Wrapped in a div: a table ignores the 1px height of sr-only and would stretch the page.
    <div className="sr-only">
      <table>
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
    </div>
  );
}
