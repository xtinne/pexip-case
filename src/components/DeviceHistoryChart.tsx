import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { useQueryState } from 'nuqs'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useDeviceHistory } from '@/hooks/useDevices'
import { deviceStatusLabels } from '@/types/device'

const legendItems = [
  { label: deviceStatusLabels.online, className: 'bg-online' },
  { label: deviceStatusLabels.inMeeting, className: 'bg-in-meeting' },
  { label: deviceStatusLabels.offline, className: 'bg-offline' },
  { label: deviceStatusLabels.deactivated, className: 'bg-deactivated' },
]

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const formatPeriod = (period: string, selectedYear: string) => {
  const [year, month] = period.split('-')
  const monthLabel = monthLabels[Number(month) - 1]

  return selectedYear === 'all' ? `${monthLabel} '${year.slice(2)}` : monthLabel
}

const DeviceHistoryChart = () => {
  const { data: history, isError, isPending } = useDeviceHistory()
  const [year, setYear] = useQueryState('historyYear', {
    defaultValue: 'all',
  })

  if (isPending) {
    return (
      <section className='mt-8 rounded-2xl border border-border bg-surface p-6'>
        <p role='status'>Loading device history…</p>
      </section>
    )
  }

  if (isError) {
    return (
      <section className='mt-8 rounded-2xl border border-border bg-surface p-6'>
        <p role='alert'>Unable to load device history.</p>
      </section>
    )
  }

  const years = [...new Set(history.map(({ period }) => period.slice(0, 4)))]
  const selectedYear = years.includes(year) ? year : 'all'
  const chartData =
    selectedYear === 'all'
      ? history
      : history.filter(({ period }) => period.startsWith(selectedYear))

  return (
    <section
      aria-labelledby='device-history-heading'
      className='mt-8 rounded-2xl border border-border bg-surface p-6'
    >
      <header className='mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <h2 id='device-history-heading'>Device status over time</h2>
          <p className='mt-1 text-sm'>Monthly status totals</p>
        </div>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6'>
          <ul
            aria-label='Device status legend'
            className='flex flex-wrap gap-x-4 gap-y-2 text-sm'
          >
            {legendItems.map((item) => (
              <li key={item.label} className='flex items-center gap-2'>
                <span
                  aria-hidden='true'
                  className={clsx('size-2 rounded-full', item.className)}
                />
                {item.label}
              </li>
            ))}
          </ul>
          <div className='relative w-fit'>
            <label htmlFor='history-year' className='sr-only'>
              Filter device history by year
            </label>
            <select
              id='history-year'
              value={selectedYear}
              className='h-11 appearance-none rounded-lg border border-border bg-surface pr-10 pl-3 text-sm font-semibold text-heading outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'
              onChange={(event) =>
                setYear(
                  event.target.value === 'all' ? null : event.target.value,
                )
              }
            >
              <option value='all'>All years</option>
              {years.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden='true'
              size={16}
              className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text'
            />
          </div>
        </div>
      </header>

      <div className='h-80 w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 32, bottom: 8, left: 8 }}
          >
            <CartesianGrid
              vertical={false}
              stroke='var(--color-border)'
              strokeDasharray='4 4'
            />
            <XAxis
              dataKey='period'
              axisLine={false}
              interval='preserveStartEnd'
              minTickGap={32}
              tickFormatter={(period) => formatPeriod(period, selectedYear)}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis axisLine={false} tickLine={false} width={40} />
            <Tooltip
              cursor={{ stroke: 'var(--color-border)' }}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
              }}
              labelFormatter={(period) =>
                formatPeriod(String(period), selectedYear)
              }
            />
            <Line
              dataKey='online'
              name={deviceStatusLabels.online}
              stroke='var(--color-online)'
              strokeWidth={2}
              dot={false}
              type='monotone'
            />
            <Line
              dataKey='inMeeting'
              name={deviceStatusLabels.inMeeting}
              stroke='var(--color-in-meeting)'
              strokeWidth={2}
              dot={false}
              type='monotone'
            />
            <Line
              dataKey='offline'
              name={deviceStatusLabels.offline}
              stroke='var(--color-offline)'
              strokeWidth={2}
              dot={false}
              type='monotone'
            />
            <Line
              dataKey='deactivated'
              name={deviceStatusLabels.deactivated}
              stroke='var(--color-deactivated)'
              strokeWidth={2}
              dot={false}
              type='monotone'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default DeviceHistoryChart
