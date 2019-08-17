<script>
  import { createEventDispatcher, onMount } from 'svelte';
  export let schema = []
  export let datasource = {}

  let datanext = {} //dataource is the original data, datanext is the updated data

  const dispatch = createEventDispatcher()

  

  function onValueChanged(dom, sch) {
    //here, "this" context will be the DOM component
    //TODO: there must be a converter based on dom.type

    let value = dom.value
    //TODO: convert dom.value based on sch.field.type
    if (sch.field.type === "float64") {
      value = parseFloat(dom.value)
    }

    datanext[sch.field.key] = value
  }

  function submit() {
    dispatch("form.submitted", {datasource, datanext})
  }

  onMount(async () => {
    schema.forEach(e => {
      if (!e.field || !e.field.key) return

      //naive deep copy, but, whatever
      datasource[e.field.key] = JSON.parse(JSON.stringify(e.field.value))
    })

    datanext = JSON.parse(JSON.stringify(datasource))
  })
</script>

<div class="wrapper">
  <form>
    {#each schema as sch, schi}
    <div>
      <label>{sch.label.caption}</label>
      {#if sch.label.prefix}<span>{sch.label.prefix}</span>{/if}
      <input on:change="{(e) => onValueChanged(e.target, sch)}" value={sch.field.value} {...sch.dom}>
      {#if sch.label.postfix}<span>{sch.label.postfix}</span>{/if}
    </div>
    {/each}
    <button on:click|preventDefault={submit} type="submit">Submit</button>
  </form>
</div>