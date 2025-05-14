"use client"

import React, { useState, useEffect, useCallback } from 'react'

// Custom components
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import QuilEditor from '@/components/admin-components/QuilEditor'
import Loader from '@/components/common/Loader'
import TitleSection from '@/components/common/TitleSection'
import Breadcrumbs from '@/components/common/BreadCrumbs'

// Icons
import { TrashIcon } from "@heroicons/react/24/outline"

// types
import { ITermsResponse } from './types'

// Services
import { apiCall } from '@/utils/services/request'

// Constants
import { API_ROUTES, BREAD_CRUMBS_ITEMS } from '@/utils/constant'

// library
import { toast } from 'react-toastify'


const AdminTCsPage = () => {

    const [loader, setLoader] = useState(true)
    const [content, setContent] = useState("")
    const [error, setError] = useState(false)

    const handleChange = (value: string) => {
        if (value.length !== 11) {
            setError(true)
        } else {
            setError(false)
        }

        setContent(value)
    }

    const deleteTermsContent = async () => {
        setLoader(true);
        try {
            
            const response = await apiCall({
                endPoint: API_ROUTES.TERMS_AND_CONDITIONS,
                method: 'DELETE',
            });

            if (response && response.success) {
                await getTermsContent()
                toast.success("Terms & Conditions Reset Successfully")
                
            }
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoader(false);
        }
    }

    const updateTermsContent = async () => {
        if(content.length < 20) {
            setError(true)
            return false
        }

        setLoader(true);
        try {
            const httpBody = {
                "content": content
            }
            const response = await apiCall({
                endPoint: API_ROUTES.TERMS_AND_CONDITIONS,
                method: 'PUT',
                body: httpBody
            });

            if (response && response.success) {
                await getTermsContent()
                toast.success("Terms & Conditions Updated Successfully")
            }
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoader(false);
        }
    }

    const getTermsContent = useCallback(async () => {
        setLoader(true);
        try {
            const response: ITermsResponse = await apiCall({
                endPoint: API_ROUTES.TERMS_AND_CONDITIONS,
                method: 'GET'
            });

            if (response && response.success) {
                const receivedObject = response.data
                setContent(receivedObject.content)
            }
        } catch (err) {
            console.error('Error fetching chart data', err);
        } finally {
            setLoader(false);
        }
    }, []);

    useEffect(() => {
        getTermsContent()
    }, [getTermsContent])

    return (
        <div className='px-8 py-5'>

            {loader && <Loader />}

            <Breadcrumbs breadcrumbsItems={BREAD_CRUMBS_ITEMS.TERMS_AND_CONDITIONS.MAIN_PAGE} />
            
            <ChartCard>


                {/* Reset button */}
                <div className='my-1 flex justify-between items-center'>
                    <TitleSection title='Terms And Conditions' />
                    <button
                        onClick={deleteTermsContent}
                        className="disabled:bg-red-300 disabled:cursor-not-allowed md:flex gap-1 items-center font-bold cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                        <TrashIcon className="w-5 h-5 font-bold" />
                        <p className="hidden md:block">Reset</p>
                    </button>
                </div>

                <div>
                    <QuilEditor
                        name="tc"
                        value={content}
                        onChange={(value) => handleChange(value)}
                        label='Description'
                        errorKey={error}
                        errorMsg={content.length > 20 ? "" : "Enter valid terms content"}
                        placeholder='Enter Terms & Conditions'
                    />
                </div>

                <div className='flex justify-end'>
                    <button
                        onClick={updateTermsContent}
                        className="disabled:bg-blue-300 disabled:cursor-not-allowed md:flex gap-1 items-center font-bold cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        <p className="hidden md:block">Save</p>
                    </button>
                </div>

            </ChartCard>
        </div>
    )
}

export default AdminTCsPage