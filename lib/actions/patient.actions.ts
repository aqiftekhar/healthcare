"use server";

import { ID, Query } from "node-appwrite";
import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../Appwrite.config";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";
import { Patient } from "@/types/appwrite.types";

export const createUser = async (user: CreateUserParams) => {
  try {
    const new_user = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(new_user);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal("email", [user.email])]);

      return documents?.users[0];
    }
  }
};

// GET USER
export const getUser = async (userId: string) => {
    try {
      const user = await users.get(userId);

      return parseStringify(user);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the user details:",
        error
      );
    }
  };

  // GET USER
export const getPatient = async (userId: string): Promise<Patient | null> => {
    try {
      const pateints = await databases.listDocuments(
        DATABASE_ID!,
        PATIENT_COLLECTION_ID!,
        [
            Query.equal('userId', userId)
        ]
      ); 
        
      return parseStringify(pateints.documents[0]);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the patient details:",
        error
      );
      return null;
    }
  };

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get("blobFile") as Blob,
        identificationDocument?.get("fileName") as string
      );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    const new_patient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id || null,
        identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient,
      }
    );
    
    return parseStringify(new_patient);
  } catch (error) {
    console.log("Error while saving patient document",error);
    
  }
};


