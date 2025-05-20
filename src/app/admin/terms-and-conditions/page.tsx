"use client"

import React, { useState, useEffect, useCallback } from 'react'

// Custom components
import ChartCard from '@/components/admin-components/dashboard/ChartCard'
import QuilEditor from '@/components/admin-components/QuilEditor'
import Loader from '@/components/common/Loader'
import TitleSection from '@/components/common/TitleSection'
import Breadcrumbs from '@/components/common/BreadCrumbs'
import CustomButton from '@/components/common/CustomButton'
import { marked } from "marked";
import { Sparkles, Trash2 } from 'lucide-react';
// types
import { ITermsResponse } from './types'

// Services
import { apiCall } from '@/utils/services/request'

// Constants
import { API_ROUTES, BREAD_CRUMBS_ITEMS } from '@/utils/constant'

// library
import { toast } from 'react-toastify'
import TermsTagModal from '@/components/admin-components/TermsTagModal'


const AdminTCsPage = () => {

    const [loader, setLoader] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const [content, setContent] = useState("")
    const [error, setError] = useState(false)

    const handleOpenModal = () => {
        setOpenModal(true)
    }
    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const handleGenerateDescription = useCallback(async (keywords: string[]) => {
        setIsGenerating(true)
        try {

            const body = {
                "keywords": keywords
            }

            const res = await apiCall({
                method: "POST",
                endPoint: API_ROUTES.ADMIN.GENERATE_TERMS_CONDITIONS,
                body: body,
            });

            if (res.success) {
                const cleanText = res.data.replace(/```/g, '');
                const html = await marked(cleanText);
                setContent(html);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message)
        } finally {
            setIsGenerating(false)
            handleCloseModal()
        }
    }, []);

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
        if (content.length < 20) {
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
                <div className='mb-6 flex justify-between items-center'>
                    <TitleSection title='Terms And Conditions' />
                    <div className='flex gap-2'>
                        <CustomButton
                            onClick={deleteTermsContent}
                            variant='delete'
                            startIcon={<Trash2 className="w-5 h-5 font-bold" />}
                            className="disabled:bg-red-300 disabled:cursor-not-allowed md:flex gap-1 items-center cursor-pointer"
                        >

                            <p className="hidden md:block">Reset</p>
                        </CustomButton>
                        <CustomButton
                            onClick={handleOpenModal}
                            variant='primary'
                            startIcon={<Sparkles className="w-5 h-5 font-bold" />}
                            className="disabled:bg-red-300 disabled:cursor-not-allowed md:flex gap-1 items-center cursor-pointer"
                        >

                            <p className="hidden md:block">Ask AI</p>
                        </CustomButton>
                    </div>
                </div>

                <div>
                    <QuilEditor
                        name="tc"
                        value={content}
                        onChange={(value) => handleChange(value)}
                        label=''
                        errorKey={error}
                        errorMsg={content.length > 20 ? "" : "Enter valid terms content"}
                        placeholder='Enter Terms & Conditions'
                    />
                </div>

                <div className='flex justify-end'>
                    <CustomButton
                        onClick={updateTermsContent}
                        variant='primary'
                        className="disabled:bg-blue-300 disabled:cursor-not-allowed md:flex gap-1 items-center cursor-pointer"
                    >
                        <p className="hidden md:block">Save</p>
                    </CustomButton>
                </div>

            </ChartCard>
            {openModal &&
                <TermsTagModal onClose={handleCloseModal} onSave={handleGenerateDescription} loading={isGenerating}/>}
        </div>
    )
}

export default AdminTCsPage