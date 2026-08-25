import { Trash2, X } from 'lucide-react'
import { useRef } from 'react'
import { useDeleteDevice } from '@/hooks/useDevices'
import type { Device } from '@/types/device'

const DeleteDeviceDialog = ({ device }: { device: Device }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { isError, isPending, mutate: deleteDevice } = useDeleteDevice()

  const openDialog = () => {
    dialogRef.current?.showModal()
  }

  const closeDialog = () => {
    dialogRef.current?.close()
  }

  const removeDevice = () => {
    deleteDevice(device.id, { onSuccess: closeDialog })
  }

  return (
    <>
      <button
        type='button'
        aria-label={`Remove ${device.name}`}
        className='inline-flex size-9 items-center justify-center rounded-lg text-text transition-colors hover:bg-background hover:text-danger'
        onClick={openDialog}
      >
        <Trash2 aria-hidden='true' size={17} />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby='delete-device-heading'
        className='m-auto w-[calc(100%-3rem)] max-w-md rounded-2xl border border-border bg-surface p-0 text-left text-text backdrop:bg-primary/50'
      >
        <header className='relative px-6 pt-6 pr-16'>
          <h2 id='delete-device-heading'>Remove device</h2>
          <p className='mt-2 text-sm'>
            Are you sure you want to remove device “{device.name}”?
          </p>
          <button
            type='button'
            aria-label='Close remove device confirmation'
            disabled={isPending}
            className='absolute top-4 right-4 flex size-9 items-center justify-center rounded-lg text-text transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50'
            onClick={closeDialog}
          >
            <X aria-hidden='true' size={20} />
          </button>
        </header>

        <div className='px-6 pt-5 pb-6'>
          <footer className='flex flex-wrap justify-end gap-3 sm:items-center'>
            {isError && (
              <p
                className='w-full text-sm text-danger sm:mr-auto sm:w-auto'
                role='alert'
              >
                Unable to remove device.
              </p>
            )}
            <button
              type='button'
              disabled={isPending}
              className='flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-heading transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none'
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              type='button'
              disabled={isPending}
              className='flex-1 rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none'
              onClick={removeDevice}
            >
              {isPending ? 'Removing…' : 'Remove device'}
            </button>
          </footer>
        </div>
      </dialog>
    </>
  )
}

export default DeleteDeviceDialog
