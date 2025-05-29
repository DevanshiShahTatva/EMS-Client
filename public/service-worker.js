// const CACHE_NAME = "evently-app-v4";
// const TICKET_CACHE = "ticket-cache-v2";
// const OFFLINE_PAGES = [
//     "/login",
//     "/events",
//     "/user/my-events",
// ]

// const STATIC_ASSETS = [
//     "/",
//     "/login",
//     "/events",
//     "/user/my-events",
//     "/_next/static",
//     "/_next/image"
// ]
// self.addEventListener("install",(event)=>{
//     self.skipWaiting();
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache)=>{
//             return cache.addAll(OFFLINE_PAGES);
//         })
//     );
// });

// self.addEventListener("activate",(event)=>{
//     event.waitUntil(self.clients.claim())
// })

// self.addEventListener("fetch",(event)=>{
//     if(request.url.includes("/_next/") || request.url.includes("/static/")){
//         return;
//     }
//     if(STATIC_ASSETS.some(path=>event.request.url.includes(path))){
//         event.respondWith(
//             caches.match(event.request).then((cached)=>{
//                 return cached || fetch(event.request).then(res=>{
//                     return caches.open(CACHE_NAME).then(cache=>{
//                         cache.put(event.request,res.clone());
//                         return res;
//                     })
//                 })
//             })
//         )
//     }
//     if(request.destination ==="style" || request.destination === "script"){
//         event.respondWith(
//             caches.match(request).then((cached)=>{
//                 return cached || fetch(request).then((response)=>{
//                     const resClone = response.clone();
//                     caches.open(CACHE_NAME).then((cache)=>cache.put(request.url,resClone));
//                     return response;
//                 })
//             })
//         );
//     }
// })
// self.addEventListener("fetch",(event)=>{
//     const { request } = event;
//     if(request.method !== "GET") return;

//     if(request.url.includes("/ticket/book")){
//         return event.respondWith(
//             fetch(request).then((response)=>{
//                 const resClone = response.clone();
//                 caches.open(TICKET_CACHE).then((cache)=>{
//                     cache.put(request.url,resClone);
//                 });
//             }).catch(()=>{
//                 return new Response("Offline ticket booking not supported.",{status:503});
//             })
//         );
//     }
//     if(OFFLINE_PAGES.some((path)=> request.url.includes(path))){
//         event.respondWith(
//             caches.match(request).then((cached)=>{
//                 return cached || fetch(request).catch(()=>new Response("Offline",{status:503}));
//             })
//         )
//     }
//     if(/^\/events\/[^/]+$/.test(url.pathname)){
//         event.respondWith(
//             caches.match(request).then((cached)=>{
//                 if(cached) return cached;
//                 return fetch(request).then((response)=>{
//                     const resClone = response.clone();
//                     caches.open(TICKET_CACHE).then((cache)=> cache.put(request.url,resClone));
//                     return response;
//                 }).catch(()=>{
//                     return new Response("Offline: Event or ticket detail not cached",{status:503});
//                 });
//             })
//         )
//         return;
//     }
//     event.respondWith(
//         fetch(request).catch(()=>caches.match(request))
//     );
// });

// // const cacheNames = caches.keys();
// // Promise.all(
// //     cacheNames.map((name)=>{
// //         if(name !== CACHE_NAME && name !== TICKET_CACHE){
// //             return caches.delete(name);
// //         }
// //     })
// // );

const installEvent=()=>{
    self.addEventListener('install',()=>{
        console.log('Service worker installed');
    })
};
installEvent();

const activateEvent=()=>{
    self.addEventListener('activate',()=>{
        console.log('Service Worker activated');
    })
};
activateEvent();

const cacheName = "evently-v1"

const cacheClone = async(e)=>{
    const res = await fetch(e.request);
    const resClone = res.clone();
    const cache = await caches.open(cacheName);
    await cache.put(e.request,resClone);
    return res;
}

const fetchEvent=()=>{
    self.addEventListener('fetch',(e)=>{
        e.respondWith(
            cacheClone(e)
            .catch(()=>caches.match(e.request))
            .then((res)=>res)
        );
    });
};
fetchEvent();