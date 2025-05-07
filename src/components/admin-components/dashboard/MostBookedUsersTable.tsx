'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { API_ROUTES } from '@/utils/constant';
import { apiCall } from '@/utils/services/request';

interface IUser {
    totalBookings: number;
    userId: string;
    name: string;
    email: string;
}

function TruncatedCell({ text }: { text: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span className="block truncate whitespace-nowrap overflow-hidden max-w-[200px]">
                        {text}
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-white">{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default function MostBookedUsersTable() {

    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const endPoint = `${API_ROUTES.ADMIN.TOP_USERS_HIGHEST_BOOKING}?limit=10`;
            const response = await apiCall({ endPoint, method: 'GET' });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const loadingSkeleton = useMemo(() => (
        Array.from({ length: 10 }).map((_, index) => (
            <TableHeader key={index} className='text-xs uppercase bg-gray-100'>
                <TableRow>
                    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                </TableRow>
            </TableHeader>
        ))
    ), []);

    const tableContent = useMemo(() => {
        if (loading) return loadingSkeleton;

        return (
            <>
                <TableHeader className='text-xs uppercase bg-gray-100'>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[100px] text-gray-700 font-[700]">ID</TableHead>
                        <TableHead className="text-gray-700 font-[700]">Name</TableHead>
                        <TableHead className="text-gray-700 font-[700]">Email</TableHead>
                        <TableHead className="text-center text-gray-700 font-[700]">Total No. of Bookings</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length ? users.map((user, index) => (
                        <TableRow key={user.userId} className="hover:bg-transparent text-gray-800">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell><TruncatedCell text={user.name} /></TableCell>
                            <TableCell><TruncatedCell text={user.email} /></TableCell>
                            <TableCell className="text-center">{user.totalBookings}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                No data available.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </>
        );
    }, [loading, loadingSkeleton, users]);

    return (
        <div className='mt-6'>
            <Table>{tableContent}</Table>
        </div>
    );
}
