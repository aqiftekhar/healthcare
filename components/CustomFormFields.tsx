'use client';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { ICustomProps } from "@/lib/FormCustomProps";
import { FormFieldTypes } from "@/lib/FormFieldTypes";
import { Control } from "react-hook-form";
import { RenderFields } from "./RenderFields";



const CustomFormFields = (props : ICustomProps) => {
    const {control, fieldType, name, label } = props;
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
        <FormItem className="flex-1">
            {fieldType !== FormFieldTypes.CHECKBOX && label && (
                <FormLabel>{label}</FormLabel>
            )}

            <RenderFields field={field} props = {props}  />

            <FormMessage className="shad-error" />
        </FormItem>
    )}
  />
  )
};

export default CustomFormFields;
