<style>
:root {
  --color-bg: #ffffff;
  --color-bg-alt: #dddddd;
  --color-tx: #000000;
  --color-chip: orangered;
}

[theme=dark] {
  --color-bg: #2e2e2e;
  --color-bg-alt: #3f3f3f;
  --color-tx: #ffffff;
  --color-chip: orangered;
}

[theme=light] {
  --color-bg: #ffffff;
  --color-bg-alt: #dddddd;
  --color-tx: #000000;
  --color-chip: orangered;
}


.wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background: var(--color-bg);
  color: var(--color-tx);
  border-bottom: 1px solid var(--color-tx);
}

.chip {
  display: inline-flex;
  background: var(--color-chip);
  color: var(--color-tx);
  margin: 2px 4px;
  padding: 2px 12px 2px 16px;
  border-radius: 16px;
  outline: none;
  float: left;
}

.chip:focus {
  opacity: 0.5;
}

.chip-x {
  background: transparent;
  border: 0;
  color: var(--color-tx);
  padding: 0px 0px 0 8px;
  margin: 0;
  outline: none;
}

input {
  background: var(--color-bg);
  color: var(--color-tx);
  display: inline-flex;
  flex-grow: 1;
  outline: none;
  border: 0;
}

</style>

<script>
  import {createEventDispatcher} from "svelte"

  export let theme = "light"
  export let datasource = []
  export let hide_input = false

  let clazz
  let inputbox

  const dispatch = createEventDispatcher()

  function removeElement(idx) {
    let value = datasource[idx]
    datasource.splice(idx, 1)
    datasource = datasource

    dispatch("entry.removed", {idx, value})
  }
</script>

<div theme={theme} class="wrapper">
  {#each datasource as entry, idx}
  <span on:keydown="{e =>{
    if (e.code !== 'Enter' && e.code !== 'Backspace' && e.code !== 'Space' && e.code !== 'Delete') return
    removeElement(idx)

    if (e.target.previousElementSibling) e.target.previousElementSibling.focus()
    else inputbox.focus()
  }}" class="chip" tabindex="0">{entry}
    <button on:click="{() => removeElement(idx)}" class="chip-x" tabindex="-1">&cross;</button>
  </span> 
  {/each}
  {#if !hide_input}
  <input bind:this={inputbox} on:keydown="{e => {
    if (e.code !== 'Backspace' || e.target.selectionStart !== 0) return

    if (e.target.previousElementSibling) e.target.previousElementSibling.focus()
  }}" on:change="{(e) => {
    let value = e.target.value.trim()
    if (!datasource.includes(value)) {
      datasource.push(value)
      datasource = datasource
    }

    e.target.value = ''
  }}" type="text" placeholder="...">
  {/if}
</div>