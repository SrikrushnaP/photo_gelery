# Photo Gallery - Face Recognition App

A full-stack application for uploading and searching photos using AWS Rekognition face detection.

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- AWS SDK v3 (S3, Rekognition)
- Multer for file uploads

**Frontend:**
- Angular 21
- Angular Material UI
- RxJS

## Features

- ✅ Upload multiple photos with face indexing
- ✅ Search photos by face similarity
- ✅ Preview and download photos
- ✅ Responsive gallery view
- ✅ Real-time upload progress

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- AWS Account with S3 and Rekognition access

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
AWS_REGION=ap-south-2
AWS_REKOGNITION_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your_bucket_name
```

3. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Open browser: `http://localhost:4200`

## Usage

1. **Upload Photos**: Go to Upload page, select multiple photos, click Upload
2. **Search by Face**: Go to Search page, upload a photo with a face, view matching results
3. **View Gallery**: Browse all uploaded photos

## AWS Configuration

- S3 bucket for photo storage
- Rekognition collection for face indexing
- IAM user with appropriate permissions

## License

MIT
