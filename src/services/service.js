import API_BASE_URL from '@/config/appConfig'

export async function sendRequest(data) {
    console.log(data)
    let res = await fetch(API_BASE_URL + data.url, {
        ...data
    })

    if (res.ok) {
        return await res.json();
    } else {
        throw new Error(await res.text());
    }
}

export async function getFile(data) {
    let res = await fetch((!data.baseUrl ? API_BASE_URL : data.baseUrl) + data.url, {
        ...data
    })

    if (res.ok) {
        return await res.blob()
    }
}
