import * as SDK from 'node-appwrite'
const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID : BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT : ENDPOINT
} = process.env;

const client = new SDK.Client();

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

export const databases = new SDK.Databases(client);
export const storage = new SDK.Storage(client);
export const messaging = new SDK.Messaging(client);
export const users = new SDK.Users(client);
