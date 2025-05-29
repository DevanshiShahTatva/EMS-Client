'use client'
import { useEffect } from 'react';
export default function ServiceWorkerRegister(){
    useEffect(()=>{
        if('serviceWorker' in navigator){
            navigator.serviceWorker.register('/service-worker.js').then((registeration)=>{
                console.log("Service Worker Registered! Scope is",registeration.scope);
            }).catch(err=>console.error('Service worker failed',err));
        }
    },[])
    return null;
}