<style>
:root {
  --color-bg: white;
  --color-bg-alt: #eeeeee;
  --color-tx: black;
}

[theme=dark] {
  --color-bg: #2e2e2e;
  --color-bg-alt: #3f3f3f;
  --color-tx: #ffffff;
}

[theme=light] {
  --color-bg: #ffffff;
  --color-bg-alt: #eeeeee;
  --color-tx: #000000;
}

.align-left {text-align: left}
.align-center {text-align: center}
.align-right {text-align: right}

.wrapper {
  max-width: 100%;
  /* overflow-x: scroll; */
  position: relative;
}

table {
  position: relative;
  white-space: nowrap;
  width: max-content;
  background-color: var(--color-bg-tx);
  color: var(--color-tx);
  border: 1px solid var(--color-tx);
  -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.75);
  box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.75);
}

thead > tr:last-child > th {
  border-bottom: 1px solid var(--color-tx);
}

th {
  top: 0;
  position: sticky;
  background-color: bisque;
}

th, td {
  padding: 8px;
}

tbody > tr:nth-child(odd) {
  background-color: var(--color-bg-alt)
}

tbody > tr:hover {
  cursor: pointer;
  opacity: 0.6;
  outline: -webkit-focus-ring-color auto 3px;
}

tbody > tr:active {
  opacity: 1;
}

.th-tool {
  padding: 0;
}

.btn-tool {
  -webkit-appearance: none;
  -moz-appearance: none;
  display: inline-block;
  color: var(--color-tx);
  background: transparent;
  border: 0;
  padding: 2px 8px;
}

.btn-tool:hover {
  cursor: pointer;
  opacity: 0.6;
}

.btn-tool:active {
  opacity: 1;
}

.btn-tool:focus {
  outline: none
}

[highlighted=true] {
  color: orangered !important
}

.filter-row {
  cursor: default !important;
  opacity: 1 !important;
  outline: none !important;
}

.filter-col {
  padding: 4px;
}

.filter-col > input {
  border-width: 2px;
  padding: 2px;
  width: 100%;
}

.filter-col > input:focus {
  outline: -webkit-focus-ring-color auto 1px;
}

.filter-col > input[disabled] {
  background: #eeeeee;
  border: 1px solid #ffffff;
}

tfoot {
  border-top: 1px solid var(--color-tx);
  background-color: #fafafa; 
}

</style>

<script>
  /*
  class Column {
    position: 0,
    field: "col1",
    caption: "Column 1",
    type: "string",
    format: undefined,
    align: "left",
    width: "200",
    filter: {
      key: "" 
      allow: true,
      value: ""
    }
  }
  */

  import { createEventDispatcher, onMount } from 'svelte';

  export let theme = "light"
  export let source_url = ""      //URL to fetch data
  export let data_path = ""       //Response payload properties which will be used as the datasource
  export let total_page_path = "" //Response payload properties which must contains total page
  export let show_filter = true
  export let columns = []
  export let datasource = []
  export let rpp = 25
  export let total_data = 0

  $: page_remaining = total_page - page  >= 0 ? total_page - page : 0

  let total_page = 1
  let query_url = ""
  let total_col = 1
  let page = 1

  const dispatch = createEventDispatcher()

  function traverse(o, i) {
    return o[i]
  }

  function toggleFilterRow() {show_filter = !show_filter}

  function onFilterChanged(col) {
    query_url = columns.filter(c => {
      return c.filter.allow
    }).map(c => {
      return `${c.filter.key}=${c.filter.value}`
    }).join("&")
    console.log(query_url)
    bind(1, true)
    // dispatch('table.filter.changed', {field: col.field, value: col.filter.value})
  }

  function prev() {
    if (page === 1) return

    bind(page - 1, true)
  }

  function next() {
    if (page === total_page) return

    bind(page + 1, true)
  }

  function more() {
    if (page === total_page) return

    bind(page+1)
  }

  async function bind(pg, reset) {
    let url = `${source_url}?${query_url}&page=${pg}&size=${rpp}`
    let res = await fetch(url)
    let body = await res.json()

    total_page = total_page_path.split(".").reduce(traverse, body)
    if (reset) {
      datasource = data_path.split(".").reduce(traverse, body)
    } else {
      datasource = [...datasource, ...data_path.split(".").reduce(traverse, body)]
    }

    page = pg
  }

  onMount(async () => {
    columns = columns.map(c => {
      c.colspan = 1
      if (c.filter && c.filter.allow) {
        c.colspan++
      }


      total_col += c.colspan
      return c
    })


    bind(1, rpp)
  })
</script>

<div class="wrapper">
<table theme={theme}>
  <thead>
    <tr>
      <th>#</th>
    {#each columns as col}  
      <th class="align-{col.align}" max-width={col.width}>{col.caption}</th>
      {#if col.filter && col.filter.allow}
      <th width="1" class="th-tool">
        <button on:click={toggleFilterRow} highlighted={!!col.filter.value} class="btn-tool">
          <i class="ico-funnel"></i>
        </button>
      </th>
      {/if}
    {/each}
    </tr>
  </thead>

  <!-- BODY -->
  <tbody>
    {#if show_filter}
    <tr class="filter-row">
      <td></td>
      {#each columns as col}
      <td colspan={col.colspan} class="filter-col">
        <input bind:value={col.filter.value} 
          on:change="{() => onFilterChanged(col)}"
          disabled="{!col.filter || !col.filter.allow}" class="align-{col.align}">
      </td>
      {/each}
    </tr>
    {/if}
    <!-- {@debug page, rpp, datasource} -->
    <!-- {#each datasource.slice((page-1)*rpp, rpp*page) as entry, idx} -->
    {#each datasource as entry, idx}
    <tr on:click='{() => dispatch("table.row.clicked", {entry, idx})}'>
      <td>{(rpp*(page-1))+idx+1}</td>
      {#each columns as col}
      <!-- <td colspan={col.colspan} class="align-{col.align}">{entry[col.field]}</td> -->
      <td colspan={col.colspan} class="align-{col.align}">{col.field.split(".").reduce(traverse, entry)}</td>
      {/each}
    </tr>
    {/each}
  </tbody>

  <!-- FOOTER -->
  <tfoot>
    <tr>
      <td colspan={total_col}>
        <button on:click={prev} class="btn-tool"><i class="ico-arrow-left"></i></button>
        <button on:click={next} class="btn-tool"><i class="ico-arrow-right"></i></button>
        <!-- <button on:click={more} class="btn-tool"><i class="ico-arrow-down2"></i></button> -->
        <!-- {page_remaining} Page Remaining -->
        Page {page} of {total_page}
      </td>
    </tr>
  </tfoot>
</table>
</div>