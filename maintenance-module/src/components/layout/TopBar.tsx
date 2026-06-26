import { Search, Sun, ChevronDown } from 'lucide-react'

export function TopBar() {
  return (
    <header className="h-[52px] flex-shrink-0 bg-white border-b border-gray-200 flex items-center px-6 justify-between z-10">
      {/* Logo */}
      <div>
        <div className="text-base font-bold text-gray-900 tracking-widest">AXESTRACK</div>
        <div className="text-[9px] text-gray-400 -mt-0.5">Right Information, Great Decisions</div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
          <Search size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
          <Sun size={16} />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            D
          </div>
          <div>
            <div className="text-[12px] font-semibold text-gray-900 leading-tight">demo</div>
            <div className="text-[10px] text-gray-400 leading-tight">Member</div>
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </div>
      </div>
    </header>
  )
}
