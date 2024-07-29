"use client";

import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function SuccessRequest({userId, appointmentId}: {userId: string, appointmentId: string}) {
    
    const [isLoading, setisLoading] = useState(false);
    const [appointment, setAppointment] = useState<Appointment | null>(null);;
    const [doctor, setDoctor] = useState<{ image: string; name: string } | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
        //   setLoading(true);
          try {
            const fetchAppointment = await getAppointment(appointmentId);
            const fetchDoctor = await Doctors.find((doc) => doc.name === fetchAppointment.primaryPhysician) || null
            setAppointment(fetchAppointment);
            setDoctor(fetchDoctor);
          } catch (error) {
            console.error('Error fetching user data:', error);
          } finally {
            // setLoading(false);
          }
        };
    
        fetchUser();
      }, [appointmentId]);


    return (
        <div className="flex h-screen max-h-screen px-[5%]">
            <div className="success-img">
                <Link href='/'>
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="logo"
                        className="h-10 w-fit"
                    />
                </Link>
                <section className="flex flex-col items-center">
                    <Image
                        src="/assets/gifs/success.gif"
                        height={300}
                        width={280}
                        alt="success"
                    />
                    <h2 className="header mb-6 max-w-[600px] text-center">
                        Your <span className="text-green-500">appointment request</span> has been successfully submitted
                    </h2>
                    <p>We will be in touch shortly to confirm.</p>
                </section>
                <section className="request-details">
                    <p>Requested appointment details:</p>
                    <div className="flex items-center gap-3">
                        <Image 
                            src={doctor?.image! || ""}
                            alt="doctor"
                            width={100}
                            height={100}
                            className="size-6"
                        />
                        <p className="whitespace-nowrap">
                            Dr. {doctor?.name}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Image 
                            src="/assets/icons/calendar.svg"
                            height={24}
                            width={24}
                            alt="calander"
                        />
                       <p>{appointment?.schedule ? formatDateTime(appointment.schedule).dateTime : "N/A"}</p>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default SuccessRequest;
