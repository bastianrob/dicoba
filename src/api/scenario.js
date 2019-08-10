"use strict"

const baseUrl = process.env.RESTSUITE_HOST

export default class ScenarioService {
  async create(scenario) {
    let res = await fetch(baseUrl + "/v1/scenarios", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(scenario)
    })

    return res
  }

  async find() {
    let res = await fetch(baseUrl + "/v1/scenarios", {
      method: "GET",
      credentials: "include"
    })

    return res
  }

  async get(id) {
    let res = await fetch(baseUrl + "/v1/scenarios/" + id, {
      method: "GET",
      credentials: "include"
    })

    return res
  }

  async run(id) {
    let res = await fetch(baseUrl + "/v1/scenarios/" + id, {
      method: "RUN",
      credentials: "include"
    })

    return res
  }

  async update(id, scenario) {
    let res = await fetch(baseUrl + "/v1/scenarios/" + id, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(scenario)
    })

    return res
  }
}