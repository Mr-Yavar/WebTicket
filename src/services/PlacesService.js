import API_BASE_URL from "@/config/appConfig.js";

export async function GetAllPlacesService(){

    let res = await fetch(API_BASE_URL+'/api/place/GetAllPlaces',{
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "api-version" : "1.0"
        }

    });

    return await res.json();

}

export async function CRPlacesService(data){


    let res = await fetch(API_BASE_URL+data.url,{
        ...data
    });

    if(res.ok){
        return await res.json();
    }else{
        throw new Error('Error occurred while fetching PlacesService');
    }

}

export async function GetPlaceService(id){

    let res = await fetch(API_BASE_URL+'/api/place/GetPlace?id='+id,{
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "api-version" : "1.0"
        }

    });

    return await res.json();

}


export async function GetHallsService(placeId){
    let res = await fetch(API_BASE_URL+'/api/Place/GetHallsByPlaceId?placeId='+placeId,{
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "api-version" : "1.0"
        }

    });

    return await res.json();
}

export async function GetHallService(hallId){
    let res = await fetch(API_BASE_URL+'/api/Place/GetHallById?Id='+hallId,{
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "api-version" : "1.0"
        }

    });

    return await res.json();
}