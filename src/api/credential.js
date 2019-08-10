"use strict"

const baseUrl = process.env.CRED_HOST

export default class CredentialService {
    async setClaims(obj) {
        let res = await fetch(baseUrl + "/oauth/claims", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(obj)
        })

        return res
    }

    async login(user, pass) {
        let res = await fetch(baseUrl + "/oauth/login", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                email: user,
                password: pass
            })
        })

        return res
    }

    async logout(user, pass) {
        let res = await fetch(baseUrl + "/oauth/logout", {
            method: "GET",
            credentials: "include"
        })

        return res
    }

    async register(user, pass, confirm) {
        let res = await fetch(baseUrl + "/oauth/register", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                email: user,
                password: pass,
                confirm_password: confirm
            })
        })

        return res
    }
}