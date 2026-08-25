import { Plus, X } from 'lucide-react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateDevice } from '@/hooks/useDevices'
import { deviceStatuses } from '@/types/device'
import type { CreateDeviceInput } from '@/types/device'
import type { SubmitEvent } from 'react'

const AddDeviceDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const {
    isError,
    isPending,
    mutate: createDevice,
    reset: resetMutation,
  } = useCreateDevice()

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset: resetForm,
  } = useForm<CreateDeviceInput>({
    defaultValues: { status: 'online' },
  })

  const closeDialog = () => {
    dialogRef.current?.close()
  }

  const openDialog = () => {
    dialogRef.current?.showModal()
  }

  const addDevice = (input: CreateDeviceInput) => {
    createDevice(input, { onSuccess: closeDialog })
  }

  const submitForm = (event: SubmitEvent) => {
    handleSubmit(addDevice)(event)
  }

  return (
    <>
      <button
        type='button'
        className='inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-background transition-opacity hover:opacity-90'
        onClick={openDialog}
      >
        <Plus aria-hidden='true' size={18} />
        Add device
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby='add-device-heading'
        className='m-auto w-[calc(100%-3rem)] max-w-lg rounded-2xl border border-border bg-surface p-0 text-text backdrop:bg-primary/50'
        onClose={() => {
          resetForm()
          resetMutation()
        }}
      >
        <header className='flex items-start justify-between gap-4 border-b border-border px-6 py-5'>
          <div>
            <h2 id='add-device-heading'>Add device</h2>
            <p className='mt-1 text-sm'>
              Add a meeting room device to the fleet.
            </p>
          </div>
          <button
            type='button'
            aria-label='Close add device form'
            className='flex size-9 shrink-0 items-center justify-center rounded-lg text-text transition-colors hover:bg-background'
            onClick={closeDialog}
          >
            <X aria-hidden='true' size={20} />
          </button>
        </header>

        <form className='space-y-5 px-6 py-5' onSubmit={submitForm}>
          <div>
            <label
              htmlFor='device-name'
              className='mb-1.5 block text-sm font-semibold text-heading'
            >
              Name
            </label>
            <input
              id='device-name'
              className='block w-full rounded-lg border border-border px-3 py-2.5 text-sm text-heading outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'
              aria-invalid={Boolean(errors.name)}
              {...register('name', { required: 'Name is required.' })}
            />
            {errors.name && (
              <p className='mt-1 text-sm text-danger'>{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='device-model'
              className='mb-1.5 block text-sm font-semibold text-heading'
            >
              Model <span className='font-normal text-text'>(optional)</span>
            </label>
            <input
              id='device-model'
              className='block w-full rounded-lg border border-border px-3 py-2.5 text-sm text-heading outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'
              {...register('model')}
            />
          </div>

          <div>
            <label
              htmlFor='device-description'
              className='mb-1.5 block text-sm font-semibold text-heading'
            >
              Description
            </label>
            <textarea
              id='device-description'
              rows={3}
              className='block w-full resize-none rounded-lg border border-border px-3 py-2.5 text-sm text-heading outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'
              aria-invalid={Boolean(errors.description)}
              {...register('description', {
                required: 'Description is required.',
              })}
            />
            {errors.description && (
              <p className='mt-1 text-sm text-danger'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='device-status'
              className='mb-1.5 block text-sm font-semibold text-heading'
            >
              Status
            </label>
            <select
              id='device-status'
              className='block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-heading outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'
              {...register('status', { required: true })}
            >
              {deviceStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <footer className='-mx-6 -mb-5 flex flex-wrap justify-end gap-3 border-t border-border px-6 py-5 sm:items-center'>
            {isError && (
              <p
                className='w-full text-sm text-danger sm:mr-auto sm:w-auto'
                role='alert'
              >
                Unable to add device.
              </p>
            )}
            <button
              type='button'
              className='flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-heading transition-colors hover:bg-background sm:flex-none'
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isPending}
              className='flex-1 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none'
            >
              {isPending ? 'Adding…' : 'Add device'}
            </button>
          </footer>
        </form>
      </dialog>
    </>
  )
}

export default AddDeviceDialog
