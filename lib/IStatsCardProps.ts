interface IStatsCardProps {
    type: 'appointments' | 'pending' | 'cancelled',
    count: number,
    label: string,
    icon: string,
}