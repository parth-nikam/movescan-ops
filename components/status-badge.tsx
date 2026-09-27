import { ScanStatus,statusTone } from "@/lib/scans";
export function StatusBadge({status}:{status:ScanStatus}){return <span className={`status-badge ${statusTone[status]}`}><span className="status-dot"/>{status}</span>}
