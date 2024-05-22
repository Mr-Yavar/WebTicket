import API_BASE_URL from "@/config/appConfig.js";

export async function GetAllConcertService(){

    let res = await fetch(API_BASE_URL+'/api/Concerts/GetAllConcerts',{
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "api-version" : "1.0"
        }

    });



    return await res.json();



}


export async function GetSpecificConcertService(data){

    let res = await fetch(API_BASE_URL+'/api/Concerts/GetSpecificConcert/'+data.queryKey[1],{
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "api-version" : "1.0"
        }

    });



    return await res.json();

}