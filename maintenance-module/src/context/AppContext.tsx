'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getSessionData, setSessionData, isSeeded, markSeeded } from '@/lib/session'
import {
  SEED_MAINTENANCE_TYPES, SEED_PLANS, SEED_CARRIERS, SEED_VEHICLES,
  SEED_TRAILERS, SEED_VENDORS, SEED_PARTS, SEED_LOGS, SEED_BILLS,
  SEED_DUE_MAINTENANCE, SEED_INSPECTIONS,
} from '@/lib/seed'
import { generateId } from '@/lib/utils'
import type {
  MaintenanceType, MaintenancePlan, Carrier, Vehicle, Trailer,
  Vendor, Part, MaintenanceLog, MaintenanceBill, DueMaintenanceRecord, Inspection,
} from '@/types'

interface AppContextValue {
  // Data
  maintenanceTypes: MaintenanceType[]
  maintenancePlans: MaintenancePlan[]
  carriers: Carrier[]
  vehicles: Vehicle[]
  trailers: Trailer[]
  vendors: Vendor[]
  parts: Part[]
  maintenanceLogs: MaintenanceLog[]
  maintenanceBills: MaintenanceBill[]
  dueMaintenance: DueMaintenanceRecord[]
  inspections: Inspection[]

  // MaintenanceType
  addMaintenanceType: (item: Omit<MaintenanceType, 'id' | 'createdAt'>) => MaintenanceType
  updateMaintenanceType: (id: string, updates: Partial<MaintenanceType>) => void
  deleteMaintenanceType: (id: string) => void

  // MaintenancePlan
  addMaintenancePlan: (item: Omit<MaintenancePlan, 'id' | 'createdAt'>) => MaintenancePlan
  updateMaintenancePlan: (id: string, updates: Partial<MaintenancePlan>) => void
  deleteMaintenancePlan: (id: string) => void

  // Vendor
  addVendor: (item: Omit<Vendor, 'id' | 'createdAt'>) => Vendor
  updateVendor: (id: string, updates: Partial<Vendor>) => void
  deleteVendor: (id: string) => void

  // Part
  addPart: (item: Omit<Part, 'id' | 'createdAt'>) => Part
  updatePart: (id: string, updates: Partial<Part>) => void
  deletePart: (id: string) => void

  // MaintenanceLog
  addLog: (item: Omit<MaintenanceLog, 'id' | 'createdAt'>) => MaintenanceLog
  updateLog: (id: string, updates: Partial<MaintenanceLog>) => void
  deleteLog: (id: string) => void

  // MaintenanceBill
  addBill: (item: Omit<MaintenanceBill, 'id' | 'createdAt'>) => MaintenanceBill
  updateBill: (id: string, updates: Partial<MaintenanceBill>) => void
  deleteBill: (id: string) => void

  // DueMaintenance
  updateDueMaintenance: (id: string, updates: Partial<DueMaintenanceRecord>) => void

  // Inspection
  addInspection: (item: Omit<Inspection, 'id' | 'createdAt'>) => Inspection
  updateInspection: (id: string, updates: Partial<Inspection>) => void
  deleteInspection: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>([])
  const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>([])
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [trailers, setTrailers] = useState<Trailer[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [parts, setParts] = useState<Part[]>([])
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([])
  const [maintenanceBills, setMaintenanceBills] = useState<MaintenanceBill[]>([])
  const [dueMaintenance, setDueMaintenance] = useState<DueMaintenanceRecord[]>([])
  const [inspections, setInspections] = useState<Inspection[]>([])

  useEffect(() => {
    if (isSeeded()) {
      setMaintenanceTypes(getSessionData('maintenanceTypes', SEED_MAINTENANCE_TYPES))
      setMaintenancePlans(getSessionData('maintenancePlans', SEED_PLANS))
      setCarriers(getSessionData('carriers', SEED_CARRIERS))
      setVehicles(getSessionData('vehicles', SEED_VEHICLES))
      setTrailers(getSessionData('trailers', SEED_TRAILERS))
      setVendors(getSessionData('vendors', SEED_VENDORS))
      setParts(getSessionData('parts', SEED_PARTS))
      setMaintenanceLogs(getSessionData('maintenanceLogs', SEED_LOGS))
      setMaintenanceBills(getSessionData('maintenanceBills', SEED_BILLS))
      setDueMaintenance(getSessionData('dueMaintenance', SEED_DUE_MAINTENANCE))
      setInspections(getSessionData('inspections', SEED_INSPECTIONS))
    } else {
      setMaintenanceTypes(SEED_MAINTENANCE_TYPES)
      setMaintenancePlans(SEED_PLANS)
      setCarriers(SEED_CARRIERS)
      setVehicles(SEED_VEHICLES)
      setTrailers(SEED_TRAILERS)
      setVendors(SEED_VENDORS)
      setParts(SEED_PARTS)
      setMaintenanceLogs(SEED_LOGS)
      setMaintenanceBills(SEED_BILLS)
      setDueMaintenance(SEED_DUE_MAINTENANCE)
      setInspections(SEED_INSPECTIONS)
      setSessionData('maintenanceTypes', SEED_MAINTENANCE_TYPES)
      setSessionData('maintenancePlans', SEED_PLANS)
      setSessionData('carriers', SEED_CARRIERS)
      setSessionData('vehicles', SEED_VEHICLES)
      setSessionData('trailers', SEED_TRAILERS)
      setSessionData('vendors', SEED_VENDORS)
      setSessionData('parts', SEED_PARTS)
      setSessionData('maintenanceLogs', SEED_LOGS)
      setSessionData('maintenanceBills', SEED_BILLS)
      setSessionData('dueMaintenance', SEED_DUE_MAINTENANCE)
      setSessionData('inspections', SEED_INSPECTIONS)
      markSeeded()
    }
  }, [])

  // -- helpers --
  function save<T>(key: string, setter: (v: T[]) => void, next: T[]) {
    setter(next)
    setSessionData(key, next)
  }

  // MaintenanceType
  const addMaintenanceType = useCallback((item: Omit<MaintenanceType, 'id' | 'createdAt'>): MaintenanceType => {
    const newItem: MaintenanceType = { ...item, id: generateId(), createdAt: new Date().toISOString() }
    setMaintenanceTypes(prev => { const next = [...prev, newItem]; setSessionData('maintenanceTypes', next); return next })
    return newItem
  }, [])
  const updateMaintenanceType = useCallback((id: string, updates: Partial<MaintenanceType>) => {
    setMaintenanceTypes(prev => { const next = prev.map(x => x.id === id ? { ...x, ...updates } : x); setSessionData('maintenanceTypes', next); return next })
  }, [])
  const deleteMaintenanceType = useCallback((id: string) => {
    setMaintenanceTypes(prev => { const next = prev.filter(x => x.id !== id); setSessionData('maintenanceTypes', next); return next })
  }, [])

  // MaintenancePlan
  const addMaintenancePlan = useCallback((item: Omit<MaintenancePlan, 'id' | 'createdAt'>): MaintenancePlan => {
    const newItem: MaintenancePlan = { ...item, id: generateId(), createdAt: new Date().toISOString() }
    setMaintenancePlans(prev => { const next = [...prev, newItem]; setSessionData('maintenancePlans', next); return next })
    return newItem
  }, [])
  const updateMaintenancePlan = useCallback((id: string, updates: Partial<MaintenancePlan>) => {
    setMaintenancePlans(prev => { const next = prev.map(x => x.id === id ? { ...x, ...updates } : x); setSessionData('maintenancePlans', next); return next })
  }, [])
  const deleteMaintenancePlan = useCallback((id: string) => {
    setMaintenancePlans(prev => { const next = prev.filter(x => x.id !== id); setSessionData('maintenancePlans', next); return next })
  }, [])

  // Vendor
  const addVendor = useCallback((item: Omit<Vendor, 'id' | 'createdAt'>): Vendor => {
    const newItem: Vendor = { ...item, id: generateId(), createdAt: new Date().toISOString() }
    setVendors(prev => { const next = [...prev, newItem]; setSessionData('vendors', next); return next })
    return newItem
  }, [])
  const updateVendor = useCallback((id: string, updates: Partial<Vendor>) => {
    setVendors(prev => { const next = prev.map(x => x.id === id ? { ...x, ...updates } : x); setSessionData('vendors', next); return next })
  }, [])
  const deleteVendor = useCallback((id: string) => {
    setVendors(prev => { const next = prev.filter(x => x.id !== id); setSessionData('vendors', next); return next })
  }, [])

  // Part
  const addPart = useCallback((item: Omit<Part, 'id' | 'createdAt'>): Part => {
    const newItem: Part = { ...item, id: generateId(), createdAt: new Date().toISOString() }
    setParts(prev => { const next = [...prev, newItem]; setSessionData('parts', next); return next })
    return newItem
  }, [])
  const updatePart = useCallback((id: string, updates: Partial<Part>) => {
    setParts(prev => { const next = prev.map(x => x.id === id ? { ...x, ...updates } : x); setSessionData('parts', next); return next })
  }, [])
  const deletePart = useCallback((id: string) => {
    setParts(prev => { const next = prev.filter(x => x.id !== id); setSessionData('parts', next); return next })
  }, [])

  // Log
  const addLog = useCallback((item: Omit<MaintenanceLog, 'id' | 'createdAt'>): MaintenanceLog => {
    const newItem: MaintenanceLog = { ...item, id: generateId(), createdAt: new Date().toISOString() }
    setMaintenanceLogs(prev => { const next = [...prev, newItem]; setSessionData('maintenanceLogs', next); return next })
    return newItem
  }, [])
  const updateLog = useCallback((id: string, updates: Partial<MaintenanceLog>) => {
    setMaintenanceLogs(prev => { const next = prev.map(x => x.id === id ? { ...x, ...updates } : x); setSessionData('maintenanceLogs', next); return next })
  }, [])
  const deleteLog = useCallback((id: string) => {
    setMaintenanceLogs(prev => { const next = prev.filter(x => x.id !== id); setSessionData('maintenanceLogs', next); return next })
  }, [])

  // Bill
  const addBill = useCallback((item: Omit<MaintenanceBill, 'id' | 'createdAt'>): MaintenanceBill => {
    const newItem: MaintenanceBill = { ...item, id: generateId(), createdAt: new Date().toISOString() }
    setMaintenanceBills(prev => { const next = [...prev, newItem]; setSessionData('maintenanceBills', next); return next })
    return newItem
  }, [])
  const updateBill = useCallback((id: string, updates: Partial<MaintenanceBill>) => {
    setMaintenanceBills(prev => { const next = prev.map(x => x.id === id ? { ...x, ...updates } : x); setSessionData('maintenanceBills', next); return next })
  }, [])
  const deleteBill = useCallback((id: string) => {
    setMaintenanceBills(prev => { const next = prev.filter(x => x.id !== id); setSessionData('maintenanceBills', next); return next })
  }, [])

  // DueMaintenance
  const updateDueMaintenance = useCallback((id: string, updates: Partial<DueMaintenanceRecord>) => {
    setDueMaintenance(prev => { const next = prev.map(x => x.id === id ? { ...x, ...updates } : x); setSessionData('dueMaintenance', next); return next })
  }, [])

  // Inspection
  const addInspection = useCallback((item: Omit<Inspection, 'id' | 'createdAt'>): Inspection => {
    const newItem: Inspection = { ...item, id: generateId(), createdAt: new Date().toISOString() }
    setInspections(prev => { const next = [...prev, newItem]; setSessionData('inspections', next); return next })
    return newItem
  }, [])
  const updateInspection = useCallback((id: string, updates: Partial<Inspection>) => {
    setInspections(prev => { const next = prev.map(x => x.id === id ? { ...x, ...updates } : x); setSessionData('inspections', next); return next })
  }, [])
  const deleteInspection = useCallback((id: string) => {
    setInspections(prev => { const next = prev.filter(x => x.id !== id); setSessionData('inspections', next); return next })
  }, [])

  // suppress lint warning for save helper
  void save

  return (
    <AppContext.Provider value={{
      maintenanceTypes, maintenancePlans, carriers, vehicles, trailers,
      vendors, parts, maintenanceLogs, maintenanceBills, dueMaintenance, inspections,
      addMaintenanceType, updateMaintenanceType, deleteMaintenanceType,
      addMaintenancePlan, updateMaintenancePlan, deleteMaintenancePlan,
      addVendor, updateVendor, deleteVendor,
      addPart, updatePart, deletePart,
      addLog, updateLog, deleteLog,
      addBill, updateBill, deleteBill,
      updateDueMaintenance,
      addInspection, updateInspection, deleteInspection,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
