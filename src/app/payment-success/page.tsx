
import { Suspense } from 'react'
import PaymentSuccessPage from '@/components/events-components/PaymentsPage'

const PaymentSuccess = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <PaymentSuccessPage
        />
    </Suspense>
  )
}

export default PaymentSuccess
