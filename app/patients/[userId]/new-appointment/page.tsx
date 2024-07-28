import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NewAppointment() {
  return (
    <div className="flex h-screen max-h-screen">

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image src='/assets/icons/logo-full.svg'
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
        </div>
        {/* <PatientForm /> */}

          <p className="justify-items-end text-dark-600 xl:text-left">
            © 2024 - Connex Tech
          </p>

      </section>
      <Image 
      src='/assets/images/appointment-img.png'
      height={1000}
      width={1000}
      alt="appointment"
      className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
