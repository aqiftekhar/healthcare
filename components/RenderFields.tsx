import { ICustomProps } from "@/lib/FormCustomProps"
import { Input } from "./ui/input"
import { FormFieldTypes } from "@/lib/FormFieldTypes";
import Image from "next/image";
import { FormControl } from "./ui/form";
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input'
import { E164Number } from "libphonenumber-js/core";
export const RenderFields = ({ field, props }: { field: any, props: ICustomProps }) => {
    const { fieldType, iconSrc, iconAlt, placeholder } = props;
    switch (fieldType) {
        case FormFieldTypes.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            alt={iconAlt || 'icon'}
                            height={24}
                            width={24}
                            className='ml-2'
                        />
                    )}
                    <FormControl>
                        <Input 
                            placeholder={placeholder} 
                            {...field} 
                            className="shad-input border-0"
                            />
                    </FormControl>
                </div>
            )
        case FormFieldTypes.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput 
                    defaultCountry="PK"
                    placeholder={placeholder}
                    international
                    withCountryCallingCode
                    value={field.value as E164Number | undefined}
                    onChange={field.onChange}
                    className="input-phone"
                    />
                </FormControl>
            )
        default:
            break;
    }

}