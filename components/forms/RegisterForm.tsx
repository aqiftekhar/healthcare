"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormFields from "../CustomFormFields"
import { FormFieldTypes } from "@/lib/FormFieldTypes"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/FormValidation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { GenderOptions } from "@/constants"




const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter();
    const [isLoading, setisLoading] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof UserFormValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        setisLoading(true);

        try {

            const user_data = {
                name: values.name,
                email: values.email,
                phone: values.phone,
            };

            const user = await createUser(user_data);

            if (user) router.push(`/patients/${user.$id}/register`)
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
