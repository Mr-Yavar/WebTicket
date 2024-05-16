import API_BASE_URL from "@/config/appConfig.js";

async function registerService(userData){

    let res = await fetch(API_BASE_URL+'/api/authentication/register',{
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(userData)
    });


    if(res.ok)
        return await res.text();

    return false;
}

export {registerService};