import { Button } from '@/components/ui/button'
import React from 'react'

interface IChartFallbackUIProp {
    handleRefresh?: () => void
}

function ChartFallbackUI({ handleRefresh }: IChartFallbackUIProp) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
            <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <h4 className="text-lg font-medium text-gray-900">No Data Available</h4>
            <p className="text-sm text-gray-500 max-w-xs">
                No data available for visualization. Please check back later or try refreshing.
            </p>
            {handleRefresh ?
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 cursor-pointer"

                    onClick={handleRefresh}
                >
                    Refresh
                </Button>
                : <></>}
        </div>
    )
}

export default ChartFallbackUI

