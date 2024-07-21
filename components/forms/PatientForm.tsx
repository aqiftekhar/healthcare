"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomFormFields from "../CustomFormFields"
import { FormFieldTypes } from "@/lib/FormFieldTypes"


const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
 
const PatientForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
        name = "name"
        label = "Full Name"
        placeholder = "John Doe"
        iconSrc = "/assets/icons/user.svg"
        iconAlt ="user"
        control = {form.control}
        />
      <Button type="submit">Submit</Button>
    </form>
  </Form>
  )
}
export default PatientForm;
