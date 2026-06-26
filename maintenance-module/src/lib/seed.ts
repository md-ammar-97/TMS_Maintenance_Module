import type {
  MaintenanceType, MaintenancePlan, Carrier, Vehicle, Trailer,
  Vendor, Part, MaintenanceLog, MaintenanceBill, DueMaintenanceRecord, Inspection,
} from '@/types'

export const SEED_MAINTENANCE_TYPES: MaintenanceType[] = [
  { id: 'mt-1', name: 'Oil Change', description: 'Every 30,000–35,000 Miles', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-2', name: 'Truck Tires', description: 'Steers - Change Every 100,000 Miles', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-3', name: 'Engine Work', description: '', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-4', name: 'Trailer Work', description: '', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-5', name: 'Trailer Tires', description: '', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-6', name: 'Reefer Work', description: '', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-7', name: 'Truck Work', description: '', createdAt: '2026-01-01T00:00:00Z' },
]

export const SEED_PLANS: MaintenancePlan[] = [
  { id: 'mp-1', name: '30000 miles', maintenanceTypeId: 'mt-1', description: 'Oil change after every 30,000 miles', intervalType: 'Mileage', interval: 30000, validateUpcomingAtDispatch: false, validateDueAtDispatch: false, status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mp-2', name: 'Regular Maintenance', maintenanceTypeId: 'mt-7', description: 'Quarterly truck maintenance check', intervalType: 'Months', interval: 3, validateUpcomingAtDispatch: false, validateDueAtDispatch: false, status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mp-3', name: 'BIT INSPECTION', maintenanceTypeId: 'mt-3', description: 'Annual inspection compliance plan', intervalType: 'Months', interval: 12, validateUpcomingAtDispatch: true, validateDueAtDispatch: true, status: true, createdAt: '2026-01-01T00:00:00Z' },
]

export const SEED_CARRIERS: Carrier[] = [
  { id: 'c-1', name: 'YOLO TRANSPORT LLC' },
  { id: 'c-2', name: 'YOUNGS FREIGHTWAYS INC' },
  { id: 'c-3', name: '2G Express LLC' },
  { id: 'c-4', name: '2H Brothers Trucking Service Inc' },
  { id: 'c-5', name: '3 Tigers Transport Inc' },
  { id: 'c-6', name: '3D Carrier Inc' },
  { id: 'c-7', name: '4B States Carrier Inc' },
  { id: 'c-8', name: 'A & E Luna Tracking LLC' },
  { id: 'c-9', name: 'A & S Trucking' },
  { id: 'c-10', name: 'A&J TRUCKLINE INC' },
  { id: 'c-11', name: 'A&R Garcia Trucking, LLC.' },
  { id: 'c-12', name: 'AGAM HAULER INC' },
  { id: 'c-13', name: 'AGS Transport Inc' },
  { id: 'c-14', name: 'AIM TRANSPORT INC' },
  { id: 'c-15', name: 'AIRBOURNE LOGISTICS INC' },
  { id: 'c-16', name: 'YAJAT INC' },
  { id: 'c-17', name: 'Western Enterprises' },
  { id: 'c-18', name: 'Worldwide Express' },
  { id: 'c-19', name: 'ZEEZ TRANSPORTATION' },
  { id: 'c-20', name: 'Zee Trucking Inc' },
  { id: 'c-21', name: 'Zero 1 Transport Inc' },
]

export const SEED_VEHICLES: Vehicle[] = [
  { id: 'v-1', vehicleNumber: '100', carrierId: 'c-1', terminal: 'Chicago', currentMileage: 312400, status: 'Active' },
  { id: 'v-2', vehicleNumber: '137', carrierId: 'c-2', terminal: 'Dallas', currentMileage: 198700, status: 'Active' },
  { id: 'v-3', vehicleNumber: '139', carrierId: 'c-1', terminal: 'Chicago', currentMileage: 245100, status: 'Active' },
  { id: 'v-4', vehicleNumber: '143', carrierId: 'c-3', terminal: 'Houston', currentMileage: 87300, status: 'Active' },
  { id: 'v-5', vehicleNumber: '144', carrierId: 'c-3', terminal: 'Houston', currentMileage: 156200, status: 'Active' },
  { id: 'v-6', vehicleNumber: '160', carrierId: 'c-4', terminal: 'Atlanta', currentMileage: 210500, status: 'Active' },
  { id: 'v-7', vehicleNumber: '161', carrierId: 'c-4', terminal: 'Atlanta', currentMileage: 189000, status: 'InShop' },
  { id: 'v-8', vehicleNumber: '162', carrierId: 'c-5', terminal: 'Phoenix', currentMileage: 321000, status: 'Active' },
  { id: 'v-9', vehicleNumber: '163', carrierId: 'c-5', terminal: 'Phoenix', currentMileage: 267400, status: 'Active' },
  { id: 'v-10', vehicleNumber: '164', carrierId: 'c-6', terminal: 'Denver', currentMileage: 143600, status: 'Active' },
  { id: 'v-11', vehicleNumber: '107', carrierId: 'c-2', terminal: 'Dallas', currentMileage: 398000, status: 'Active' },
  { id: 'v-12', vehicleNumber: '109', carrierId: 'c-1', terminal: 'Chicago', currentMileage: 275500, status: 'Inactive' },
]

export const SEED_TRAILERS: Trailer[] = [
  { id: 't-1', trailerNumber: '3559', carrierId: 'c-1', terminal: 'Chicago', status: 'Active' },
  { id: 't-2', trailerNumber: '53100', carrierId: 'c-2', terminal: 'Dallas', status: 'Active' },
  { id: 't-3', trailerNumber: '53101', carrierId: 'c-2', terminal: 'Dallas', status: 'Active' },
  { id: 't-4', trailerNumber: '53102', carrierId: 'c-3', terminal: 'Houston', status: 'Active' },
  { id: 't-5', trailerNumber: '53103', carrierId: 'c-3', terminal: 'Houston', status: 'InShop' },
  { id: 't-6', trailerNumber: '5330', carrierId: 'c-4', terminal: 'Atlanta', status: 'Active' },
  { id: 't-7', trailerNumber: '5331', carrierId: 'c-4', terminal: 'Atlanta', status: 'Active' },
  { id: 't-8', trailerNumber: '5333', carrierId: 'c-5', terminal: 'Phoenix', status: 'Active' },
  { id: 't-9', trailerNumber: '5334', carrierId: 'c-6', terminal: 'Denver', status: 'Active' },
  { id: 't-10', trailerNumber: '5335', carrierId: 'c-6', terminal: 'Denver', status: 'Inactive' },
]

export const SEED_VENDORS: Vendor[] = [
  { id: 'vd-1', name: 'BVD', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-2', name: 'Comdata', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-3', name: 'QuikQ', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-4', name: 'Pre Pass', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-5', name: 'PilotFlyingJ', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-6', name: 'Best Pass', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-7', name: 'FleetOne', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-8', name: 'EFS', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-9', name: 'Downs Energy/CFN', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-10', name: 'TCS', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-11', name: 'I-Pass', status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'vd-12', name: 'Youngs Freightways INC', status: true, createdAt: '2026-01-01T00:00:00Z' },
]

export const SEED_PARTS: Part[] = [
  { id: 'p-1', name: 'Oil Filter', description: 'Standard oil filter for truck maintenance', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'p-2', name: 'Air Filter', description: 'Engine air filter replacement', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'p-3', name: 'Brake Pad Set', description: 'Front axle brake pad set', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'p-4', name: 'Reefer Belt', description: 'Replacement belt for reefer unit', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'p-5', name: 'Trailer Tire', description: 'Standard trailer tire replacement item', createdAt: '2026-01-01T00:00:00Z' },
]

export const SEED_LOGS: MaintenanceLog[] = [
  // Vehicle logs
  {
    id: 'log-v1', unitType: 'Vehicle', vehicleId: 'v-1',
    maintenanceTypeId: 'mt-1', maintenancePlanId: 'mp-1',
    vendorId: 'vd-1', mileage: 302000, serviceDate: '2026-04-15',
    currency: 'USD', amount: 250, description: 'Oil change with filter replacement',
    createdBy: 'demo', billRefNumber: 'BILL-V001', billId: 'bill-v1', createdAt: '2026-04-15T08:00:00Z',
  },
  {
    id: 'log-v2', unitType: 'Vehicle', vehicleId: 'v-2',
    maintenanceTypeId: 'mt-2', tirePosition: 'RS',
    vendorId: 'vd-5', mileage: 190000, serviceDate: '2026-05-20',
    currency: 'USD', amount: 1800, description: 'Steer tire replacement',
    createdBy: 'demo', billRefNumber: 'BILL-V002', billId: 'bill-v2', createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'log-v3', unitType: 'Vehicle', vehicleId: 'v-4',
    maintenanceTypeId: 'mt-7', maintenancePlanId: 'mp-2',
    vendorId: 'vd-8', mileage: 80000, serviceDate: '2026-06-01',
    currency: 'USD', amount: 450, description: 'Quarterly truck maintenance',
    createdBy: 'demo', billRefNumber: 'BILL-V003', billId: 'bill-v3', createdAt: '2026-06-01T09:00:00Z',
  },
  // Trailer logs
  {
    id: 'log-t1', unitType: 'Trailer', trailerId: 't-1',
    maintenanceTypeId: 'mt-4',
    vendorId: 'vd-1', serviceDate: '2026-05-10',
    currency: 'USD', amount: 600, description: 'Trailer brake adjustment and inspection',
    createdBy: 'demo', billRefNumber: 'BILL-T001', billId: 'bill-t1', createdAt: '2026-05-10T11:00:00Z',
  },
  {
    id: 'log-t2', unitType: 'Trailer', trailerId: 't-2',
    maintenanceTypeId: 'mt-5',
    vendorId: 'vd-7', serviceDate: '2026-06-05',
    currency: 'USD', amount: 2400, description: 'All trailer tires replaced',
    createdBy: 'demo', billRefNumber: 'BILL-T002', billId: 'bill-t2', createdAt: '2026-06-05T14:00:00Z',
  },
  {
    id: 'log-t3', unitType: 'Trailer', trailerId: 't-8',
    maintenanceTypeId: 'mt-6',
    vendorId: 'vd-10', serviceDate: '2026-06-15',
    currency: 'USD', amount: 800, description: 'Reefer belt replacement and diagnostic',
    createdBy: 'demo', billRefNumber: 'BILL-T003', billId: 'bill-t3', createdAt: '2026-06-15T08:30:00Z',
  },
]

export const SEED_BILLS: MaintenanceBill[] = [
  {
    id: 'bill-v1', billRefNumber: 'BILL-V001', unitType: 'Vehicle', vehicleId: 'v-1',
    vendorId: 'vd-1', carrierId: 'c-1', billDate: '2026-04-15', currency: 'USD',
    totalAmount: 250, paymentStatus: 'Paid', paymentMethod: 'EFS',
    workCompletedDate: '2026-04-15', mileage: 302000, location: 'Chicago, IL',
    description: 'Oil change service',
    logItems: [{ id: 'bli-v1-1', logType: 'Service', maintenanceTypeId: 'mt-1', maintenancePlanId: 'mp-1', amount: 250, description: 'Oil change with filter' }],
    linkedLogIds: ['log-v1'], createdAt: '2026-04-15T08:00:00Z',
  },
  {
    id: 'bill-v2', billRefNumber: 'BILL-V002', unitType: 'Vehicle', vehicleId: 'v-2',
    vendorId: 'vd-5', carrierId: 'c-2', billDate: '2026-05-20', currency: 'USD',
    totalAmount: 1800, paymentStatus: 'Paid', paymentMethod: 'ACH',
    workCompletedDate: '2026-05-20', mileage: 190000, location: 'Dallas, TX',
    description: 'Steer tire replacement',
    logItems: [{ id: 'bli-v2-1', logType: 'Part', partId: 'p-5', amount: 1800, description: 'Steer tires x2' }],
    linkedLogIds: ['log-v2'], createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'bill-v3', billRefNumber: 'BILL-V003', unitType: 'Vehicle', vehicleId: 'v-4',
    vendorId: 'vd-8', carrierId: 'c-3', billDate: '2026-06-01', currency: 'USD',
    totalAmount: 450, paymentStatus: 'Pending',
    mileage: 80000, location: 'Houston, TX',
    description: 'Quarterly maintenance',
    logItems: [{ id: 'bli-v3-1', logType: 'Service', maintenanceTypeId: 'mt-7', maintenancePlanId: 'mp-2', amount: 450, description: 'Quarterly check' }],
    linkedLogIds: ['log-v3'], createdAt: '2026-06-01T09:00:00Z',
  },
  {
    id: 'bill-t1', billRefNumber: 'BILL-T001', unitType: 'Trailer', trailerId: 't-1',
    vendorId: 'vd-1', carrierId: 'c-1', billDate: '2026-05-10', currency: 'USD',
    totalAmount: 600, paymentStatus: 'Paid', paymentMethod: 'Cash',
    workCompletedDate: '2026-05-10', location: 'Chicago, IL',
    description: 'Trailer brake work',
    logItems: [{ id: 'bli-t1-1', logType: 'Service', maintenanceTypeId: 'mt-4', amount: 600, description: 'Brake adjustment' }],
    linkedLogIds: ['log-t1'], createdAt: '2026-05-10T11:00:00Z',
  },
  {
    id: 'bill-t2', billRefNumber: 'BILL-T002', unitType: 'Trailer', trailerId: 't-2',
    vendorId: 'vd-7', carrierId: 'c-2', billDate: '2026-06-05', currency: 'USD',
    totalAmount: 2400, paymentStatus: 'Pending',
    location: 'Dallas, TX',
    description: 'Trailer tire replacement',
    logItems: [{ id: 'bli-t2-1', logType: 'Part', partId: 'p-5', amount: 2400, description: 'Trailer tires x8' }],
    linkedLogIds: ['log-t2'], createdAt: '2026-06-05T14:00:00Z',
  },
  {
    id: 'bill-t3', billRefNumber: 'BILL-T003', unitType: 'Trailer', trailerId: 't-8',
    vendorId: 'vd-10', carrierId: 'c-5', billDate: '2026-06-15', currency: 'USD',
    totalAmount: 800, paymentStatus: 'Pending',
    location: 'Phoenix, AZ',
    description: 'Reefer belt and diagnostic',
    logItems: [{ id: 'bli-t3-1', logType: 'Part', partId: 'p-4', amount: 800, description: 'Reefer belt replacement' }],
    linkedLogIds: ['log-t3'], createdAt: '2026-06-15T08:30:00Z',
  },
]

export const SEED_DUE_MAINTENANCE: DueMaintenanceRecord[] = [
  // OK (green) — plenty of miles/time left
  { id: 'due-1', maintenancePlanId: 'mp-1', unitType: 'Vehicle', vehicleId: 'v-1', lastServiceDate: '2026-04-15', lastServiceMileage: 302000, currentMileage: 312400, dueMileage: 332000, dueStatus: 'OK', dueIn: '+19,600 mi' },
  { id: 'due-2', maintenancePlanId: 'mp-1', unitType: 'Vehicle', vehicleId: 'v-2', lastServiceDate: '2026-05-20', lastServiceMileage: 190000, currentMileage: 198700, dueMileage: 220000, dueStatus: 'OK', dueIn: '+21,300 mi' },
  { id: 'due-3', maintenancePlanId: 'mp-1', unitType: 'Vehicle', vehicleId: 'v-3', lastServiceDate: '2026-01-10', lastServiceMileage: 218000, currentMileage: 245100, dueMileage: 248000, dueStatus: 'Upcoming', dueIn: '+2,900 mi' },
  // Upcoming (amber) — close to due
  { id: 'due-4', maintenancePlanId: 'mp-2', unitType: 'Vehicle', vehicleId: 'v-4', lastServiceDate: '2026-03-01', currentMileage: 87300, dueDate: '2026-06-01', dueStatus: 'Overdue', dueIn: '-25 days' },
  { id: 'due-5', maintenancePlanId: 'mp-1', unitType: 'Vehicle', vehicleId: 'v-5', lastServiceDate: '2026-04-01', lastServiceMileage: 126000, currentMileage: 156200, dueMileage: 156000, dueStatus: 'Overdue', dueIn: '-200 mi' },
  { id: 'due-6', maintenancePlanId: 'mp-3', unitType: 'Vehicle', vehicleId: 'v-6', lastServiceDate: '2025-06-01', currentMileage: 210500, dueDate: '2026-06-01', dueStatus: 'Overdue', dueIn: '-25 days' },
  { id: 'due-7', maintenancePlanId: 'mp-1', unitType: 'Vehicle', vehicleId: 'v-8', lastServiceDate: '2026-03-20', lastServiceMileage: 308000, currentMileage: 321000, dueMileage: 338000, dueStatus: 'Upcoming', dueIn: '+17,000 mi' },
  // Trailers
  { id: 'due-t1', maintenancePlanId: 'mp-2', unitType: 'Trailer', trailerId: 't-1', lastServiceDate: '2026-02-01', dueDate: '2026-05-01', dueStatus: 'Overdue', dueIn: '-56 days' },
  { id: 'due-t2', maintenancePlanId: 'mp-3', unitType: 'Trailer', trailerId: 't-2', lastServiceDate: '2025-07-01', dueDate: '2026-07-01', dueStatus: 'Upcoming', dueIn: '+5 days' },
  { id: 'due-t3', maintenancePlanId: 'mp-2', unitType: 'Trailer', trailerId: 't-3', lastServiceDate: '2026-04-01', dueDate: '2026-07-01', dueStatus: 'OK', dueIn: '+5 days' },
]

// Inspection seed — items all set to 'OK' for brevity
function makeItems(count: number): { itemNumber: number; description: string; result: 'OK' | 'NA' | 'Def' }[] {
  const descriptions = [
    'Fire extinguisher and reflective warning devices', 'Horn and gauges', 'Mirrors and supports',
    'Windshield wipers', 'All lights and signals', 'Electrical wiring',
    'Batteries', 'Warning devices', 'Radiator hoses', 'Belts',
    'Air hoses', 'Fuel system', 'Exhaust system', 'Engine mounting', 'Clutch adjustment',
    'Air filter', 'Starting system', 'Tractor protection valve', 'Hydraulic brake system', 'Hydraulic master cylinder',
    'Hoses and tubing', 'Air brake system', 'Air loss test', 'Air compressor', 'Primary air tank',
    'Other air tanks', 'Tires', 'Housing system', 'Parking brake', 'Emergency stopping',
    'Brakes release', 'Steering system', 'Steering arms', 'Connecting devices', 'Suspension system',
    'Frame and cross members', 'Drive shaft', 'Transmission', 'Wheel seals', 'Under carriage',
    'Mudflaps', 'Air brake system (trailer)',
  ]
  return Array.from({ length: count }, (_, i) => ({
    itemNumber: i + 1,
    description: descriptions[i] ?? `Item ${i + 1}`,
    result: i === 7 ? 'Def' : i === 14 ? 'NA' : 'OK',
  }))
}

export const SEED_INSPECTIONS: Inspection[] = [
  {
    id: 'insp-v1', unitType: 'Vehicle', vehicleId: 'v-1', carrierId: 'c-1',
    mileage: 308000, inspectionDate: '2026-01-15', inspectionBy: 'John Miller',
    items: makeItems(40), createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'insp-v2', unitType: 'Vehicle', vehicleId: 'v-1', carrierId: 'c-1',
    mileage: 312400, inspectionDate: '2026-06-20', inspectionBy: 'Sarah Lee',
    items: makeItems(40), createdAt: '2026-06-20T10:00:00Z',
  },
  {
    id: 'insp-v3', unitType: 'Vehicle', vehicleId: 'v-2', carrierId: 'c-2',
    mileage: 194000, inspectionDate: '2025-12-10', inspectionBy: 'David Brown',
    items: makeItems(40), createdAt: '2025-12-10T08:00:00Z',
  },
  {
    id: 'insp-v4', unitType: 'Vehicle', vehicleId: 'v-2', carrierId: 'c-2',
    mileage: 198700, inspectionDate: '2026-05-15', inspectionBy: 'Mike Johnson',
    items: makeItems(40), createdAt: '2026-05-15T11:00:00Z',
  },
  {
    id: 'insp-t1', unitType: 'Trailer', trailerId: 't-1', carrierId: 'c-1',
    inspectionDate: '2026-02-20', inspectionBy: 'John Miller',
    items: makeItems(21), createdAt: '2026-02-20T09:00:00Z',
  },
  {
    id: 'insp-t2', unitType: 'Trailer', trailerId: 't-1', carrierId: 'c-1',
    inspectionDate: '2026-06-10', inspectionBy: 'Sarah Lee',
    items: makeItems(21), createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'insp-t3', unitType: 'Trailer', trailerId: 't-2', carrierId: 'c-2',
    inspectionDate: '2026-03-05', inspectionBy: 'David Brown',
    items: makeItems(21), createdAt: '2026-03-05T08:00:00Z',
  },
  {
    id: 'insp-t4', unitType: 'Trailer', trailerId: 't-2', carrierId: 'c-2',
    inspectionDate: '2026-05-30', inspectionBy: 'Mike Johnson',
    items: makeItems(21), createdAt: '2026-05-30T11:00:00Z',
  },
]
