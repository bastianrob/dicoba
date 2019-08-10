<svelte:head>
  <title>Login</title>
</svelte:head>

<script>
  import { CredentialService } from "../api/index.js"
  import Box from "../components/layouts/Box.svelte"

  const CRED_HOST = proces.env.CRED_HOST
  let service = new CredentialService()
  let cred = {username:"", password: ""}

  async function login() {
    var res = await service.login(cred.username, cred.password)
    if (!res.ok) {
      window.alert("NOT OK")
    }
  }

  async function register() {
    var res = await service.register(cred.username, cred.password, cred.password)
    if (!res.ok) {
      window.alert("NOT OK")
    }
  }

  async function claims() {
    var res = await service.setClaims({"org": "restify"})
    if (!res.ok) {
      window.alert("NOT OK")
    }
  }
</script>

<div class="row">
  <div class="col-md-4"></div>
  <div class="col-md-4">
    <div class="card">
      <div class="card-body">
        <form>
          <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="email" placeholder="Enter email" autocomplete="username"
              bind:value={cred.username}>
          </div>
          <div class="form-group">
            <label for="pass">Password</label>
            <input type="password" class="form-control" id="pass" placeholder="Password" autocomplete="current-password"
              bind:value={cred.password}>
          </div>
          <button type="submit" class="btn btn-primary"
            on:click|preventDefault={login}>Login</button>
          <a href="{CRED_HOST}/oauth/google/login" class="btn btn-danger">
            Google</a>
        </form>
      </div>
    </div>
  </div>
  <div class="col-md-4"></div>
</div>