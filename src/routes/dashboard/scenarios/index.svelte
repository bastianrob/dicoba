<style></style>

<script>
  import { onMount } from 'svelte';
  import { ScenarioService } from "../../../api/index.js"
  import Box from "../../../components/layouts/Box.svelte"
  import Collapse from "../../../components/layouts/Collapse.svelte"

  let scnService = new ScenarioService()
  let scenarios = []

  onMount(async () => {
    let res = await scnService.find()
    if (res.status === 401) {
      window.location = "/"
      return
    } else if (res.status === 403) {
      window.location = "dashboard/settings"
      return
    }
    
    if (!res.ok) return

    let body = await res.json()
    scenarios = body.data
  })
</script>

<svelte:head>
	<title>Scenarios</title>
</svelte:head>

<div class="row no-gutters">
  <div class="col-md-2"></div>
  <div class="col-md-8">
    <Collapse expand="true" id="scenario" caption="Scenario">
      {#each scenarios as scenario}
      <a href="dashboard/scenarios/{scenario.id}">{scenario.name}, {scenario.cases.length} test cases</a>
      {/each}
      <hr>
      <div class="btn-group float-right">
        <a href="dashboard/scenarios/new" class="btn btn-outline-primary">Add New Scenario</a>
      </div>
    </Collapse>
  </div>
</div>