"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormFields from "../CustomFormFields"
import { FormFieldTypes } from "@/lib/FormFieldTypes"
import SubmitButton from "../SubmitButton"
import { useEffect, useState } from "react"
import { PatientFormValidation } from "@/lib/FormValidation"
import { useRouter } from "next/navigation"
import { createUser, getUser, registerPatient } from "@/lib/actions/patient.actions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { SelectItem } from "../ui/select"
import Image from 'next/image';
import FileUploader from "../FileUploader"



const RegisterForm = ({ userId }: { userId: string }) => {
    // const user =  getUser(userId);
    const router = useRouter();
    const [isLoading, setisLoading] = useState(false);
    const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
        //   setLoading(true);
          try {
            const userData = await getUser(userId);
            setUser(userData);
          } catch (error) {
            console.error('Error fetching user data:', error);
          } finally {
            // setLoading(false);
          }
        };
    
        fetchUser();
      }, [userId]);
    // 1. Define your form.
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        setisLoading(true);

        let form_data;

        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blob = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type,
            })

            form_data = new FormData();
            form_data.append('blobFile', blob);
            form_data.append('fileName', values.identificationDocument[0].name);
        }
        
        try {
            const patient_data = {
                ...values,
                userId: userId,
                birthDate: new Date(values.birthDate),
                identificationDocument: form_data,
            }

            //@ts-ignore
            const patient = await registerPatient(patient_data);

            if(patient) router.push(`/patients/${userId}/new-appointment`)
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
                <section className="space-y-4">
                    <h1 className="header"> Welcome 👋 </h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Personal Information.</h2>
                    </div>
                </section>
                <CustomFormFields
                    fieldType={FormFieldTypes.INPUT}
                    name="name"
                    label="Full Name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                    control={form.control}
                />
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormFields
                        fieldType={FormFieldTypes.INPUT}
                        name="email"
                        label="Email"
                        placeholder="john@email.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="email"
                        control={form.control}
                    />
                    <CustomFormFields
                        fieldType={FormFieldTypes.PHONE_INPUT}
                        name="phone"
                        label="Phone Number"
                        placeholder="(555) 123-4567"
                        control={form.control}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormFields
                        fieldType={FormFieldTypes.DATE_PICKER}
                        name="birthDate"
                        label="Date Of Birth"
                        placeholder="john@email.com"
                        iconSrc="/assets/icons/email.svg"
                        iconAlt="email"
                        control={form.control}
                    />
                    <CustomFormFields
                        fieldType={FormFieldTypes.SKELETON}
                        name="gender"
                        label="Gender"
                        control={form.control}
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}>
                                    {GenderOptions.map((option) => (
                                        <div key={option} className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <label htmlFor={option} className="cursor-pointer">
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </RadioGroup>

                            </FormControl>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormFields
                        fieldType={FormFieldTypes.INPUT}
                        name="address"
                        label="Address"
                        placeholder="14th Street, New york"
                        control={form.control}
                    />
                    <CustomFormFields
                        fieldType={FormFieldTypes.INPUT}
                        name="occupation"
                        label="Occupation"
                        placeholder="Accountant, Software Engineer"
                        control={form.control}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormFields
                        fieldType={FormFieldTypes.INPUT}
                        name="emergencyContactName"
                        label="Emergency Contact Name"
                        placeholder="Guardian's name"
                        control={form.control}
                    />
                    <CustomFormFields
                        fieldType={FormFieldTypes.PHONE_INPUT}
                        name="emergencyContactNumber"
                        label="Emergency Contact Number"
                        placeholder="(555) 123-4567"
                        control={form.control}
                    />
                </div>

                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Medical Information.</h2>
                    </div>
                </section>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormFields
                        fieldType={FormFieldTypes.SELECT}
                        name="primaryPhysician"
                        label="Primary Physician"
                        placeholder="Select a Physician"
                        control={form.control}
                    >
                        {Doctors.map((doctor) => (

                            <SelectItem key={doctor.name} value={doctor.name}>
                                <div className="flex cursor-pointer items-center gap-2">
                                    <Image
                                        src={doctor.image}
                                        width={32}
                                        height={32}
                                        alt={doctor.name}
                                        className="rounded-full border border-dark-500"
                                    />
                                    <p>{doctor.name}</p>
                                </div>
                            </SelectItem>
                        ))}
                    </CustomFormFields>
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormFields
                        fieldType={FormFieldTypes.INPUT}
                        name="insuranceProvider"
                        label="Insurance Provider"
                        placeholder="EFU Life, Adam Insurance"
                        control={form.control}
                    />
                    <CustomFormFields
                        fieldType={FormFieldTypes.INPUT}
                        name="insurancePolicyNumber"
                        label="Insurance Policy Number"
                        placeholder="ABC1234567890"
                        control={form.control}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormFields
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="allergies"
                        label="Allergies (if any)"
                        placeholder="Peanuts, Penicillin, Pollen etc."
                        control={form.control}
                    />
                    <CustomFormFields
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="currentMedications"
                        label="Current Medication (if any)"
                        placeholder="Ibuprofen 200mg, Paracetamol 500mg"
                        control={form.control}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormFields
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="familyMedicalHistory"
                        label="Family Medical History"
                        placeholder="Father had dibeties."
                        control={form.control}
                    />
                    <CustomFormFields
                        fieldType={FormFieldTypes.TEXTAREA}
                        name="pastMedicalHistory"
                        label="Past Medical History"
                        placeholder="Appendectomy, Tonsillectomy"
                        control={form.control}
                    />
                </div>
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Identification and Verification.</h2>
                    </div>
                </section>

                <CustomFormFields
                    fieldType={FormFieldTypes.SELECT}
                    name="identificationType"
                    label="Identification Type"
                    placeholder="Select an Identification Type"
                    control={form.control}
                >
                    {IdentificationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))}
                </CustomFormFields>
                <CustomFormFields
                    fieldType={FormFieldTypes.INPUT}
                    name="identificationNumber"
                    label="Identification Number"
                    placeholder="ABC1234567890"
                    control={form.control}
                />
                <CustomFormFields
                    fieldType={FormFieldTypes.SKELETON}
                    name="identificationDocument"
                    label="Scanned Copy of Identification Document"
                    control={form.control}
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange} />
                        </FormControl>
                    )}
                />
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy.</h2>
                    </div>
                </section>

                <CustomFormFields
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="treatmentConsent"
                    label="I consent to treatment"
                />
                <CustomFormFields
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="disclosureConsent"
                    label="I consent to disclosure of information"
                />
                <CustomFormFields
                    fieldType={FormFieldTypes.CHECKBOX}
                    control={form.control}
                    name="privacyConsent"
                    label="I consent to privacy policy"
                />
                <div className="flex flex-col gap-6 xl:flex-row">

                </div>
                <div className="flex flex-col gap-6 xl:flex-row">

                </div>
                <div className="flex flex-col gap-6 xl:flex-row">

                </div>
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}
export default RegisterForm;
