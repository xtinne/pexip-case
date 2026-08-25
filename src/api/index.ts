import devicesData from '@/data/devices.json'
import statusHistoryData from '@/data/status-history.json'
import type {
  CreateDeviceInput,
  Device,
  DeviceHistoryEntry,
} from '@/types/device'

const DEFAULT_DELAY = 300

const delay = (milliseconds = DEFAULT_DELAY): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

let devices = devicesData as Device[]
let nextId = devices.length + 1

export const getDevices = async (): Promise<Device[]> => {
  await delay()

  return devices
}

export const createDevice = async (
  input: CreateDeviceInput,
): Promise<Device> => {
  await delay()

  const device: Device = {
    ...input,
    id: `dev-${String(nextId++).padStart(3, '0')}`,
    model: input.model?.trim() || 'Not specified',
  }

  devices = [device, ...devices]

  return device
}

export const deleteDevice = async (deviceId: string): Promise<void> => {
  await delay()

  devices = devices.filter(({ id }) => id !== deviceId)
}

export const getDeviceHistory = async (): Promise<DeviceHistoryEntry[]> => {
  await delay()

  return statusHistoryData
}
