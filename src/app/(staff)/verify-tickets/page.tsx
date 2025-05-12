"use client"

import React, { useState } from 'react'

// Custom Components
import QRCodeScanner from '@/components/events-components/QRCodeScanner'
import Loader from '@/components/common/Loader'

// Library
import { toast } from 'react-toastify'

// Service
import { apiCall } from '@/utils/services/request'

// Conststans
import { API_ROUTES } from '@/utils/constant'

const VerifyTicketPage = () => {

  const [loading, setLoading] = useState(false)

  const verifyTicket = async (id : string) => {
    setLoading(true)
    try {

      const body = {
        "ticketId":  id
      }
      const response = await apiCall({
        endPoint: API_ROUTES.STAFF.VALIDATE_TICKETS,
        method: 'POST',
        body: body
      });

      if (response && response.success) {
        toast.success("Ticket Verified Successully")
      }
    } catch (err) {
      console.error('Error in validating', err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div>
      { loading && <Loader />}

      <QRCodeScanner getScannedQRValues={(id) => verifyTicket(id)} />
        
    </div>
  )
}

export default VerifyTicketPage