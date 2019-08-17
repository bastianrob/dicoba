<style>
  /* Accordion styles */
  .collapse {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }
  .tabs {
    overflow: hidden;
  }
  .tab {
    width: 100%;
    color: white;
    overflow: hidden;
  }
  .tab-label {
    display: flex;
    justify-content: space-between;
    padding: 0.5em 1em;
    background: #343a40;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 0;
    /* Icon */
  }
  .tab-label:hover {
    background: #1a252f;
  }
  .tab-label::after {
    content: "\276F";
    text-align: center;
    transition: all 0.5s;
  }
  .tab-label > a {
    color: inherit;
  }
  .tab-content {
    max-height: 0;
    padding: 0 1em;
    color: #2c3e50;
    background: white;
    transition: all 0s;
    overflow: hidden;
    border: 1px solid #ddd;
  }
  input:checked + .tab-label {
    background: #1a252f;
  }
  input:checked + .tab-label::after {
    transform: rotate(90deg);
  }
  input:checked ~ .tab-content {
    max-height: 100%;
    padding: 1em;
  }

  .form-payload, .form-payload:focus {
    padding: 8px;
    background-color: #333;
    color: wheat;
    font: 14px monospace;
  }

  .del, .save {
    width: 100%;
  }

  .sticky-top {
    position: sticky;
    top: 8px;
  }

  .entry-sep-sm {
    margin: 0 0 1em 0;
    display: block;
  }

  .lbl-hide-sm {display: none}

  .row {margin-bottom: 1em; z-index: 900;}

  h3 {display: inline}

@media (min-width: 576px) {
  .sticky-top {position: relative}
  .entry-sep-sm {display: none}
  .lbl-hide-sm {display: block}
}

@media (min-width: 768px) {
  .del {
    padding: 6px 2px;
  }
}
</style>


<script context="module">
  export async function preload({ params, query }) {
    const id = params.slug
    return {id: id}
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { ScenarioService } from "../../../api.js"
  import Box from "../../../components/layouts/Box.svelte"
  import Slider from "../../../components/inputs/Slider.svelte"

  //id taken from URL param [slug]
  export let id
  export let alert = "display: none;"
  let runner = {expand: false, result: ""}
  let scnService = new ScenarioService()
  let scenario = {}

  function jsonToArrayOfKeyValue(json) {
    if (!json) {
      return []
    }

    let arr = []
    for (let key in json) {
      arr.push({
        key: key,
        value: json[key]
      })
    }

    return arr
  }

  function arrayOfKeyValueToJson(arr) {
    if (!arr || arr.length <= 0) return null

    let obj = {}
    arr.forEach(e => {
      e.key = e.key.trim()
      e.value = e.value.trim()
      if (!e.key || !e.value) return

      obj[e.key] = e.value
    })
    
    return obj
  }

  function scrollToTop() {
    let count = 0
    let tick = window.scrollY / 100
    let myscroll = setInterval(() => {
      count++
      if (count === 100) {
        window.scrollTo(0, 0)
        clearInterval(myscroll)
      } else {
        window.scrollTo(0, (window.scrollY - tick))
      }
    }, 2)
  }

  function deleteTestCase(idx) {
    let tc = scenario.cases[idx]
    let confirmed = confirm("Are you sure you want to delete test case: "+tc.name)
    if (!confirmed) return

    scenario.cases.splice(idx, 1)
    scenario = scenario //re-render
  }

  function emptyScenario() {
    return {
      expand: true,
      name: "",
      environment: "",
      description: "",
      cases: []
    }
  }

  function emptyCase(order) {
    return {
      expand: true,
      order: order,
      name: "",
      description: "",
      request: {
        headers: [],
        method: "",
        url: "",
        payload: ""
      },
      expect: {
        headers: [],
        status_code: 200,
        evaluate: []
      },
      pipeline: {
        cache: true,
        cache_as: "",
        on_failure: "exit"
      }
    }
  }

  function addTestCase() {
    let tc = emptyCase(scenario.cases.length+1)
    scenario.cases.push(tc)

    scenario = scenario //re-render
    setTimeout(() => {
      window.location.hash = "case-" + (scenario.cases.length - 1)
    }, 200);
  }

  async function save() {
    //Deep copy instead of shallow copy like spread operator
    let update = JSON.parse(JSON.stringify(scenario))
    update.cases.forEach(e => {
      e.request.payload = e.request.payload ? JSON.parse(e.request.payload) : null

      e.request.headers = arrayOfKeyValueToJson(e.request.headers)
      e.expect.headers = arrayOfKeyValueToJson(e.expect.headers)
    })

    let res
    if (id === "new") {
      res = await scnService.create(update)
    } else {
      res = await scnService.update(update.id, update)
    }

    if (!res.ok) {
      window.alert("Failed to save")
      return
    }

    let body = await res.json()
    scenario = body.data
    id = scenario.id
    
    scrollToTop()

    alert = "display: block;"
    setTimeout(() => alert = "display: none;", 10000)
  }

  async function run() {
    scenario.expand = false
    runner.expand = true
    setTimeout(() => {
      window.location.hash = "run-result"
    }, 200);

    let res = await scnService.run(scenario.id)
    let body = await res.json()
    if (!res.ok) {
      runner.result += "failed to run scenario"
      console.log(body)
      return
    }

    
    body.data.forEach(str => {
      runner.result += str
    })
  }

  onMount(async () => {
    if (id === "new") {
      scenario = emptyScenario()
      return
    }

    let res = await scnService.get(id)
    if (res.status === 401) {
      window.location = "/"
      return
    } else if (res.status === 403) {
      window.location = "dashboard/settings"
      return
    }

    let body = await res.json()
    if (!res.ok) return

    scenario = body.data
    scenario.expand = true
    scenario.cases.forEach(e => {
      e.request.payload = e.request.payload ? JSON.stringify(e.request.payload, null, 2) : ""
      
      e.request.headers = jsonToArrayOfKeyValue(e.request.headers)
      e.expect.headers = jsonToArrayOfKeyValue(e.expect.headers)
    })
  })
</script>

<svelte:head>
  <title>{scenario.name}</title>
</svelte:head>


<div class="row no-gutters sticky-top">
  <div class="col-md-2"></div>
  <div class="col-md-8">
    <div class="btn-group save">
      {#if id !== "new"}
      <button on:click={run} class="btn btn-secondary">Run</button>
      {/if}
      <button on:click={save} type="button" class="btn btn-primary">Save</button>
    </div>
  </div>
</div>
<div class="row no-gutters">
  <div class="col-md-2">
  </div>
  
  <div class="col-md-8">
    <div class="alert alert-success" role="alert" style={alert}>Successfully saved &check;</div>
    <Box padding="0.5em 1em">
      <h3>Scenario</h3>
    </Box>
    <div class="tabs">
      <div class="tab">
        <input bind:checked={scenario.expand} type="checkbox" id=scenario class="collapse">
        <label class="tab-label" for=scenario>{scenario.name}</label>
        <div class="tab-content">
          <div class="form-group">
            <label>Name</label>
            <input bind:value={scenario.name} type="text" placeholder="Scenario Name" class="form-control">
          </div>
          <div class="form-group">
            <label>Environment</label>
            <input bind:value={scenario.environment} type="text" placeholder="Environment tag" class="form-control">
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea bind:value={scenario.description} class="form-control" rows="2" placeholder="Explain what this test scenario does" />
          </div>
        </div>
      </div>
      {#if id !== "new"}
      <div class="tab">
        <input bind:checked={runner.expand} type="checkbox" id=run class="collapse">
        <label class="tab-label" for=run>
            <a name="run-result" href="dashboard/scenarios/{scenario.id}#run-result">Run Result</a>
          </label>
        <div class="tab-content">
          <textarea bind:value={runner.result} class="form-control form-payload bg-dark" rows=30 wrap="soft" disabled/>
        </div>
      </div>
      {/if}
    </div>

    {#if scenario.cases}
    <Box padding="0.5em 1em">
      <h3>Cases</h3>
      <div class="btn-group float-right">
        <button on:click={addTestCase} class="btn btn-outline-primary">Add Test Case</button>
      </div>
    </Box>
    <!-- Cases -->
    <div class="tabs">
      {#each scenario.cases as test, testIndex}
      <div class="tab">
        <input bind:checked={test.expand} type="checkbox" id=case.{testIndex} class="collapse" >
        <label class="tab-label" for=case.{testIndex}>
          <a name="case-{testIndex+1}" href="dashboard/scenarios/{scenario.id}#case-{testIndex+1}">{testIndex+1}. {test.name}</a>
        </label>
        <div class="tab-content">
          <div class="form-row">
            <div class="form-group col-md-3">
              <label>Order</label>
              <input bind:value={test.order} type="number" placeholder="Test Order" class="form-control">
            </div>
            <div class="form-group col-md-9">
              <label>Name</label>
              <input bind:value={test.name} type="text" placeholder="Test Name" class="form-control">
            </div>
            <div class="form-group col-md-12">
              <label>Description</label>
              <textarea bind:value={test.description} class="form-control" rows="2"
                placeholder="Explain what this test case does"/>
            </div>
          </div>
          <hr>
          <!-- Request object -->
          <h5>Request</h5>
          <strong>Headers</strong>
          {#each test.request.headers as head, idx}
          <div class="form-row">
            <div class="form-group col-sm-3">
              {#if idx === 0}<label class="lbl-hide-sm">Key</label>{/if}
              <input bind:value={head.key} type="text" placeholder="Key" class="form-control">
            </div>
            <div class="form-group col-sm-8">
              {#if idx === 0}<label class="lbl-hide-sm">Value</label>{/if}
              <input bind:value={head.value} type="text" placeholder="Value" class="form-control">
            </div>
            <div class="form-group col-sm-1">
              {#if idx === 0}<label class="lbl-hide-sm">&nbsp;</label>{/if}
              <button on:click="{e => {
                test.request.headers.splice(idx, 1)
                scenario = scenario
              }}" type="button" class="btn btn-outline-danger del">del</button>
            </div>
          </div>
          <hr class="entry-sep-sm">
          {/each}

          <!-- Request headers action -->
          <div class="form-row">
            <div class="form-group col-md-12">
              <div class="btn-group">
                <button on:click="{e => 
                  {
                    test.request.headers.push({key: '', value:''})
                    scenario = scenario //rebind
                  }
                }" type="button" class="btn btn-primary">Add Header</button>
              </div>
            </div>
          </div>

          <strong>Endpoint</strong>
          <div class="form-row">
            <div class="form-group col-md-3">
              <label>Method</label>
              <input bind:value={test.request.method} type="text" placeholder="HTTP Verb" class="form-control text-uppercase">
            </div>
            <div class="form-group col-md-9">
              <label>URL</label>
              <input bind:value={test.request.url} type="text" placeholder="Endpoint URL" class="form-control">
            </div>

            <div class="form-group col-md-12">
              <strong>Payload</strong>
              <textarea bind:value={test.request.payload} class="form-control form-payload" rows=10
                placeholder="JSON Payload" />
            </div>
          </div>

          <hr>
          <!-- Expect -->
          <h5>Expectation</h5>
          <strong>Headers</strong>
          {#each test.expect.headers as head, idx}
          <div class="form-row">
            <div class="form-group col-sm-3">
              {#if idx === 0}<label class="lbl-hide-sm">Key</label>{/if}
              <input bind:value={head.key} type="text" placeholder="Key" class="form-control">
            </div>
            <div class="form-group col-sm-8">
              {#if idx === 0}<label class="lbl-hide-sm">Value</label>{/if}
              <input bind:value={head.value} type="text" placeholder="Value" class="form-control">
            </div>
            <div class="form-group col-sm-1">
              {#if idx === 0}<label class="lbl-hide-sm">&nbsp;</label>{/if}
              <button on:click="{e => {
                test.expect.headers.splice(idx, 1)
                scenario = scenario
              }}" type="button" class="btn btn-outline-danger del">del</button>
            </div>
          </div>
          <hr class="entry-sep-sm">
          {/each}

          <!-- Expect headers action -->
          <div class="form-row">
            <div class="form-group col-md-12">
              <div class="btn-group">
                <button on:click="{e => 
                  {
                    test.expect.headers.push({key: '', value:''})
                    scenario = scenario //rebind
                  }
                }" type="button" class="btn btn-primary">Add Header</button>
              </div>
            </div>
          </div>

          <!-- Evaluation -->
          <strong>Evaluation</strong>
          <div class="form-row">
            <div class="form-group col-md-3">
              <label>Status Code</label>
              <input bind:value={test.expect.status_code} type="number" placeholder="Status Code" class="form-control">
            </div>
          </div>

          <hr class="entry-sep-sm">
          {#each test.expect.evaluate as ev, idx}
          <div class="form-row">
            <div class="form-group col-sm-3">
              {#if idx === 0}<label class="lbl-hide-sm">Evaluation Object</label>{/if}
              <input bind:value={ev.object} type="text" placeholder="Evaluation object path" class="form-control">
            </div>
            <div class="form-group col-sm-2">
              {#if idx === 0}<label class="lbl-hide-sm">Property</label>{/if}
              <input bind:value={ev.prop} type="text" placeholder="Property name" class="form-control">
            </div>
            <div class="form-group col-sm-2">
              {#if idx === 0}<label class="lbl-hide-sm">Operator</label>{/if}
              <select bind:value={ev.operator} type="text" placeholder="Operator" class="form-control">
                <option value=""></option>
                <option value="=">=</option>
                <option value="!=">!=</option>
                <option value="in">IN</option>
                <option value="!in">NOT IN</option>
                <option value=">">&gt;</option>
                <option value=">">&gt;=</option>
                <option value="<">&lt;</option>
                <option value="<=">&lt;=</option>
              </select>
            </div>
            <div class="form-group col-sm-4">
              {#if idx === 0}<label class="lbl-hide-sm">Value</label>{/if}
              <input bind:value={ev.value} type="text" placeholder="Expected value" class="form-control">
            </div>
            <div class="form-group col-sm-1">
              {#if idx === 0}<label class="lbl-hide-sm">&nbsp;</label>{/if}
              <button on:click="{e => {
                test.expect.evaluate.splice(idx, 1)
                scenario = scenario
              }}" type="button" class="btn btn-outline-danger del">del</button>
            </div>
          </div>
          <hr class="entry-sep-sm">
          {/each}

          <!-- Evaluation action -->
          <div class="form-row">
            <div class="form-group col-md-12">
              <div class="btn-group">
                <button on:click="{e => 
                  {
                    test.expect.evaluate.push({object: '', prop: '', operator: '', value:''})
                    scenario = scenario //rebind
                  }
                }" type="button" class="btn btn-primary">Add Evaluation</button>
              </div>
            </div>
          </div>

          <!-- Pipeline -->
          <h5>Pipeline</h5>
          <div class="form-row">
            <div class="form-group col-sm-3">
              <label>Cache Result</label>
              <Slider bind:checked={test.pipeline.cache}></Slider>
            </div>
            <div class="form-group col-sm-6">
              <label>Cache As</label>
              <input bind:value={test.pipeline.cache_as} disabled={!test.pipeline.cache} type="text" placeholder="Cache name" class="form-control">
            </div>
            <div class="form-group col-sm-3">
              <label>On Failure</label>
              <select bind:value={test.pipeline.on_failure} type="text" placeholder="Cache name" class="form-control">
                <option value="exit">Exit</option>
                <option value="fallthrough">Fallthrough</option>
              </select>
            </div>
          </div>

          <!-- Actions -->
          <div class="btn-group float-right">
            <button on:click="{e => test.expand = false}" type="button" class="btn btn-outline-secondary">Collapse</button>
            <button on:click="{e => deleteTestCase(testIndex)}" type="button" class="btn btn-outline-danger">Delete Test Case</button>
          </div>
        </div>
      </div>
      {/each}
    </div>
    {/if}
  </div>
</div>
