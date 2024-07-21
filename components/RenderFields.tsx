import { ICustomProps } from "@/lib/FormCustomProps"
import { Input } from "./ui/input"
import { FormFieldTypes } from "@/lib/FormFieldTypes";
import Image from "next/image";
import { FormControl } from "./ui/form";

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

        default:
            break;
    }

}