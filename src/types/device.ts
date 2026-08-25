export const deviceStatusLabels = {
  online: 'Online',
  inMeeting: 'In meeting',
  offline: 'Offline',
  deactivated: 'Deactivated',
} as const

export type DeviceStatus = keyof typeof deviceStatusLabels

export const deviceStatuses = Object.entries(deviceStatusLabels).map(
  ([value, label]) => ({ value: value as DeviceStatus, label }),
)

export type Device = {
  id: string
  name: string
  model: string
  description: string
  status: DeviceStatus
}

export type CreateDeviceInput = Omit<Device, 'id' | 'model'> & {
  model?: string
}

export type DeviceHistoryEntry = Record<DeviceStatus, number> & {
  period: string
}
