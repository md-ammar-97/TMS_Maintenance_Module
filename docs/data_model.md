# Data Model — Maintenance Module Frontend Prototype

All types are defined in TypeScript. No backend schema is required — these are in-memory / sessionStorage shapes.

---

## 1. SHARED ENUMERATIONS

```ts
type IntervalType = 'Days' | 'Months' | 'Mileage'

type Currency = 'USD' | 'CAD'

type PaymentStatus = 'Pending' | 'Paid'

type PaymentMethod = 'EFS' | 'ComCheck' | 'ACH' | 'Cash' | 'Card'

type MaintenanceLogType = 'Service' | 'Part'

type TirePosition =
  | 'LFI'   // Left Front Inside
  | 'LFO'   // Left Front Outside
  | 'RFI'   // Right Front Inside
  | 'RFO'   // Right Front Outside
  | 'LRI'   // Left Rear Inside
  | 'LRO'   // Left Rear Outside
  | 'RRI'   // Right Rear Inside
  | 'RRO'   // Right Rear Outside
  | 'RS'    // Right Steer
  | 'LS'    // Left Steer

type UnitType = 'Vehicle' | 'Trailer'

type DueStatus = 'OK' | 'Upcoming' | 'Overdue'

type InspectionItemResult = 'NA' | 'OK' | 'Def'

type VehicleStatus = 'Active' | 'Inactive' | 'InShop'
```

---

## 2. CORE ENTITIES

### 2.1 MaintenanceType

The master list of maintenance categories. Drives dropdowns across the entire app.

```ts
interface MaintenanceType {
  id: string           // uuid
  name: string         // e.g., "Oil Change", "Truck Tires"
  description: string  // e.g., "Every 30,000–35,000 Miles" (can be empty)
  createdAt: string    // ISO date string
}
```

**Seed data (7 records):**

| id | name | description |
|----|------|-------------|
| mt-1 | Oil Change | Every 30,000–35,000 Miles |
| mt-2 | Truck Tires | Steers - Change Every 100,000 Miles |
| mt-3 | Engine Work | |
| mt-4 | Trailer Work | |
| mt-5 | Trailer Tires | |
| mt-6 | Reefer Work | |
| mt-7 | Truck Work | |

---

### 2.2 MaintenancePlan

Defines a recurring maintenance schedule. Linked to a maintenance type.

```ts
interface MaintenancePlan {
  id: string
  name: string                          // e.g., "30000 miles"
  maintenanceTypeId: string             // → MaintenanceType.id
  description: string
  intervalType: IntervalType            // Days | Months | Mileage
  interval: number                      // e.g., 30000 (miles) or 3 (months)
  validateUpcomingAtDispatch: boolean
  validateDueAtDispatch: boolean
  status: boolean                       // true = active
  createdAt: string
}
```

**Seed data (3 records):**

| id | name | maintenanceTypeId | intervalType | interval | status |
|----|------|-------------------|--------------|----------|--------|
| mp-1 | 30000 miles | mt-1 (Oil Change) | Mileage | 30000 | true |
| mp-2 | Regular Maintenance | mt-7 (Truck Work) | Months | 3 | true |
| mp-3 | BIT INSPECTION | mt-3 (Engine Work) | Months | 12 | true |

---

### 2.3 Carrier

Read-only reference data. Used in Vehicles, Trailers, Logs, Bills, Due Maintenance, Inspection.

```ts
interface Carrier {
  id: string
  name: string   // e.g., "YOLO TRANSPORT LLC"
}
```

**Seed data (21 records):**

| id | name |
|----|------|
| c-1 | YOLO TRANSPORT LLC |
| c-2 | YOUNGS FREIGHTWAYS INC |
| c-3 | 2G Express LLC |
| c-4 | 2H Brothers Trucking Service Inc |
| c-5 | 3 Tigers Transport Inc |
| c-6 | 3D Carrier Inc |
| c-7 | 4B States Carrier Inc |
| c-8 | A & E Luna Tracking LLC |
| c-9 | A & S Trucking |
| c-10 | A&J TRUCKLINE INC |
| c-11 | A&R Garcia Trucking, LLC. |
| c-12 | AGAM HAULER INC |
| c-13 | AGS Transport Inc |
| c-14 | AIM TRANSPORT INC |
| c-15 | AIRBOURNE LOGISTICS INC |
| c-16 | YAJAT INC |
| c-17 | Western Enterprises |
| c-18 | Worldwide Express |
| c-19 | ZEEZ TRANSPORTATION |
| c-20 | Zee Trucking Inc |
| c-21 | Zero 1 Transport Inc |

---

### 2.4 Vehicle

```ts
interface Vehicle {
  id: string
  vehicleNumber: string   // e.g., "100", "137"
  carrierId: string       // → Carrier.id
  terminal: string        // e.g., "Chicago", "Dallas"
  currentMileage: number
  status: VehicleStatus
}
```

**Seed data (12 records):**

| vehicleNumber | carrierId | terminal | currentMileage | status |
|---------------|-----------|----------|----------------|--------|
| 100 | c-1 | Chicago | 312400 | Active |
| 137 | c-2 | Dallas | 198700 | Active |
| 139 | c-1 | Chicago | 245100 | Active |
| 143 | c-3 | Houston | 87300 | Active |
| 144 | c-3 | Houston | 156200 | Active |
| 160 | c-4 | Atlanta | 210500 | Active |
| 161 | c-4 | Atlanta | 189000 | InShop |
| 162 | c-5 | Phoenix | 321000 | Active |
| 163 | c-5 | Phoenix | 267400 | Active |
| 164 | c-6 | Denver | 143600 | Active |
| 107 | c-2 | Dallas | 398000 | Active |
| 109 | c-1 | Chicago | 275500 | Inactive |

---

### 2.5 Trailer

```ts
interface Trailer {
  id: string
  trailerNumber: string   // e.g., "3559", "53100"
  carrierId: string       // → Carrier.id
  terminal: string
  status: VehicleStatus
}
```

**Seed data (10 records):**

| trailerNumber | carrierId | terminal | status |
|---------------|-----------|----------|--------|
| 3559 | c-1 | Chicago | Active |
| 53100 | c-2 | Dallas | Active |
| 53101 | c-2 | Dallas | Active |
| 53102 | c-3 | Houston | Active |
| 53103 | c-3 | Houston | InShop |
| 5330 | c-4 | Atlanta | Active |
| 5331 | c-4 | Atlanta | Active |
| 5333 | c-5 | Phoenix | Active |
| 5334 | c-6 | Denver | Active |
| 5335 | c-6 | Denver | Inactive |

---

### 2.6 Vendor

```ts
interface Vendor {
  id: string
  name: string
  vendorId: string      // external vendor ID (optional)
  address: string
  address2: string
  city: string
  state: string
  zipCode: string
  phone: string
  fax: string
  email: string
  status: boolean       // true = active
  // Accounting
  accountingVendorId: string
  classId: string
  taxType: string       // "Not A 1099 Vendor" | "Dividend" | "Interest" | "Miscellaneous" | "Nonemployee Compensation"
  box1099: string
  createdAt: string
}
```

**Seed data (12 records):**

| id | name |
|----|------|
| v-1 | BVD |
| v-2 | Comdata |
| v-3 | QuikQ |
| v-4 | Pre Pass |
| v-5 | PilotFlyingJ |
| v-6 | Best Pass |
| v-7 | FleetOne |
| v-8 | EFS |
| v-9 | Downs Energy/CFN |
| v-10 | TCS |
| v-11 | I-Pass |
| v-12 | Youngs Freightways INC |

---

### 2.7 Part

```ts
interface Part {
  id: string
  name: string         // e.g., "Oil Filter"
  description: string  // e.g., "Standard oil filter for truck maintenance"
  createdAt: string
}
```

**Seed data (5 records):**

| id | name | description |
|----|------|-------------|
| p-1 | Oil Filter | Standard oil filter for truck maintenance |
| p-2 | Air Filter | Engine air filter replacement |
| p-3 | Brake Pad Set | Front axle brake pad set |
| p-4 | Reefer Belt | Replacement belt for reefer unit |
| p-5 | Trailer Tire | Standard trailer tire replacement item |

---

### 2.8 MaintenanceLog

Individual maintenance service event. Created from Logs page, Due Maintenance, or auto-created when a Bill is saved.

```ts
interface MaintenanceLog {
  id: string
  unitType: UnitType                  // 'Vehicle' | 'Trailer'
  vehicleId?: string                  // → Vehicle.id (if unitType = Vehicle)
  trailerId?: string                  // → Trailer.id (if unitType = Trailer)
  maintenanceTypeId: string           // → MaintenanceType.id
  externalMaintenanceType?: string    // free-text external label
  maintenancePlanId?: string          // → MaintenancePlan.id
  tirePosition?: TirePosition
  vendorId?: string                   // → Vendor.id
  mileage?: number
  serviceDate: string                 // ISO date string
  currency: Currency
  amount: number
  gst?: number
  hst?: number
  qst?: number
  description?: string
  createdBy: string                   // username / inspector name
  billRefNumber?: string              // linked bill ref if created from a bill
  billId?: string                     // → MaintenanceBill.id
  createdAt: string
}
```

---

### 2.9 MaintenanceBillLogItem

A single line item inside a Maintenance Bill. Each item generates a linked MaintenanceLog.

```ts
interface MaintenanceBillLogItem {
  id: string
  logType: MaintenanceLogType         // 'Service' | 'Part'
  maintenanceTypeId?: string          // required when logType = 'Service'
  partId?: string                     // required when logType = 'Part'
  maintenancePlanId?: string
  amount: number
  description?: string
}
```

---

### 2.10 MaintenanceBill

Invoice from a vendor for one or more maintenance services/parts.

```ts
interface MaintenanceBill {
  id: string
  billRefNumber: string               // required, user-entered, unique
  unitType: UnitType
  vehicleId?: string                  // → Vehicle.id
  trailerId?: string                  // → Trailer.id
  vendorId: string                    // → Vendor.id
  carrierId?: string                  // derived from vehicle/trailer
  billDate: string                    // ISO date string
  currency: Currency
  totalAmount: number                 // calculated: sum of logItems[].amount
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  workCompletedDate?: string
  mileage?: number                    // Vehicle only
  location?: string
  description?: string
  logItems: MaintenanceBillLogItem[]
  linkedLogIds: string[]              // → MaintenanceLog.id[] created on save
  createdAt: string
}
```

---

### 2.11 DueMaintenanceRecord

Tracks when a vehicle or trailer last had maintenance and when it is next due.

```ts
interface DueMaintenanceRecord {
  id: string
  maintenancePlanId: string           // → MaintenancePlan.id
  unitType: UnitType
  vehicleId?: string
  trailerId?: string
  lastServiceDate?: string            // ISO date
  lastServiceMileage?: number
  currentMileage?: number
  dueDate?: string                    // used when intervalType = Days/Months
  dueMileage?: number                 // used when intervalType = Mileage
  dueStatus: DueStatus                // 'OK' | 'Upcoming' | 'Overdue'
  dueIn: string                       // display string: "2,300 miles" or "14 days"
}
```

**Due status color logic:**

| dueStatus | Display color |
|-----------|--------------|
| OK | Green |
| Upcoming | Yellow/Orange |
| Overdue | Red |

---

### 2.12 InspectionItem

A single checklist item within an inspection.

```ts
interface InspectionItem {
  itemNumber: number
  description: string
  result: InspectionItemResult        // 'NA' | 'OK' | 'Def'
}
```

---

### 2.13 Inspection

A full inspection record for one vehicle or trailer unit.

```ts
interface Inspection {
  id: string
  unitType: UnitType
  vehicleId?: string
  trailerId?: string
  carrierId: string
  mileage?: number                    // required for Vehicle; hidden for Trailer
  inspectionDate: string              // ISO date string
  inspectionBy: string                // inspector name
  items: InspectionItem[]             // 40 items for Vehicle; 21 for Trailer
  createdAt: string
}
```

---

## 3. VEHICLE INSPECTION ITEMS (40)

```ts
export const VEHICLE_INSPECTION_ITEMS: Omit<InspectionItem, 'result'>[] = [
  { itemNumber: 1,  description: 'Fire extinguisher and reflective warning devices' },
  { itemNumber: 2,  description: 'Horn, defroster, gauges, odometer, and speedometer' },
  { itemNumber: 3,  description: 'Mirrors and supports' },
  { itemNumber: 4,  description: 'Windshield wipers, window cracks' },
  { itemNumber: 5,  description: 'All lights, signals, reflectors, mudflaps' },
  { itemNumber: 6,  description: 'Electrical wiring - condition and protection' },
  { itemNumber: 7,  description: 'Batteries - water level, terminals, and cables' },
  { itemNumber: 8,  description: 'Warning devices - air, oil, temperature, anti-skid, and/or vacuum' },
  { itemNumber: 9,  description: 'Radiator and water hoses - coolant level, condition, and/or leaks' },
  { itemNumber: 10, description: 'Belts - compressor, fan, water pump, and/or alternator' },
  { itemNumber: 11, description: 'Air hoses and tubing leaks, condition, and/or protection' },
  { itemNumber: 12, description: 'Fuel system - tank, hoses, tubing, and/or pump; leaks' },
  { itemNumber: 13, description: 'Exhaust system, manifolds, piping, muffler, leaks and/or condition' },
  { itemNumber: 14, description: 'Engine - mounting, excessive grease and/or oil' },
  { itemNumber: 15, description: 'Clutch adjustment - free play' },
  { itemNumber: 16, description: 'Air filter, throttle linkage' },
  { itemNumber: 17, description: 'Starting and charging system' },
  { itemNumber: 18, description: 'Tractor protection valve - NA' },
  { itemNumber: 19, description: 'Hydraulic brake system - adjustment, components, and/or condition' },
  { itemNumber: 20, description: 'Hydraulic master cylinder - level, leaks, and/or condition' },
  { itemNumber: 21, description: 'Hoses and tubing - condition and protection' },
  { itemNumber: 22, description: 'Air brake system - adjustment, components, and/or condition' },
  { itemNumber: 23, description: '1 minute air or vacuum loss test' },
  { itemNumber: 24, description: 'Air compressor governor cut-in and cut-out pressures (85-130)' },
  { itemNumber: 25, description: 'Primary air tank - drain and test check valve' },
  { itemNumber: 26, description: 'Other air tank - drain and check for contamination; securement' },
  { itemNumber: 27, description: 'Tires - tread depth, inflation, and condition' },
  { itemNumber: 28, description: 'Housing system - studs - cracks, looseness, and/or condition' },
  { itemNumber: 29, description: 'Parking brake - able to hold the vehicle' },
  { itemNumber: 30, description: 'Emergency stopping system - labeled and operative' },
  { itemNumber: 31, description: 'Brakes release after complete loss of service air' },
  { itemNumber: 32, description: 'Steering system - adjustment, components, and/or condition' },
  { itemNumber: 33, description: 'Steering arms, drag links, and/or tie rod ends' },
  { itemNumber: 34, description: 'Connecting devices - fifth wheel, pin(s), hitch, drawbar, eye and/or safety devices' },
  { itemNumber: 35, description: 'Suspension system - springs, shackles, u-bolts, and/or torque rods' },
  { itemNumber: 36, description: 'Frame and cross members - cracks and/or condition' },
  { itemNumber: 37, description: 'Drive shaft, universal joints, and/or guards' },
  { itemNumber: 38, description: 'Transmission and differential - mounting, leaks, and/or condition' },
  { itemNumber: 39, description: 'Wheel seals - leaks and/or condition' },
  { itemNumber: 40, description: 'Under carriage - clean and secure' },
]
```

---

## 4. TRAILER INSPECTION ITEMS (21)

```ts
export const TRAILER_INSPECTION_ITEMS: Omit<InspectionItem, 'result'>[] = [
  { itemNumber: 1,  description: 'All lights, signals, reflectors' },
  { itemNumber: 2,  description: 'Mudflaps' },
  { itemNumber: 3,  description: 'Air brake system' },
  { itemNumber: 4,  description: 'Air leaks - dump system' },
  { itemNumber: 5,  description: 'Frame, subframe, and body - cracks' },
  { itemNumber: 6,  description: 'Brake adjustment' },
  { itemNumber: 7,  description: 'Brake system, drums, and components - condition' },
  { itemNumber: 8,  description: 'Suspension system - springs, shackles, u-bolts, and/or torque rods' },
  { itemNumber: 9,  description: 'Connecting device - drawbar, drawbar, eye and/or safety devices' },
  { itemNumber: 10, description: 'Fifth wheel on pull trailer' },
  { itemNumber: 11, description: 'Air hoses and tubing - leaks, condition, and/or protection' },
  { itemNumber: 12, description: 'Tires - tread depth, inflation, and condition' },
  { itemNumber: 13, description: 'Wheels, lug nuts, and studs - cracks, looseness, and/or condition' },
  { itemNumber: 14, description: 'Hoses and tubing - condition, protection' },
  { itemNumber: 15, description: 'Hydraulic Master cylinder - level, leaks, and/or condition' },
  { itemNumber: 16, description: 'Parking brake - able to hold the vehicle' },
  { itemNumber: 17, description: 'Emergency breakaway brake system' },
  { itemNumber: 18, description: 'Air relay valves and tank - mounting' },
  { itemNumber: 19, description: 'Brakes release after complete loss of service air' },
  { itemNumber: 20, description: 'Wheel seals - leaks and/or condition' },
  { itemNumber: 21, description: 'Under carriage - clean and secure' },
]
```

---

## 5. ENTITY RELATIONSHIPS

```
Carrier ──────────────────┬─── Vehicle (carrierId)
                          └─── Trailer (carrierId)

MaintenanceType ──────────┬─── MaintenancePlan (maintenanceTypeId)
                          ├─── MaintenanceLog (maintenanceTypeId)
                          └─── MaintenanceBillLogItem (maintenanceTypeId)

MaintenancePlan ──────────┬─── MaintenanceLog (maintenancePlanId)
                          ├─── MaintenanceBillLogItem (maintenancePlanId)
                          └─── DueMaintenanceRecord (maintenancePlanId)

Vendor ────────────────────── MaintenanceLog (vendorId)
                          └─── MaintenanceBill (vendorId)

Vehicle ───────────────────── MaintenanceLog (vehicleId, when unitType=Vehicle)
                          ├─── MaintenanceBill (vehicleId, when unitType=Vehicle)
                          ├─── DueMaintenanceRecord (vehicleId)
                          └─── Inspection (vehicleId)

Trailer ───────────────────── MaintenanceLog (trailerId, when unitType=Trailer)
                          ├─── MaintenanceBill (trailerId, when unitType=Trailer)
                          ├─── DueMaintenanceRecord (trailerId)
                          └─── Inspection (trailerId)

Part ──────────────────────── MaintenanceBillLogItem (partId, when logType=Part)

MaintenanceBill ──────────┬─── MaintenanceBillLogItem[] (logItems)
                          └─── MaintenanceLog[] (linkedLogIds — created on bill save)
```

---

## 6. SESSIONSTORAGE KEYS

| Key | Value |
|-----|-------|
| `__seeded` | `"true"` — flag to prevent re-seeding on page refresh |
| `maintenanceTypes` | `JSON.stringify(MaintenanceType[])` |
| `maintenancePlans` | `JSON.stringify(MaintenancePlan[])` |
| `carriers` | `JSON.stringify(Carrier[])` |
| `vehicles` | `JSON.stringify(Vehicle[])` |
| `trailers` | `JSON.stringify(Trailer[])` |
| `vendors` | `JSON.stringify(Vendor[])` |
| `parts` | `JSON.stringify(Part[])` |
| `maintenanceLogs` | `JSON.stringify(MaintenanceLog[])` |
| `maintenanceBills` | `JSON.stringify(MaintenanceBill[])` |
| `dueMaintenance` | `JSON.stringify(DueMaintenanceRecord[])` |
| `inspections` | `JSON.stringify(Inspection[])` |

---

## 7. ID GENERATION

All new records created during a session use `crypto.randomUUID()` (available in all modern browsers) for their `id` field. Seeded records use stable string IDs (`mt-1`, `mp-2`, etc.) for easy cross-reference.

```ts
const newRecord = {
  id: crypto.randomUUID(),
  // ...fields
  createdAt: new Date().toISOString(),
}
```
