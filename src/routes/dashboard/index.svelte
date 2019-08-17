<style>
  .input-group-table {margin-bottom: 1em;}

  .input-group-table .input-group-text {
    min-width: 5rem;
  }

  .input-group-table input[type=number] {
    text-align: right;
  }

  .input-group-table input[disabled] {
    background-color: white;
  }

  .input-group input, .input-group .input-group-text {
    border-top: 0 solid #ced4da;
    border-bottom: 0 solid #ced4da;
    border-radius: 0 solid #ced4da;
  }

  .input-group span {
    border-top-width: 0;
    border-bottom-width: 0;
    border-radius: 0;
  }

  /* First child input of input group form should have no bottom radius & border*/
  .input-group-table .input-group:first-child input,
  .input-group-table .input-group:first-child span {
    border-top-width: 1px;
  }

  .input-group-table .input-group:first-child input:first-child,
  .input-group-table .input-group:first-child span:first-child {
    border-top-left-radius: 4px;
  }
  
  .input-group-table .input-group:first-child .input-group-append span {
    border-top-right-radius: 4px;
  }

  /* Middle child input of input group form should have both top & bottom border*/
  .input-group-table .input-group:not(:first-child) input,
  .input-group-table .input-group:not(:first-child) span {
    border-top-width: 1px;
  }

  /* Last child input of input group form should have no top radius & border*/
  .input-group-table .input-group:last-child input,
  .input-group-table .input-group:last-child span {
    border-bottom-width: 1px;
  }
  .input-group-table .input-group:last-child input:first-child,
  .input-group-table .input-group:last-child span:first-child {
    border-bottom-left-radius: 4px;
  }
  
  .input-group-table .input-group:last-child .input-group-append span {
    border-bottom-right-radius: 4px;
  }

  .card {
    font-size: .8em;
  }
  
  .card-text {
    word-break: break-all;
  }

  .card:not(:last-child) {
    margin-bottom: 1em;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { ResultService } from "../../api/index.js"
  import Collapse from "../../components/layouts/Collapse.svelte"

  let resService = new ResultService()
  let page = 1
  let rpp = 25

  let selected_date = "today"
  let datasource = []
  let summary = {}


  function summarise(acc, cur) {
    acc.count += 1
    if (cur.expected_code === cur.response_code &&
        cur.message.toLowerCase().includes("success")) {
      acc.success += 1
    } else {
      acc.failure += 1
    }
    
    if (cur.response_size === -1) {
      cur.response_size = 0
    }
    
    acc.sum_response_size += cur.response_size
    acc.min_response_size = acc.min_response_size < cur.response_size ? acc.min_response_size : cur.response_size
    acc.max_response_size = acc.max_response_size > cur.response_size ? acc.min_response_size : cur.response_size
    acc.avg_response_size = acc.sum_response_size / acc.count
    
    acc.sum_response_time += cur.timing_total
    acc.min_response_time = acc.timing_total < cur.timing_total ? acc.timing_total : cur.timing_total
    acc.max_response_time = acc.timing_total > cur.timing_total ? acc.timing_total : cur.timing_total
    acc.avg_response_time = acc.sum_response_time / acc.count
    
    return acc
  }

  function zerosum() {
    return {
      count: 0,
      success: 0,
      failure: 0,
      
      //in bytes
      min_response_size: 0,
      avg_response_size: 0,
      max_response_size: 0,
      sum_response_size: 0,
      
      //in nanosecond
      min_response_time: 0,
      avg_response_time: 0,
      max_response_time: 0,
      sum_response_time: 0,
    }
  }

  function getStartTime() {
    let start = new Date();
    start.setHours(0, 0, 0, 0);

    switch(selected_date) {
      case "yesterday":
        start.setDate(start.getDate() - 1)
        break
      case "last 7 days":
        start.setDate(start.getDate() - 6)
        break
      case "this week":
        break
      case "last week":
        break
    }

    return start
  }

  function getEndTime() {
    let end = new Date();
    end.setHours(23, 59, 59, 999);

    switch(selected_date) {
      case "yesterday":
        end.setDate(end.getDate() - 1)
        break
      case "last 7 days":
        break
      case "this week":
        break
      case "last week":
        break
    }
    return end
  }

  function onDateChanged() {
    console.log(selected_date)
    page = 1
    bind()
  }

  async function bind() {
    let start = getStartTime()
    let end = getEndTime()

    let skip = page - 1
    let limit = rpp
    let res = await resService.find(`${start.getTime()},${end.getTime()}`, skip, limit)
    if (res.status === 401) {
      window.location = "/"
      return
    } else if (res.status === 403) {
      window.location = "dashboard/settings"
      return
    }

    if (!res.ok) {
      window.alert("Failed")
      return
    }

    let body = await res.json()
    body.data.sort((a,b) => {
      //Ascending sort by timestamp
      return a.timestamp - b.timestamp
    })

    datasource = body.data
    summary = datasource.reduce(summarise, zerosum())
  }

  onMount(bind)
</script>

<div class="row no-gutters">
  <div class="col-md-2"></div>
  <div class="col-md-8">
    <Collapse expand=true id=summary caption=Summary anchor="summary" href="dashboard#summary">
      <select bind:value={selected_date} on:change={onDateChanged} type="text" class="form-control">
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="last 7 days">Last 7 Days</option>
        <!-- Not yet implemented -->
        <!-- <option value="this week">This Week</option>
        <option value="last week">Last Week</option> -->
      </select><br>

      <strong>Test Cases</strong>
      <div class="input-group-table">
        <div class="input-group input-group-sm">
          <div class="input-group-prepend">
            <span class="input-group-text">Count</span>
          </div>
          <input value={summary.count} type="number" class="form-control" disabled>
          <div class="input-group-append">
            <span class="input-group-text">cases</span>
          </div>
        </div>
        <div class="input-group input-group-sm">
          <div class="input-group-prepend">
            <span class="input-group-text">Success</span>
          </div>
          <input value={summary.success} type="number" class="form-control" disabled>
          <div class="input-group-append">
            <span class="input-group-text">cases</span>
          </div>
        </div>
        <div class="input-group input-group-sm">
          <div class="input-group-prepend">
            <span class="input-group-text">Failure</span>
          </div>
          <input value={summary.failure} type="number" class="form-control" disabled>
          <div class="input-group-append">
            <span class="input-group-text">cases</span>
          </div>
        </div>
      </div>
        
      <div class="row">
        <div class="col-md-6">
          <strong>Response Size</strong>
          <div class="input-group-table">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">Total</span>
              </div>
              <input value={summary.sum_response_size} type="number" class="form-control" disabled>
              <div class="input-group-append">
                <span class="input-group-text">bytes</span>
              </div>
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">Min</span>
              </div>
              <input value={summary.min_response_size} type="number" class="form-control" disabled>
              <div class="input-group-append">
                <span class="input-group-text">bytes</span>
              </div>
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">Max</span>
              </div>
              <input value={summary.max_response_size} type="number" class="form-control" disabled>
              <div class="input-group-append">
                <span class="input-group-text">bytes</span>
              </div>
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">Average</span>
              </div>
              <input value={summary.avg_response_size} type="number" class="form-control" disabled>
              <div class="input-group-append">
                <span class="input-group-text">bytes</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <strong>Response Timing</strong>
          
          <div class="input-group-table">
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">Total</span>
              </div>
              <input value="{summary.sum_response_time / 1000000}" type="number" class="form-control" disabled>
              <div class="input-group-append">
                <span class="input-group-text">msec</span>
              </div>
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">Min</span>
              </div>
              <input value="{summary.min_response_time / 1000000}" type="number" class="form-control" disabled>
              <div class="input-group-append">
                <span class="input-group-text">msec</span>
              </div>
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">Max</span>
              </div>
              <input value="{summary.max_response_time / 1000000}" type="number" class="form-control" disabled>
              <div class="input-group-append">
                <span class="input-group-text">msec</span>
              </div>
            </div>
            <div class="input-group input-group-sm">
              <div class="input-group-prepend">
                <span class="input-group-text">Average</span>
              </div>
              <input value="{summary.avg_response_time / 1000000}" type="number" class="form-control" disabled>
              <div class="input-group-append">
                <span class="input-group-text">msec</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Collapse>
  </div>
  <div class="col-md-2"></div>
</div>

<div class="row no-gutters">
  <div class="col-md-2"></div>
  <div class="col-md-8">
    <Collapse expand=true id=datasource caption=Results anchor="results" href="dashboard#results">
      {#each datasource as entry, idx}
      <div class="card">
        <div class="card-header">
          <strong>{entry.scenario_name}: {entry.test_case_order+1}. {entry.test_case_name}</strong>
          <strong class="float-right">{#if entry.message.toLowerCase().includes("success")}&check;{:else}&#x2715;{/if}</strong>
        </div>
        <div class="card-body">
          <p class="card-text">[{entry.request_method}] {entry.request_url}</p>
          <p class="card-text">Expected code: {entry.expected_code}<br>Response code: {entry.response_code}</p>
          <p class="card-text">Response size: {entry.response_size}bytes<br>Response time: {entry.timing_total/1000000}ms</p>
          <p class="card-text">Case {entry.message}</p>
        </div>
        <div class="card-footer text-muted">
          {new Date(entry.timestamp/1000000)}
        </div>
      </div>
      {/each}
    </Collapse>
  </div>
  <div class="col-md-2"></div>
</div>