"use server";

import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  APPOINTMENT_COLLECTION_ID,
  databases
} from "../Appwrite.config";

import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    // revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};
// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the existing patient:",
      error
    );
  }
};

export const getRecentAppointments = async() => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [
        Query.limit(10),
        Query.orderDesc("$createdAt")
      ]
    );
    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    }

    const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
      if(appointment.status === 'scheduled') {
        acc.scheduledCount++;
      } else if(appointment.status === 'pending' ) {
        acc.pendingCount++;
      } else if (appointment.status === 'cancelled') {
        acc.cancelledCount++;
      }
      return acc;
    }, initialCounts);

    const appointments_data = {
      totalCounts : appointments.total,
      ...counts,
      documents: appointments.documents
    }
    return parseStringify(appointments_data);
  } catch (error) {
    console.log(error);
  }
}