# Upwork application kit

## Project name

**MoveScan OS — Resilient Video-to-Inventory Pipeline**

## GitHub description

Mobile-first video compression, resumable S3 multipart uploads, mocked CV processing, and a responsive inventory operations dashboard.

## Architecture paragraph

MoveScan OS keeps video-heavy work close to the source: the React Native client inspects and compresses a walkthrough on-device, asks the backend for a multipart upload, and sends chunks directly to S3 through short-lived presigned URLs. The backend owns all AWS credentials, validates completion ETags, records the scan, and dispatches an external computer-vision job. A Next.js manager dashboard reads the same scan state and presents upload recovery, processing, and reviewable inventory results. Demo mode replaces S3 and the vision provider without changing the API boundaries.

## 60–90 second demo script

“I built MoveScan OS as a focused proof of the hardest part of your workflow: getting a field video reliably into an inventory system. Here’s a 94-second 1080p walkthrough at 286 megabytes. Processing runs locally with an H.264, 720p, CRF 23 profile—small enough for field upload without throwing away the visual detail a CV model needs. The result is 91 megabytes, a 68% reduction.

The app then creates a multipart session through the backend. The mobile client receives short-lived part URLs—never AWS credentials—and uploads directly to S3 with per-part ETags, progress, cancellation, and retry. I’ll simulate an expired URL: completed chunks remain intact, the client requests a fresh URL, and retries only the failed part.

When the upload completes, the dashboard receives the scan and starts a mocked external CV job. This is deliberately labeled as mocked; the integration boundary is what would connect to your real service. The detail view shows the event timeline, compression and upload metadata, and inventory with confidence scores. The repository includes typed REST routes, state-transition and multipart validation tests, and the production S3 path.”

## Exact screen sequence

1. Open `/mobile-demo` and point out the 286 MB source metadata.
2. Click **Start processing**; show the local compression progress.
3. Pause on the 91.4 MB result and 68% reduction.
4. Click **Upload 91.4 MB**; show part-level and total progress.
5. Click **Expire part URL**, then **Retry part 5**.
6. Let the upload and mocked vision processing complete.
7. Open `/` and show the live transfer, summary metrics, and recent scans.
8. Open `/scans/MS-2841`; show the timeline and detected inventory.
9. Open `/scans/MS-2838`; show the seeded failure and targeted retry explanation.

## Proposal paragraph

I built a focused proof of work for your mobile video pipeline rather than a generic CRUD demo. It covers on-device FFmpeg compression with a CV-conscious profile, secure S3 multipart uploads through backend-issued presigned URLs, part-level retry/cancel/expired-URL handling, scan state transitions, and a responsive Next.js manager dashboard with a clearly mocked external CV integration. The code keeps AWS credentials server-side, validates multipart completion, includes an idempotent completion path, and ships with targeted tests and seeded operational states. I’d be glad to walk you through the 90-second flow and discuss how I would adapt it to your current mobile and processing stack.

## Five technical discussion points

1. **Compression trade-off:** 720p H.264 at CRF 23 with a medium preset reduces transfer cost while retaining object edges and room context; the profile should be calibrated against model recall, not file size alone.
2. **Multipart reliability:** each chunk is independently retried with exponential backoff; persisted upload ID plus ETags enables resume without replaying successful parts.
3. **Credential boundary:** clients receive only scoped, 15-minute presigned URLs. S3 credentials and completion privileges remain on the backend.
4. **Idempotency:** a second completion request returns the existing asset, and the backend validates the exact expected part set before asking S3 to assemble it.
5. **Integration boundary:** the mocked CV adapter has the same asynchronous request/status/result shape a production provider would use, making webhook or polling integration replaceable.

## Three questions for the client

1. Which image properties most affect the current model’s recall—resolution, bitrate, motion blur, keyframe interval, or camera speed—and do you already have a validated mobile encoding profile?
2. Do scan sessions need to survive app termination and resume across devices, or is same-device background resume the initial reliability target?
3. Does the current CV service expose webhooks, polling, or a queue contract, and how are partial results, low-confidence items, and human corrections represented?
