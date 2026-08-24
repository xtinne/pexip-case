# Pexip: Technical Case - Frontend Engineer

A company operates a fleet of meeting-room devices across its offices and currently has no single place to view them. Your task is to build that dashboard: a view of the status of every device, with the ability to manage the fleet from one screen. This is a frontend task, to be built in React and TypeScript, and scoped for four to six hours.

## Requirements

### Device List

- List each device and show name, model and status (online, in meeting, offline, deactivated).
- Filter the list by name. (optional)

### Device Management

- Add a device via a form with Name, Description and Status. Saving should update both the list and the summary counts.
- Remove a device from the list.

### Chart (optional, but a plus)

- Device status over time. Any library, any granularity.

## Data and API Guidelines

Two JSON files are attached so that you do not have to spend time on creating mock data:

- `devices.json`: 433 devices, with the same status counts shown in the reference design.
- `Status-history.json`: monthly status counts, for the chart.

These are provided for convenience and are not a schema. The data model is your decision: reshape, rename or discard whatever you like.

### Example API (Illustrative only)

```text
GET /api/devices → [{ id, name, model, description, status }]
POST /api/devices { name, description, status }
PATCH /api/devices/:id { name?, description?, status? }
DELETE /api/devices/:id
GET /api/devices/summary → { total, online, inMeeting, offline, deactivated }
GET /api/devices/history → [{ period, online, inMeeting, offline, deactivated }]
```

Deriving the summary on the client instead is a perfectly good call.
