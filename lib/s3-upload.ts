import {CreateMultipartUploadCommand,UploadPartCommand,CompleteMultipartUploadCommand,AbortMultipartUploadCommand,S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
const client=new S3Client({region:process.env.AWS_REGION??"us-east-1"});
export const isDemoMode=()=>process.env.DEMO_MODE!=="false";
export async function createRealMultipart(key:string,contentType:string,partCount:number){const Bucket=required("S3_BUCKET");const started=await client.send(new CreateMultipartUploadCommand({Bucket,Key:key,ContentType:contentType,Metadata:{source:"movescan-mobile"}}));if(!started.UploadId)throw new Error("S3_UPLOAD_ID_MISSING");const urls=await Promise.all(Array.from({length:partCount},async(_,i)=>({partNumber:i+1,url:await getSignedUrl(client,new UploadPartCommand({Bucket,Key:key,UploadId:started.UploadId,PartNumber:i+1}),{expiresIn:900})})));return {uploadId:started.UploadId,key,urls};}
export async function completeRealMultipart(key:string,uploadId:string,parts:{partNumber:number;etag:string}[]){return client.send(new CompleteMultipartUploadCommand({Bucket:required("S3_BUCKET"),Key:key,UploadId:uploadId,MultipartUpload:{Parts:parts.map(p=>({PartNumber:p.partNumber,ETag:p.etag}))}}));}
export async function cancelRealMultipart(key:string,uploadId:string){await client.send(new AbortMultipartUploadCommand({Bucket:required("S3_BUCKET"),Key:key,UploadId:uploadId}));}
function required(name:string){const value=process.env[name];if(!value)throw new Error(`Missing ${name}`);return value}
