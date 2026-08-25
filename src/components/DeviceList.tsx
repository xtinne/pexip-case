import { ChevronDown, Search, X } from 'lucide-react'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import AddDeviceDialog from '@/components/AddDeviceDialog'
import DeviceTable from '@/components/DeviceTable'
import { useDevices, useDeviceSummary } from '@/hooks/useDevices'
import { deviceStatuses } from '@/types/device'
import type { DeviceStatus } from '@/types/device'

const statusValues = [
  'all',
  ...deviceStatuses.map(({ value }) => value),
] as const satisfies readonly (DeviceStatus | 'all')[]

const statusOptions: { label: string; value: DeviceStatus | 'all' }[] = [
  { label: 'All statuses', value: 'all' },
  ...deviceStatuses,
]

const statusDescriptions: Record<DeviceStatus, string> = {
  online: 'online devices',
  inMeeting: 'devices in meeting',
  offline: 'offline devices',
  deactivated: 'deactivated devices',
}

const DeviceList = () => {
  const { data: devices, isError, isPending } = useDevices()
  const { data: summary } = useDeviceSummary()
  const [search, setSearch] = useQueryState('search', { defaultValue: '' })
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringLiteral(statusValues).withDefault('all'),
  )

  return (
    <section
      aria-labelledby='device-list-heading'
      className='mt-8 overflow-hidden rounded-2xl border border-border bg-surface'
    >
      <header className='flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 id='device-list-heading'>All devices</h2>
          {devices && (
            <p className='mt-1 text-sm text-text'>
              {status === 'all'
                ? `${devices.length} devices across all offices`
                : `${summary?.[status] ?? 0} ${statusDescriptions[status]}`}
            </p>
          )}
        </div>
        <div className='flex w-full flex-col gap-3 sm:w-auto sm:flex-row'>
          <div className='relative w-full sm:w-72'>
            <label htmlFor='device-search' className='sr-only'>
              Search devices by name
            </label>
            <Search
              aria-hidden='true'
              size={18}
              className='pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text'
            />
            <input
              id='device-search'
              type='search'
              value={search}
              placeholder='Search by name…'
              className='h-11 w-full rounded-lg border border-border bg-surface pr-10 pl-10 text-sm text-heading outline-none placeholder:text-text focus:border-accent focus:ring-2 focus:ring-accent/20'
              onChange={(event) => setSearch(event.target.value || null)}
            />
            {search && (
              <button
                type='button'
                aria-label='Clear device search'
                className='absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-text transition-colors hover:bg-background'
                onClick={() => setSearch(null)}
              >
                <X aria-hidden='true' size={16} />
              </button>
            )}
          </div>
          <div className='relative w-full sm:w-auto'>
            <label htmlFor='device-status-filter' className='sr-only'>
              Filter devices by status
            </label>
            <select
              id='device-status-filter'
              value={status}
              className='h-11 w-full appearance-none rounded-lg border border-border bg-surface pr-10 pl-3 text-sm font-semibold text-heading outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'
              onChange={(event) => {
                const newStatus = statusValues.find(
                  (status) => status === event.target.value,
                )

                setStatus(newStatus === 'all' ? null : (newStatus ?? null))
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden='true'
              size={16}
              className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text'
            />
          </div>
          <AddDeviceDialog />
        </div>
      </header>

      {isPending && (
        <p
          className='border-t border-border px-6 py-12 text-center'
          role='status'
        >
          Loading devices…
        </p>
      )}
      {isError && (
        <p
          className='border-t border-border px-6 py-12 text-center'
          role='alert'
        >
          Unable to load devices.
        </p>
      )}
      {devices && (
        <DeviceTable devices={devices} search={search} status={status} />
      )}
    </section>
  )
}

export default DeviceList
