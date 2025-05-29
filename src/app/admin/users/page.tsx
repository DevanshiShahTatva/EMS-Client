"use client"

import React, { useState, useEffect, useCallback } from 'react'

// Custom Components
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import TooltipWrapper from '@/components/common/TooltipWrapper'
import Breadcrumbs from '@/components/common/BreadCrumbs'
import TitleSection from '@/components/common/TitleSection'
import SearchInput from '@/components/common/CommonSearchBar'
import DataTable from '@/components/common/DataTable'
import FilterModal from '@/components/admin-components/FilterUserModal'
import CustomButton from '@/components/common/CustomButton'

// Constant
import { API_ROUTES, BREAD_CRUMBS_ITEMS } from '@/utils/constant'

// Services
import { apiCall } from '@/utils/services/request'

// Types
import { IUser, IUserData, IUsersApiResponse } from './types'
import { Column, IApplyUserFiltersKey } from '@/utils/types'

// library
import clsx from 'clsx'

// helper
import { exportToExcel } from '@/utils/helper'
import { getFilteredData, getMaxPoints } from './helper'

// icons
import { FunnelIcon } from "@heroicons/react/24/outline"
import { DownloadIcon } from 'lucide-react'




const UsersPage = () => {

    const [loading, setLoading] = useState(true)
    const [allUsersData, setAllUsersData] = useState<IUserData[]>([])
    const [usersData, setUsersData] = useState<IUserData[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    const [filterModal, setFilterModal] = useState(false)
    const [filterValues, setFilterValues] = useState<IApplyUserFiltersKey>({})
    const [appliedFiltersCount, setAppliedFiltersCount] = useState(0)

    const openFilterModal = () => {
        setFilterModal(true)
    }

    const closeFilterModal = () => {
        setFilterModal(false)
    }
    
    const handleSearch = (searchVal: string) => {

        const updatedFilters = {
            ...filterValues,
            search: searchVal,
        };

        const result = getFilteredData(allUsersData, updatedFilters);

        setUsersData(result.data)
        setSearchQuery(searchVal)
    }

    const submitFilters = (filterValues: IApplyUserFiltersKey) => {
        closeFilterModal();
        const updatedFilters = {
          ...filterValues,
          search: searchQuery || "", // include active search in filter logic
        };

        const result = getFilteredData(allUsersData, updatedFilters);
    
        setUsersData(result.data);
        setFilterValues(updatedFilters);
        setAppliedFiltersCount(result.filterCount);
      }

    // Fecth users Data 
    const fetchUsersData = useCallback(async () => {
        setLoading(true);
        try {
            const response: IUsersApiResponse = await apiCall({
                endPoint: API_ROUTES.ADMIN.GET_ALL_USERS,
                method: 'GET'
            });

            if (response && response.success) {
                const receivedArray = response.data as IUser[]

                const modifiedArray = receivedArray.map(item => {
                    return {
                        _id: item._id,
                        name: item.name,
                        email: item.email,
                        profileImage: item.profileimage !== null ? item.profileimage.url : "",
                        badge: item.current_badge ? item.current_badge : "-",
                        address: item.address !== null ? item.address : "-",
                        points : item.total_earned_points,
                        role: item.role
                    }
                })

                setUsersData(modifiedArray)
                setAllUsersData(modifiedArray)
                
            }
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsersData()
    }, [fetchUsersData])

    const tableHeaders: Column<IUserData>[] = [
        {
            header: "Image",
            key: 'profileImage',
            isSortable: false,
            render: (row) => (
                row.profileImage !== "" ?
                    <img
                        src={row.profileImage}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    /> : <button className='h-10 w-10 rounded-full bg-blue-500 text-white font-bold relative cursor-pointer'>
                        {row.name.charAt(0).toUpperCase()}
                    </button>
            ),
        },
        { header: 'Name', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: "Location", key : "address",
            render: (row) => 
                <TooltipWrapper tooltip={row.address}>
                    <p className='max-w-24 truncate'>{row.address}</p>
                </TooltipWrapper>
        
        },
        { header: "Earned Points", key : "points", 
            render: (row) => 
            <p className={`font-bold ${row.points > 0 && 'text-green-500'}`}>
                {row.points}
            </p>
        },
        {
            header: "Badge", key: "badge",
            render: (row) => {
                const badgeStyles = {
                    gold: 'bg-yellow-500 text-white',
                    silver: 'bg-gray-500 text-white',
                    bronze: 'bg-cyan-500 text-white',
                };
                return (
                    <span
                        className={clsx(
                            'font-semibold px-4 py-2 rounded-full inline-block',
                            badgeStyles[row.badge.toLowerCase() as keyof typeof badgeStyles]
                        )}
                    >
                        {row.badge}
                    </span>
                )
            }
        },
        {
            header: 'Role', key: 'role',
            render: (row) => {
                const chipStyles = {
                    user: 'bg-blue-100 text-blue-700',
                    organizer: 'bg-red-100 text-red-700',
                };
                return (
                    <span
                       className={`px-4 py-2 rounded-full capitalize font-semibold ${chipStyles[row.role as keyof typeof chipStyles]}`}
                    >
                        {row.role}
                    </span>
                )
            }
        },
    ]

  return (
    <div className='px-8 py-5'>
        
        <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.ADMIN_USERS.MAIN_PAGE} />

        <ChartCard>
             
              <TitleSection title='All Users' />

              {/* Search Bar & Filter Button */}
              <div className="flex flex-col md:flex-row justify-between md:items-center  gap-4 md:gap-2 space-x-2 w-full my-5">
                  {/* Search Input */}
                  <SearchInput
                      value={searchQuery}
                      onChange={(value) => handleSearch(value)}
                      placeholder="Search users"
                      inputClassName='pl-10 pr-4 py-2 w-full'
                  />

                <div className='flex gap-4 justify-between'>
                  {/* Filters Button */}
                  <div className="relative">
                      <button
                          onClick={openFilterModal}
                          className="flex items-center font-bold cursor-pointer bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
                      >
                          <FunnelIcon className="w-5 h-5 font-bold mr-2" />
                          Filters
                      </button>

                      {appliedFiltersCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-slate-200 text-green-800 text-sm font-bold px-1.5 py-0.5 rounded-full">
                              {appliedFiltersCount}
                          </span>
                      )}
                  </div>
                  {/* Export Butoon */}
                  <div className='flex'>
                      <CustomButton
                          variant={ usersData.length === 0 ? "disabled" : "primary"}
                          className='flex gap-2 items-center'
                          startIcon={<DownloadIcon className='h-5 w-5' />}
                          disabled={usersData.length === 0}
                          onClick={() => exportToExcel(allUsersData,`Users-${Date.now()}.xlsx`)}
                      >
                          Export
                      </CustomButton>
                  </div>
                </div>
              </div>
              

              {/* Data Table with pagination */}

              <DataTable
                loading={loading}
                data={usersData}
                columns={tableHeaders}
                actions={[]}
              />

        </ChartCard>

          {/* Filter Popup */}
          <FilterModal
              isOpen={filterModal}
              onClose={closeFilterModal}
              applyFilters={(filterValues) => submitFilters(filterValues)}
              maxPoints={getMaxPoints(allUsersData)}
          />
    </div>
  )
}

export default UsersPage