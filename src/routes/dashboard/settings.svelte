<style>
  .input-group-table {margin-bottom: 1em;}

  .input-group input {
    border-top: 0 solid #ced4da;
    border-bottom: 0 solid #ced4da;
    border-radius: 0 solid #ced4da;
  }

  .input-group button {
    border-top-width: 0;
    border-bottom-width: 0;
    border-radius: 0;
  }

  /* First child input of input group form should have no bottom radius & border*/
  .input-group-table .input-group:first-child input,
  .input-group-table .input-group:first-child button {
    border-top-width: 1px;
  }

  .input-group-table .input-group:first-child input:first-child {
    border-top-left-radius: 4px;
  }
  
  .input-group-table .input-group:first-child .input-group-append button {
    border-top-right-radius: 4px;
  }

  /* Middle child input of input group form should have both top & bottom border*/
  .input-group-table .input-group:not(:first-child) input,
  .input-group-table .input-group:not(:first-child) button {
    border-top-width: 1px;
  }

  /* Last child input of input group form should have no top radius & border*/
  .input-group-table .input-group:last-child input,
  .input-group-table .input-group:last-child button {
    border-bottom-width: 1px;
  }
  .input-group-table .input-group:last-child input:first-child {
    border-bottom-left-radius: 4px;
  }
  
  .input-group-table .input-group:last-child .input-group-append button {
    border-bottom-right-radius: 4px;
  }
</style>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<script>
  import { onMount } from 'svelte';
  import { CredentialService, OrganizationService } from "../../api/index.js"
  import Box from "../../components/layouts/Box.svelte"
  import Collapse from "../../components/layouts/Collapse.svelte"

  let orgService = new OrganizationService()
  let credService = new CredentialService()
  let first_setup = true
  let org_name = ""
  let org_alias = ""
  let invite_mail = ""  
  
  let users = []
  let endpoints = []
  let environments = []

  function addEndpoint() {
    endpoints.push({name: "", url: ""})
    endpoints = endpoints
  }

  function addEnvironment() {
    environments.push({name: "", value: "", checked: false})
    environments = environments
  }

  async function inviteOther() {
    let res = await credService.register(invite_mail, "", "", {org: org_alias})
    if (!res.ok) {
      window.alert(`Failed to invite '${invite_mail}'`)
      return
    }

    users.push(invite_mail)
    users = users
    invite_mail = ""

    await submit()
  }

  async function create() {
    let confirmed = window.confirm("Organization name can't be changed once saved. Proceed?")
      if (!confirmed) return

      let res = await orgService.create(org_name)
      if (res.status === 409) {
        window.alert("Organization name already taken")
        return
      } else if (!res.ok) {
        window.alert("Failed to save settings")
        return
      }

      let body = await res.json()
      let alias = body.data.alias

      res = await credService.setClaims({org: alias})
      if (!res.ok) {
        window.alert("Failed to save settings")
        return
      }

      org_alias = alias
      first_setup = false
      window.alert("Saved")
  }

  async function submit() {
    let org = {
      users: users,
      endpoints: endpoints,
      environments: environments
    }

    if (first_setup) create()
    else {
      let res = await orgService.update(org)
      if (!res.ok) {
        window.alert("Failed to save settings")
        return
      }
      window.alert("Saved")
    }
  }

  onMount(async () => {
    let res = await orgService.get()
    if (res.status === 401) {
      window.location = "/"
      return
    }

    if (!res.ok) return

    let body = await res.json()
    org_alias = body.data.alias
    org_name = body.data.name
    first_setup = !org_name

    users = body.data.users ? body.data.users : []
    endpoints = body.data.endpoints ? body.data.endpoints : []
    environments = body.data.environments ? body.data.environments : []
  })
</script>

<div class="row no-gutters">
  <div class="col-md-2"></div>
  <div class="col-md-8">
    <Collapse expand="true" id="org" caption="Settings">
      <div class="form-group">
        <label>Organization</label>
        <input bind:value={org_name} disabled={!first_setup} type="text" placeholder="Your Organization Name" class="form-control">
      </div>
    </Collapse>

    <Collapse expand="true" id="users" caption="Users">

      {#each users as email}
      <label>{email}</label><br>
      {/each}

      <div class="input-group-table">
        <div class="input-group">
          <input bind:value={invite_mail} type="email" placeholder="Work email" class="form-control">
          <div class="input-group-append">
            <button on:click={inviteOther} class="btn btn-outline-primary">Invite</button>
          </div>
        </div>
      </div>
    </Collapse>

    <Collapse expand="true" id="epd" caption="Endpoints">
      <div class="input-group-table">
        {#each endpoints as entry, idx}
        <div class="input-group">
          <input bind:value={entry.name} type="text" placeholder="Name" class="form-control">
          <input bind:value={entry.url} type="text" placeholder="URL" class="form-control">
          <div class="input-group-append">
            <button on:click="{e => {
              endpoints.splice(idx, 1)
              endpoints = endpoints
            }}" class="btn btn-outline-danger">del</button>
          </div>
        </div>
        {/each}
      </div> 
      <div class="btn-group float-right">
        <button on:click={addEndpoint} class="btn btn-outline-primary">Add New</button>
      </div>
    </Collapse>
    <!-- Environment -->
    <Collapse expand="true" id="env" caption="Environment Variables">
      <div class="input-group-table">
        {#each environments as entry, idx}
        <div class="input-group">
          <input bind:value={entry.name} type="text" placeholder="Name" class="form-control">
          <input bind:value={entry.value} type="text" placeholder="Value" class="form-control">
          <div class="input-group-append">
            <button on:click="{e => {
              environments.splice(idx, 1)
              environments = environments
            }}" class="btn btn-outline-danger">del</button>
          </div>
        </div>
        {/each}
      </div> 
      <div class="btn-group float-right">
        <button on:click={addEnvironment} class="btn btn-outline-primary">Add New</button>
      </div>
    </Collapse>
    <!-- Submit -->
    <Box>
      <div class="btn-group float-right">
          <button on:click={submit} class="btn btn-primary">Submit</button>
      </div>
    </Box>
  </div>
  <div class="col-md-2"></div>
</div>