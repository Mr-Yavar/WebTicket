import API_BASE_URL, { FILE_PROVIDER2 } from '@/config/appConfig.js'

export async function GetAllConcertService() {
    let res = await fetch(API_BASE_URL + '/api/Concerts/GetAllConcerts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-version': '1.0'
        }
    })

    return await res.json()
}

export async function GetSpecificConcertService(data) {
    let res = await fetch(API_BASE_URL + '/api/Concerts/GetSpecificConcert/' + data.queryKey[1], {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-version': '1.0'
        }
    })

    return await res.json()
}

export async function GetSpecificEventService(data) {
    let res = await fetch(API_BASE_URL + '/api/Concerts/GetSpecificEvent/' + data.queryKey[1], {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-version': '1.0'
        }
    })

    return await res.json()
}

export async function GetSeatMapService(fileName) {
    let res = await fetch(FILE_PROVIDER2 + fileName, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-version': '1.0'
        }
    })

    return await res.text()
}
