import {scans} from "@/lib/scans";
type Upload={uploadId:string;key:string;partCount:number;status:"OPEN"|"COMPLETED"|"CANCELLED";parts:Map<number,string>};
const state=globalThis as unknown as {__moveScanUploads?:Map<string,Upload>};
export const uploads=state.__moveScanUploads??(state.__moveScanUploads=new Map());
export function apiScans(){return scans.map(s=>({...s,processingStatus:s.status.toUpperCase()}))}
