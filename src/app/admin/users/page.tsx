"use client"

import React, { useState, useEffect, useCallback } from 'react'

// Custom Components
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import TooltipWrapper from '@/components/common/TooltipWrapper'
import DeleteModal from '@/components/common/DeleteModal'
import Breadcrumbs from '@/components/common/BreadCrumbs'
import TitleSection from '@/components/common/TitleSection'
import CustomButton from '@/components/common/CustomButton'
import SearchInput from '@/components/common/CommonSearchBar'
import DataTable from '@/components/common/DataTable'


// Constant
import { API_ROUTES, BREAD_CRUMBS_ITEMS } from '@/utils/constant'

// Services
import { apiCall } from '@/utils/services/request'

// Types
import { IUser, IUserData, IUsersApiResponse } from './types'
import { Column } from '@/utils/types'


const UsersPage = () => {

    const [loading, setLoading] = useState(true)
    const [allUsersData, setAllUsersData] = useState<IUserData[]>([])
    const [usersData, setUsersData] = useState<IUserData[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    
    const handleSearch = (searchVal: string) => {
        setSearchQuery(searchVal)
    }

    // Fecth Contact Us Data 
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
                        badge: item.current_badge,
                        address: item.address !== null ? item.address : "-",
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
                /> : "-"
            ),
        },

        { header: 'Name', key: 'name' },
        { header: 'Email', key: 'email' },
        { header: 'Role', key: 'role' },
    ]

  return (
    <div className='px-8 py-5'>
        
        <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.ADMIN_USERS.MAIN_PAGE} />

        <ChartCard>
             
              <TitleSection title='All Users' />

              {/* Search Bar */}
              <div className="flex justify-between items-center gap-2 space-x-2 w-full my-5">
                  {/* Search Input */}
                  <SearchInput
                      value={searchQuery}
                      onChange={(value) => handleSearch(value)}
                      placeholder="Search users"
                      inputClassName='pl-10 pr-4 py-2 w-full'
                  />


              </div>

              {/* Data Table with pagination */}

              <DataTable
                loading={loading}
                data={usersData}
                columns={tableHeaders}
                actions={[]}
              />

        </ChartCard>
    </div>
  )
}

export default UsersPage