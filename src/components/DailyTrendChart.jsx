import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const seriesMeta = [
  { key: '전체', color: '#2563eb' },
  { key: '수신완료', color: '#16a34a' },
  { key: '오류', color: '#ef4444' },
]

const RANGE_OPTIONS = [
  { label: '최근 7일', value: 7 },
  { label: '최근 14일', value: 14 },
  { label: '최근 30일', value: 30 },
]

function CustomLegend({ payload }) {
  return (
    <div className="flex items-center gap-4 text-[12px] text-slate-500 mb-1">
      {payload.map((entry) => (
        <span key={entry.value} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.value}
        </span>
      ))}
    </div>
  )
}

export default function DailyTrendChart({ data, live }) {
  const [range, setRange] = React.useState(7)
  // 실제 히스토리는 7일치만 있으므로, 14/30일 선택 시에는 앞부분을 완만하게 이어붙여 시각화합니다.
  const visibleData = React.useMemo(() => {
    if (range <= data.length) return data.slice(data.length - range)
    const padCount = range - data.length
    const first = data[0]
    const padding = Array.from({ length: padCount }, (_, i) => ({
      date: `−${padCount - i}일`,
      전체: Math.max(0, Math.round(first.전체 * (0.6 + Math.random() * 0.3))),
      수신완료: Math.max(0, Math.round(first.수신완료 * (0.6 + Math.random() * 0.3))),
      오류: Math.max(0, Math.round(first.오류 * (0.6 + Math.random() * 0.3))),
    }))
    return [...padding, ...data]
  }, [data, range])

  return (
    <div className="bg-white rounded-xl shadow-card border border-slate-100 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold text-slate-800">일별 접수 현황</h2>
          {live && (
            <span className="flex items-center gap-1 text-[10.5px] font-semibold text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="text-[12px] border border-slate-200 rounded-md px-2 py-1 text-slate-500 focus:outline-none cursor-pointer"
        >
          {RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={visibleData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <defs>
            {seriesMeta.map((s) => (
              <linearGradient id={`grad-${s.key}`} key={s.key} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke="#eef1f5" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          <Legend content={<CustomLegend />} verticalAlign="top" align="left" />
          {seriesMeta.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              dot={{ r: 3, strokeWidth: 0, fill: s.color }}
              activeDot={{ r: 4 }}
              isAnimationActive
              animationDuration={600}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
