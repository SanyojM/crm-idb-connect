import { Card, CardBody } from '@heroui/react'
import { CalendarIcon } from 'lucide-react';

export default function DashboardTodaysDeadline() {
    return (
        <Card radius="lg" className="shadow-sm border border-gray-200">
            <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold">Today's Tasks Deadline</h2>
                </div>

                <div className="pt-6 text-center text-sm text-gray-400">
                    No tasks due today.
                </div>
            </CardBody>
        </Card>
    );
}