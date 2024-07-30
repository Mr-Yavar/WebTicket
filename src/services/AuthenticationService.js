import API_BASE_URL from '@/config/appConfig.js'

async function registerService(userData) {
    let res = await fetch(API_BASE_URL + '/api/authentication/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })

    if (res.status === 201) return await res.text()
    else throw new Error(await res.text())
}

async function loginService(userLoginData) {
    let res = await fetch(API_BASE_URL + '/api/authentication/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLoginData)
    })

    if (res.status === 200) return await res.text()
    else throw new Error(await res.text())
}

export { registerService, loginService }
