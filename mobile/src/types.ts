export type LocalVideo={uri:string;filename:string;durationMs:number;width:number;height:number;sizeBytes:number;thumbnailUri?:string};
export type ProcessedVideo=LocalVideo&{sourceUri:string;sourceSizeBytes:number;compressionMs:number;reductionPercent:number};
export type UploadPart={partNumber:number;start:number;endExclusive:number;etag?:string;attempts:number;status:"pending"|"uploading"|"complete"|"failed"};
export type UploadState={uploadId:string;key:string;progress:number;speedBps:number;parts:UploadPart[];status:"uploading"|"paused"|"failed"|"complete"|"cancelled";error?:string};
