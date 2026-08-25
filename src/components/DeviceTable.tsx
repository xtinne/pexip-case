import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { cva } from 'class-variance-authority'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo } from 'react'
import DeleteDeviceDialog from '@/components/DeleteDeviceDialog'
import { deviceStatusLabels } from '@/types/device'
import type { Device, DeviceStatus } from '@/types/device'
import type { TableState } from '@tanstack/react-table'

const statusBadge = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold ring-1 ring-inset',
  {
    variants: {
      status: {
        online: 'bg-online/10 text-online ring-online/20',
        inMeeting: 'bg-in-meeting/10 text-in-meeting ring-in-meeting/20',
        offline: 'bg-offline/10 text-offline ring-offline/20',
        deactivated: 'bg-deactivated/10 text-deactivated ring-deactivated/20',
      },
    },
  },
)

const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { text: sortFn_text },
})

const columnHelper = createColumnHelper<typeof features, Device>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: 'Device',
    sortFn: 'text',
    cell: ({ row }) => (
      <span>
        <span className='block text-base font-semibold text-heading'>
          {row.original.name}
        </span>
        <span className='mt-0.5 block text-sm text-text'>
          {row.original.description}
        </span>
      </span>
    ),
  }),
  columnHelper.accessor('model', { header: 'Model', sortFn: 'text' }),
  columnHelper.accessor('status', {
    header: 'Status',
    filterFn: filterFn_equalsString,
    sortFn: 'text',
    cell: ({ cell }) => {
      const status = cell.getValue()

      return (
        <span className={statusBadge({ status })}>
          <span
            aria-hidden='true'
            className='size-1.5 rounded-full bg-current'
          />
          {deviceStatusLabels[status]}
        </span>
      )
    },
  }),
  columnHelper.display({
    id: 'actions',
    enableSorting: false,
    header: () => <span className='sr-only'>Actions</span>,
    cell: ({ row }) => <DeleteDeviceDialog device={row.original} />,
  }),
])

const getRowId = (device: Device) => device.id

const selectTableState = (state: TableState<typeof features>) => ({
  pagination: state.pagination,
  sorting: state.sorting,
})

const canGlobalFilter = (column: { id: string }) => column.id === 'name'

const DeviceTable = ({
  devices,
  search,
  status,
}: {
  devices: Device[]
  search: string
  status: DeviceStatus | 'all'
}) => {
  const columnFilters = useMemo(
    () => (status === 'all' ? [] : [{ id: 'status', value: status }]),
    [status],
  )

  const table = useTable(
    {
      features,
      data: devices,
      columns,
      getRowId,
      getColumnCanGlobalFilter: canGlobalFilter,
      globalFilterFn: filterFn_includesString,
      state: {
        columnFilters,
        globalFilter: search,
      },
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
    },
    selectTableState,
  )

  return (
    <>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-176 table-fixed border-collapse text-left'>
          <caption className='sr-only'>Meeting room devices</caption>
          <colgroup>
            <col />
            <col className='w-1/4' />
            <col className='w-1/5' />
            <col className='w-20' />
          </colgroup>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className='border-y border-border bg-background'
              >
                {headerGroup.headers.map((header) => {
                  const sortDirection = header.column.getIsSorted()

                  return (
                    <th
                      key={header.id}
                      scope='col'
                      aria-sort={
                        sortDirection
                          ? sortDirection === 'asc'
                            ? 'ascending'
                            : 'descending'
                          : undefined
                      }
                      className='px-6 py-3 text-sm font-semibold tracking-wide text-text uppercase'
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type='button'
                          className='inline-flex items-center gap-2 uppercase'
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                          {sortDirection === 'asc' ? (
                            <ArrowUp aria-hidden='true' size={15} />
                          ) : sortDirection === 'desc' ? (
                            <ArrowDown aria-hidden='true' size={15} />
                          ) : (
                            <ArrowUpDown aria-hidden='true' size={15} />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='px-6 py-12 text-center'>
                  No devices match the selected filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className='border-b border-border transition-colors last:border-0 hover:bg-background/70'
                >
                  {row.getAllCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-6 py-4 text-sm last:text-right'
                    >
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 0 && (
        <nav
          aria-label='Device table pagination'
          className='flex items-center justify-between border-t border-border px-6 py-4'
        >
          <p className='text-sm text-text'>
            Page {table.state.pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </p>
          <div className='flex gap-2'>
            <button
              type='button'
              className='flex size-9 items-center justify-center rounded-lg border border-border text-lg text-text transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40'
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <span aria-hidden='true'>‹</span>
              <span className='sr-only'>Previous page</span>
            </button>
            <button
              type='button'
              className='flex size-9 items-center justify-center rounded-lg border border-border text-lg text-text transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40'
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <span aria-hidden='true'>›</span>
              <span className='sr-only'>Next page</span>
            </button>
          </div>
        </nav>
      )}
    </>
  )
}

export default DeviceTable
