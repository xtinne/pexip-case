import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDevice, deleteDevice, getDeviceHistory, getDevices } from '@/api'
import type { CreateDeviceInput, Device, DeviceStatus } from '@/types/device'

export type DeviceSummary = Record<DeviceStatus, number> & {
  total: number
}

export const devicesQueryKey = ['devices'] as const
export const deviceHistoryQueryKey = ['device-history'] as const

const useDevicesQuery = <TData = Device[]>(
  select?: (devices: Device[]) => TData,
) => {
  return useQuery({
    queryKey: devicesQueryKey,
    queryFn: getDevices,
    select,
  })
}

export const useDevices = () => useDevicesQuery()

const selectDeviceSummary = (devices: Device[]): DeviceSummary =>
  devices.reduce<DeviceSummary>(
    (summary, device) => ({
      ...summary,
      total: summary.total + 1,
      [device.status]: summary[device.status] + 1,
    }),
    {
      total: 0,
      online: 0,
      inMeeting: 0,
      offline: 0,
      deactivated: 0,
    },
  )

export const useDeviceSummary = () => useDevicesQuery(selectDeviceSummary)

export const useCreateDevice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDeviceInput) => createDevice(input),
    onSuccess: (device) => {
      queryClient.setQueryData<Device[]>(devicesQueryKey, (devices = []) => [
        device,
        ...devices,
      ])
    },
  })
}

export const useDeleteDevice = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (deviceId: string) => deleteDevice(deviceId),
    onSuccess: (_, deviceId) => {
      queryClient.setQueryData<Device[]>(devicesQueryKey, (devices = []) =>
        devices.filter(({ id }) => id !== deviceId),
      )
    },
  })
}

export const useDeviceHistory = () =>
  useQuery({
    queryKey: deviceHistoryQueryKey,
    queryFn: getDeviceHistory,
  })
