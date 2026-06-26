export type IntervalType = 'Days' | 'Months' | 'Mileage'
export type Currency = 'USD' | 'CAD'
export type PaymentStatus = 'Pending' | 'Paid'
export type PaymentMethod = 'EFS' | 'ComCheck' | 'ACH' | 'Cash' | 'Card'
export type MaintenanceLogType = 'Service' | 'Part'
export type TirePosition = 'LFI' | 'LFO' | 'RFI' | 'RFO' | 'LRI' | 'LRO' | 'RRI' | 'RRO' | 'RS' | 'LS'
export type UnitType = 'Vehicle' | 'Trailer'
export type DueStatus = 'OK' | 'Upcoming' | 'Overdue'
export type InspectionItemResult = 'NA' | 'OK' | 'Def'
export type VehicleStatus = 'Active' | 'Inactive' | 'InShop'

export interface MaintenanceType {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface MaintenancePlan {
  id: string
  name: string
  maintenanceTypeId: string
  description: string
  intervalType: IntervalType
  interval: number
  validateUpcomingAtDispatch: boolean
  validateDueAtDispatch: boolean
  status: boolean
  createdAt: string
}

export interface Carrier {
  id: string
  name: string
}

export interface Vehicle {
  id: string
  vehicleNumber: string
  carrierId: string
  terminal: string
  currentMileage: number
  status: VehicleStatus
}

export interface Trailer {
  id: string
  trailerNumber: string
  carrierId: string
  terminal: string
  status: VehicleStatus
}

export interface Vendor {
  id: string
  name: string
  vendorId?: string
  address?: string
  address2?: string
  city?: string
  state?: string
  zipCode?: string
  phone?: string
  fax?: string
  email?: string
  status: boolean
  accountingVendorId?: string
  classId?: string
  taxType?: string
  box1099?: string
  createdAt: string
}

export interface Part {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface MaintenanceLog {
  id: string
  unitType: UnitType
  vehicleId?: string
  trailerId?: string
  maintenanceTypeId: string
  externalMaintenanceType?: string
  maintenancePlanId?: string
  tirePosition?: TirePosition
  vendorId?: string
  mileage?: number
  serviceDate: string
  currency: Currency
  amount: number
  gst?: number
  hst?: number
  qst?: number
  description?: string
  createdBy: string
  billRefNumber?: string
  billId?: string
  createdAt: string
}

export interface MaintenanceBillLogItem {
  id: string
  logType: MaintenanceLogType
  maintenanceTypeId?: string
  partId?: string
  maintenancePlanId?: string
  amount: number
  description?: string
}

export interface MaintenanceBill {
  id: string
  billRefNumber: string
  unitType: UnitType
  vehicleId?: string
  trailerId?: string
  vendorId: string
  carrierId?: string
  billDate: string
  currency: Currency
  totalAmount: number
  paymentStatus: PaymentStatus
  paymentMethod?: PaymentMethod
  workCompletedDate?: string
  mileage?: number
  location?: string
  description?: string
  logItems: MaintenanceBillLogItem[]
  linkedLogIds: string[]
  createdAt: string
}

export interface DueMaintenanceRecord {
  id: string
  maintenancePlanId: string
  unitType: UnitType
  vehicleId?: string
  trailerId?: string
  lastServiceDate?: string
  lastServiceMileage?: number
  currentMileage?: number
  dueDate?: string
  dueMileage?: number
  dueStatus: DueStatus
  dueIn: string
}

export interface InspectionItem {
  itemNumber: number
  description: string
  result: InspectionItemResult
}

export interface Inspection {
  id: string
  unitType: UnitType
  vehicleId?: string
  trailerId?: string
  carrierId: string
  mileage?: number
  inspectionDate: string
  inspectionBy: string
  items: InspectionItem[]
  createdAt: string
}

export const INSPECTORS = ['John Miller', 'Sarah Lee', 'David Brown', 'Mike Johnson'] as const

export const VEHICLE_INSPECTION_ITEMS: Omit<InspectionItem, 'result'>[] = [
  { itemNumber: 1, description: 'Fire extinguisher and reflective warning devices' },
  { itemNumber: 2, description: 'Horn, defroster, gauges, odometer, and speedometer' },
  { itemNumber: 3, description: 'Mirrors and supports' },
  { itemNumber: 4, description: 'Windshield wipers, window cracks' },
  { itemNumber: 5, description: 'All lights, signals, reflectors, mudflaps' },
  { itemNumber: 6, description: 'Electrical wiring - condition and protection' },
  { itemNumber: 7, description: 'Batteries - water level, terminals, and cables' },
  { itemNumber: 8, description: 'Warning devices - air, oil, temperature, anti-skid, and/or vacuum' },
  { itemNumber: 9, description: 'Radiator and water hoses - coolant level, condition, and/or leaks' },
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

export const TRAILER_INSPECTION_ITEMS: Omit<InspectionItem, 'result'>[] = [
  { itemNumber: 1, description: 'All lights, signals, reflectors' },
  { itemNumber: 2, description: 'Mudflaps' },
  { itemNumber: 3, description: 'Air brake system' },
  { itemNumber: 4, description: 'Air leaks - dump system' },
  { itemNumber: 5, description: 'Frame, subframe, and body - cracks' },
  { itemNumber: 6, description: 'Brake adjustment' },
  { itemNumber: 7, description: 'Brake system, drums, and components - condition' },
  { itemNumber: 8, description: 'Suspension system - springs, shackles, u-bolts, and/or torque rods' },
  { itemNumber: 9, description: 'Connecting device - drawbar, drawbar, eye and/or safety devices' },
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
