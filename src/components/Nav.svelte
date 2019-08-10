<style>
  .active {
    font-weight: bold;
    text-transform: capitalize;
  }

  .navbar {
    margin-bottom: 1em
  }
</style>

<script>
  import CredentialService from "../api/credential.js"
  export let segment;

  let credSvc = new CredentialService()

  $: isActive = function (current) {
    if (!current) return

    return current.includes(segment) ? "active" : ""
  }

  function logout() {
    credSvc.logout()
  }
</script>

<nav class="navbar navbar-expand navbar-dark bg-dark">
  <ul class="navbar-nav mr-auto">
    <li class="nav-item {isActive('settings')}">
      <a class="nav-link" href="dashboard/settings">Settings</a>
    </li>
    <li class="nav-item {isActive('scenarios')}">
      <a class="nav-link" href="dashboard/scenarios">Scenarios</a>
    </li>
  </ul>
  <ul class="navbar-nav">
    <li class="nav-item">
      <a on:click={logout} class="nav-link" href=".">Logout</a>
    </li>
  </ul>
</nav>