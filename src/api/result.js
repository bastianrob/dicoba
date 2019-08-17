"use strict"

const baseUrl = process.env.RESTSUITE_HOST

export default class ResultService {
  async find(time, skip = 0, limit = 25) {
    return fetch(`${baseUrl}/v1/results?time=${time}&skip=${skip}&limit=${limit}`, {
      method: "GET",
      credentials: "include"
    })
  }
}