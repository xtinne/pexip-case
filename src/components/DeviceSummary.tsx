import clsx from 'clsx'
import {
  AudioWaveform,
  CircleOff,
  Monitor,
  MonitorCheck,
  WifiOff,
} from 'lucide-react'
import { useDeviceSummary } from '@/hooks/useDevices'
import { deviceStatusLabels } from '@/types/device'
import type { DeviceSummary as DeviceSummaryData } from '@/hooks/useDevices'
import type { LucideIcon } from 'lucide-react'

const summaryItems: {
  label: string
  key: keyof DeviceSummaryData
  icon: LucideIcon
  iconClassName: string
}[] = [
  {
    label: 'Total devices',
    key: 'total',
    icon: Monitor,
    iconClassName: 'bg-accent/10 text-accent',
  },
  {
    label: deviceStatusLabels.online,
    key: 'online',
    icon: MonitorCheck,
    iconClassName: 'bg-online/10 text-online',
  },
  {
    label: deviceStatusLabels.inMeeting,
    key: 'inMeeting',
    icon: AudioWaveform,
    iconClassName: 'bg-in-meeting/10 text-in-meeting',
  },
  {
    label: deviceStatusLabels.offline,
    key: 'offline',
    icon: WifiOff,
    iconClassName: 'bg-offline/10 text-offline',
  },
  {
    label: deviceStatusLabels.deactivated,
    key: 'deactivated',
    icon: CircleOff,
    iconClassName: 'bg-deactivated/10 text-deactivated',
  },
]

const DeviceSummary = () => {
  const { data: summary, isError, isPending } = useDeviceSummary()

  if (isPending) {
    return <p role='status'>Loading device summary…</p>
  }

  if (isError) {
    return <p role='alert'>Unable to load device summary.</p>
  }

  return (
    <dl className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
      {summaryItems.map((item) => (
        <div
          key={item.key}
          className='rounded-2xl border border-border bg-surface p-5'
        >
          <dt className='text-sm font-semibold tracking-wide text-text uppercase'>
            {item.label}
          </dt>
          <dd className='mt-2 flex items-center justify-between gap-4'>
            <span className='text-3xl font-semibold tracking-tight text-heading'>
              {summary[item.key]}
            </span>
            <span
              aria-hidden='true'
              className={clsx(
                'flex size-10 items-center justify-center rounded-xl',
                item.iconClassName,
              )}
            >
              <item.icon size={20} strokeWidth={2} />
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default DeviceSummary
