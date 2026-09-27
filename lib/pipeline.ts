export const ALLOWED_VIDEO_TYPES=["video/mp4","video/quicktime"] as const;
export const MAX_UPLOAD_BYTES=750*1024*1024;
export const MIN_PART_BYTES=5*1024*1024;
export const DEFAULT_PART_BYTES=16*1024*1024;
export type PipelineStatus="CAPTURED"|"COMPRESSING"|"READY"|"UPLOADING"|"UPLOADED"|"PROCESSING"|"COMPLETE"|"FAILED"|"CANCELLED";

export function compressionPlan(input:{width:number;height:number;durationSeconds:number}){
  const height=Math.min(input.height,720);const width=Math.round((input.width*(height/input.height))/2)*2;
  return {width,height,videoCodec:"libx264",crf:23,preset:"medium",audioCodec:"aac",audioBitrateKbps:96,command:`-vf scale=${width}:${height} -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 96k -movflags +faststart`};
}
export function multipartPlan(sizeBytes:number,partBytes=DEFAULT_PART_BYTES){if(sizeBytes<=0||sizeBytes>MAX_UPLOAD_BYTES)throw new Error("INVALID_FILE_SIZE");const safe=Math.max(partBytes,MIN_PART_BYTES);const partCount=Math.ceil(sizeBytes/safe);return {partSize:safe,partCount,parts:Array.from({length:partCount},(_,i)=>({partNumber:i+1,start:i*safe,endExclusive:Math.min((i+1)*safe,sizeBytes)}))};}
export function validateCompletedParts(expected:number,parts:{partNumber:number;etag:string}[]){if(parts.length!==expected)return false;const numbers=new Set(parts.map(p=>p.partNumber));return numbers.size===expected&&parts.every(p=>p.etag.length>0&&p.partNumber>=1&&p.partNumber<=expected);}
const transitions:Record<PipelineStatus,PipelineStatus[]>={CAPTURED:["COMPRESSING","CANCELLED"],COMPRESSING:["READY","FAILED","CANCELLED"],READY:["UPLOADING","CANCELLED"],UPLOADING:["UPLOADED","FAILED","CANCELLED"],UPLOADED:["PROCESSING"],PROCESSING:["COMPLETE","FAILED"],COMPLETE:[],FAILED:["UPLOADING","PROCESSING","CANCELLED"],CANCELLED:["UPLOADING"]};
export function canTransition(from:PipelineStatus,to:PipelineStatus){return transitions[from].includes(to)}
