"use client"

import React, { useState, useEffect } from "react";
import {
    useStripe,
    useElements,
    PaymentElement
} from "@stripe/react-stripe-js";
import { convertToSubCurrency } from "@/app/events/event-helper";
import Loader from "../common/Loader";

const CheckoutPage = ({amount}:{amount:number})=>{
    const stripe = useStripe();
    const elements = useElements();
    const [error,setError] = useState<string>();
    const [clientSecret,setClientSecret] = useState("");
    const [loading,setLoading] = useState(false);
    
    useEffect(()=>{
        fetch("/api/create-payment-intent",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify({amount:convertToSubCurrency(amount,100)})
        }).then((res)=>res.json()).then((data)=>setClientSecret(data.clientSecret))
    },[amount])

    const handleSubmit=async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        setLoading(true);
        if(!stripe || !elements){
            return;
        }
        const {error:submitError} = await elements.submit();
        if(submitError){
            setError(submitError.message);
            setLoading(false);
            return;
        }

        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams:{
                return_url:`${process.env.NEXT_PUBLIC_APP_URL}/payment-success?amount=${amount}`,
            },
        })
        setLoading(false);
    }
    if(!clientSecret || !stripe || !elements){
        return (
            <Loader/>
        )
    }
    return (
        <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
            {clientSecret && <PaymentElement />}
            {error && <div>{error}</div>}
            <button disabled={!stripe || loading} className="text-white w-full p-5 bg-blue-600 hover:bg-blue-700 mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse">
                {!loading ? `Pay $${amount}`:"Processing..."}
            </button>
        </form>
    )
}
export default CheckoutPage;