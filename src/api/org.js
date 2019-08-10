"use strict"

const baseUrl = process.env.RESTSUITE_HOST

export default class OrganizationService {
    async create(name) {
        let res = await fetch(baseUrl + "/v1/org?org="+name, {
            method: "POST",
            credentials: "include"
        })

        return res
    }

    async get() {
        let res = await fetch(baseUrl + "/v1/org", {
            method: "GET",
            credentials: "include"
        })

        return res
    }

    async update(org) {
        let res = await fetch(baseUrl + "/v1/org", {
            method: "PATCH",
            credentials: "include",
            body: JSON.stringify(org)
        })

        return res
    }
}