"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormFields from "../CustomFormFields"
import { FormFieldTypes } from "@/lib/FormFieldTypes"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/FormValidation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"




const RegisterForm = ({user} : {user: User}) => {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header"> Hi There 👋 </h1>
                    <p className="text-dark-700">Schedule your appointments.</p>
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
                
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    )
}
export default RegisterForm;
