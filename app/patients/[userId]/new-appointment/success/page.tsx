import SuccessRequest from "@/components/SuccessRequest";

const Success = ({params: { userId }, searchParams}: SearchParamProps) => {
    const appointmentId = (searchParams?.appointmentId as string) || '';
    return (
        <SuccessRequest userId = {userId} appointmentId={appointmentId}  />
    )
};

export default Success;
