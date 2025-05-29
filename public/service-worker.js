const CACHE_NAME = "evently-v1"

async function cacheCoreAssets(){
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll([
        "/",
        "/login",
        "/events",
        "/assets/eventlyLogo1.png",
    ]);
}

async function clearOldCaches(){
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.filter((name)=>name !==CACHE_NAME)
        .map((name)=>caches.delete(name))
    )
}

async function dynamicCaching(request){
    const cache = await caches.open(CACHE_NAME);

    try{
        const response = await fetch(request);
        const responseClone = response.clone();
        await cache.put(request,responseClone);
        return response;
    }catch(error){
        console.error("Dynamic caching failed:",error);
        return caches.match(request);

    }
}

self.addEventListener('install',(event)=>{
    event.waitUntil(cacheCoreAssets()); 
    console.log("Service worker installed")
    self.skipWaiting();    //ensures that new service worker activates immediately after installation
})


self.addEventListener('activate',(event)=>{
    event.waitUntil(clearOldCaches());
    self.clients.claim(); //ensures that the new service worker takes control of all pages as soon as its activates
    console.log('Service Worker activated');
})

//Creating Indexed DB for Caching API Requests


const DB_NAME = "EventlyCacheDB";
const DB_VERSION = 1;
const DB_STORE_NAME = "eventlyStore";

function openDb(){
    return new Promise((resolve,reject)=>{
        const request = indexedDB.open(DB_NAME,DB_VERSION);
        request.onsuccess = ()=> resolve(request.result);
        request.onerror = ()=> reject(request.error);
        request.onupgradeneeded=(event)=>{
            const db = event.target.result;
            db.createObjectStore(DB_STORE_NAME,{keyPath:"url"});
        }
    })
}

async function addData(url,jsonData){
    const db = await openDb();
    const transaction = db.transaction(DB_STORE_NAME,"readwrite");
    const store = transaction.objectStore(DB_STORE_NAME);

    const data = {
        url,
        response:JSON.stringify(jsonData),
    }
    const request = store.put(data);
    await new Promise((resolve,reject)=>{
        request.onsuccess = ()=>resolve();
        request.onerror = ()=>reject(request.error);
    })
}

async function getData(url){
    try{
        const db = await openDb();
        const transaction = db.transaction(DB_STORE_NAME,"readonly");
        const store = transaction.objectStore(DB_STORE_NAME);

        const request = store.get(url);
        const result = await new Promise((resolve,reject)=>{
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        })
        if(result && result.response){
            return JSON.parse(result.response);
        }
        return null;
    } catch(error){
        console.error("Error retrieving from IndexedDB:",error);
        return null;
    }
}

async function cacheFirstStrategy(request){
    try{
        const cache = await caches.open(CACHE_NAME);
        const cacheResponse = await cache.match(request);
        if(cacheResponse){
            return cacheResponse;
        }
        const networkResponse = await fetch(request);
        const responseClone = networkResponse.clone();
        await cache.put(request,responseClone);
        return networkResponse;
    } catch(error){
        console.error("Cache first strategy failed:",error);
        return caches.match("/offline");
    }
}

async function networkFirstStrategy(request){
    try{
        const networkResponse = await fetch(request);
        if(networkResponse.ok){
            const responseClone = networkResponse.clone();
            const responseData = await responseClone.json();
            await addData(request.url,responseData);
            return networkResponse;
        }
        throw new Error("Network response was not ok");
    } catch(error){
        console.error("Network first strategy failed:",error);
        const cachedResponse = await getData(request.url);
        if(cachedResponse){
            console.log("Using cached response",cachedResponse);
            return new Response(JSON.stringify(cachedResponse),{
                status:200,
                headers:{"Content-Type":"application/json"},
            })
        }
        return new Response("[]",{status:200});
    }
}

self.addEventListener("fetch",(event)=>{
    const { request } = event;
    const url = new URL(request.url);
    if(url.origin === "https://localhost:3000/events"){
        event.respondWith(networkFirstStrategy(request));
    } else if(event.request.mode === "navigate"){
        event.respondWith(cacheFirstStrategy(request));
    } else {
        event.respondWith(dynamicCaching(request));
    }
})