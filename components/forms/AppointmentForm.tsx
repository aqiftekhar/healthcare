"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormFields from "../CustomFormFields"
import { FormFieldTypes } from "@/lib/FormFieldTypes"
import SubmitButton from "../SubmitButton"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { getAppointmentSchema } from "@/lib/FormValidation"
import { useRouter } from "next/navigation"
import { createUser, getPatient } from "@/lib/actions/patient.actions"
import { Doctors } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from 'next/image';
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions"
import { Appointment, Patient } from "@/types/appwrite.types"

export const AppointmentForm = ({
    userId,
    patientId,
    type = "create",
    appointment,
    setOpen,
}: {
    userId: string;
    patientId: string;
    type: "create" | "schedule" | "cancel";
    appointment?: Appointment;
    setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment?.primaryPhysician : "",
            schedule: appointment
                ? new Date(appointment?.schedule!)
                : new Date(Date.now()),
            reason: appointment ? appointment.reason : "",
            note: appointment ? appointment?.note : "",
            cancellationReason: appointment?.cancellationReason || "",
        },
    });

    const onSubmit = async (
        values: z.infer<typeof AppointmentFormValidation>
    ) => {

        setIsLoading(true);

        let status;
        switch (type) {
            case "schedule":
                status = "scheduled";
                break;
            case "cancel":
                status = "cancelled";
                break;
            default:
                status = "pending";
        }

        try {
            if (type === "create" && patientId) {
                const appointment = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    status: status as Status,
                    note: values.note,
                };

                const newAppointment = await createAppointment(appointment);

                if (newAppointment) {
                    form.reset();
                    router.push(
                        `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
                    );
                }
            } else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values.primaryPhysician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                    },
                    type,
                };

                const updatedAppointment = await updateAppointment(appointmentToUpdate);

                if (updatedAppointment) {
                    setOpen && setOpen(false);
                    form.reset();
                }
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    let buttonLabel;
    switch (type) {
        case "cancel":
            buttonLabel = "Cancel Appointment";
            break;
        case "schedule":
            buttonLabel = "Schedule Appointment";
            break;
        default:
            buttonLabel = "Submit Appointment";
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
                {type === "create" && (
                    <section className="mb-12 space-y-4">
                        <h1 className="header">New Appointment</h1>
                        <p className="text-dark-700">
                            Request a new appointment in 10 seconds.
                        </p>
                    </section>
                )}

                {type !== "cancel" && (
                    <>
                        <CustomFormFields
                            fieldType={FormFieldTypes.SELECT}
                            control={form.control}
                            name="primaryPhysician"
                            label="Doctor"
                            placeholder="Select a doctor"
                        >
                            {Doctors.map((doctor, i) => (
                                <SelectItem key={doctor.name + i} value={doctor.name}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt="doctor"
                                            className="rounded-full border border-dark-500"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormFields>

                        <CustomFormFields
                            fieldType={FormFieldTypes.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Expected appointment date"
                            showTimeSelect
                            dateFormat="MM/dd/yyyy  -  h:mm aa"
                        />

                        <div
                            className={`flex flex-col gap-6  ${type === "create" && "xl:flex-row"}`}
                        >
                            <CustomFormFields
                                fieldType={FormFieldTypes.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Appointment reason"
                                placeholder="Annual montly check-up"
                                disabled={type === "schedule"}
                            />

                            <CustomFormFields
                                fieldType={FormFieldTypes.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Comments/notes"
                                placeholder="Prefer afternoon appointments, if possible"
                                disabled={type === "schedule"}
                            />
                        </div>
                    </>
                )}

                {type === "cancel" && (
                    <CustomFormFields
                        fieldType={FormFieldTypes.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Reason for cancellation"
                        placeholder="Urgent meeting came up"
                    />
                )}

                <SubmitButton
                    isLoading={isLoading}
                    className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
                >
                    {buttonLabel}
                </SubmitButton>
            </form>
        </Form>
    );
};

// const AppointmentForm = ({
//     type,
//     userId,
//     patientId,
//     appointment, 
//     setOpen }: { 
//         type: "create" | "cancel" | "schedule", 
//         userId: string, 
//         patientId: string,
//         appointment?: Appointment, 
//         setOpen: (open: boolean) => void
//      }) => {
//     const router = useRouter();
//     const [isLoading, setisLoading] = useState(false);
//     const [patient, setPatient] = useState<Patient | null>(null);

//     useEffect(() => {
//         const fetchPatient = async () => {
//             try {
//                 const fetchedPatient = await getPatient(userId);
//                 setPatient(fetchedPatient);
//             } catch (error) {
//                 console.error('Error fetching patient data:', error);
//             } finally {
//             }
//         };

//         fetchPatient();
//     }, [userId]);

//     // Select Validation Schema based on form type
//     const AppointmentFormValidation = getAppointmentSchema(type);

//     // 1. Define your form.
//     const form = useForm<z.infer<typeof AppointmentFormValidation>>({
//         resolver: zodResolver(AppointmentFormValidation),
//         defaultValues: {
//             primaryPhysician: "",
//             schedule: new Date(),
//             reason: "",
//             note: "",
//             cancellationReason: ""
//         },
//     })

//     // 2. Define a submit handler.
//     async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
//         // Do something with the form values.
//         // ✅ This will be type-safe and validated.

//         setisLoading(true);

//         let status;
//         switch (type) {
//             case "schedule":
//                 status = "scheduled";
//                 break;
//             case "cancel":
//                 status = "cancelled";
//                 break;
//             default:
//                 status = "pending";
//         }

//         try {
//             if (type === 'create' && patientId) {
//                 const new_appointment = {
//                     userId,
//                     patient: patientId,
//                     primaryPhysician: values.primaryPhysician,
//                     schedule: new Date(values.schedule),
//                     reason: values.reason!,
//                     note: values.note,
//                     status: status as Status

//                 }

//                 const appointment = await createAppointment(new_appointment);


//                 if (appointment) {
//                     form.reset();
//                     router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
//                 }
//             } else {
//                 const appointmentToUpdate = {
//                     userId,
//                     appointmentId: appointment?.$id!,
//                     appointment: {
//                       primaryPhysician: values?.primaryPhysician,
//                       schedule: new Date(values?.schedule),
//                       status: status as Status,
//                       cancellationReason: values?.cancellationReason,
//                     },
//                     type,
//                 }
//                 const updatedAppointment = await updateAppointment(appointmentToUpdate);

//                 if (updatedAppointment) {
//                   setOpen && setOpen(false);
//                   form.reset();
//                 }
//             }

//         } catch (error) {
//             console.log(error)
//         }
//         setisLoading(false);
//     }

//     let buttonLabel;
//     switch (type) {
//         case 'cancel':
//             buttonLabel = 'Cancel Appointment';
//             break;
//         case 'create':
//             buttonLabel = 'Create Appointment';
//             break;
//         case 'schedule':
//             buttonLabel = 'Schedule Appointment';
//             break;
//         default:
//             break;
//     }
//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
//                 <section className="mb-12 space-y-4">
//                     <h1 className="header"> New Appointment </h1>
//                     <p className="text-dark-700">Schedule your appointments.</p>
//                 </section>

//                 {type === "create" && (
//                     <>
//                         <CustomFormFields
//                             fieldType={FormFieldTypes.SELECT}
//                             name="primaryPhysician"
//                             label="Doctor"
//                             placeholder="Select a Doctor"
//                             control={form.control}
//                         >
//                             {Doctors.map((doctor) => (

//                                 <SelectItem key={doctor.name} value={doctor.name}>
//                                     <div className="flex cursor-pointer items-center gap-2">
//                                         <Image
//                                             src={doctor.image}
//                                             width={32}
//                                             height={32}
//                                             alt={doctor.name}
//                                             className="rounded-full border border-dark-500"
//                                         />
//                                         <p>{doctor.name}</p>
//                                     </div>
//                                 </SelectItem>
//                             ))}
//                         </CustomFormFields>

//                         <CustomFormFields
//                             fieldType={FormFieldTypes.DATE_PICKER}
//                             control={form.control}
//                             name="schedule"
//                             label="Expected appointment Date"
//                             showTimeSelect
//                             dateFormat="MM/dd/yyyy - h:mm:aa"
//                         />

//                         <div className="flex flex-col gap-6 xl:flex-row">
//                             <CustomFormFields
//                                 fieldType={FormFieldTypes.TEXTAREA}
//                                 control={form.control}
//                                 name="reason"
//                                 label="Reason for appointment"
//                                 placeholder="Enter reason for appointment"
//                             />
//                             <CustomFormFields
//                                 fieldType={FormFieldTypes.TEXTAREA}
//                                 control={form.control}
//                                 name="notes"
//                                 label="Notes"
//                                 placeholder="Enter Notes"
//                             />
//                         </div>
//                     </>
//                 )}

//                 {type === 'cancel' && (
//                     <CustomFormFields
//                         fieldType={FormFieldTypes.TEXTAREA}
//                         control={form.control}
//                         name="cancellationReason"
//                         label="Reason for cancellation"
//                         placeholder="Enter reason for cancellation"
//                     />
//                 )}

//                 <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
//             </form>
//         </Form>
//     )
// }
export default AppointmentForm;
