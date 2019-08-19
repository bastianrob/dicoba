<style>
  :root {
    --color-bg:antiquewhite;
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
    --color-bg: antiquewhite;
    --color-bg-alt: #dddddd;
    --color-tx: #000000;
    --color-chip: orangered;
  }

  .wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    background: var(--color-bg);
    color: var(--color-tx);
    border-bottom: 1px solid var(--color-chip);
    margin-top: 20px;
    position: relative;
  }

  [disabled=true] {
    background: gainsboro !important;
    color: dimgray !important;
    pointer-events: none;
  }

  .chip {
    display: inline-flex;
    background: var(--color-chip);
    color: white;
    margin: 2px 4px;
    padding: 4px 12px 4px 16px;
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
    color: white;
    padding: 0px 0px 0 8px;
    margin: 0;
    outline: none;
  }

  .chip[disabled=true], button:disabled {
    background: gainsboro;
    color: dimgray;
  }

  input {
    padding: 8px 32px 8px 8px;
    font-size: 14px;
    background: var(--color-bg);
    color: var(--color-tx);
    display: inline-flex;
    flex-grow: 1;
    outline: none;
    border: 0;
  }

  label {
    color:#aaa; 
    font-size:14px;
    position: absolute;
    pointer-events: none;
    top: 8px;
    left: 8px;
    margin: 0;
    transition:0.2s ease all; 
    -moz-transition:0.2s ease all; 
    -webkit-transition:0.2s ease all;
  }

  input:focus ~ label, label[away="true"] {
    font-size:14px;
    position: absolute;
    pointer-events: none;
    top: -20px;
    left: 0;
    color: orangered;
  }

  input:disabled {
    background: gainsboro;
    color: dimgray;
  }

  small {
    color: crimson;
  }
</style>

<script>
  import {createEventDispatcher} from "svelte"

  export let theme = "light"
  export let datasource = []
  export let caption = ""
  export let error = ""
  export let info = ""
  export let disabled = false
  export let iserror = function() {return false}
  export let hide_input = false

  const dispatch = createEventDispatcher()
  let show_error = iserror(datasource)
  let inputbox
  
  $: away = datasource.length > 0
  

  function removeElement(idx) {
    let value = datasource[idx]
    datasource.splice(idx, 1)
    datasource = datasource
    show_error = iserror(datasource)

    dispatch("entry.removed", {idx, value})
  }

  function onChipKeyDown(e, idx) {
    if (disabled) return

    if (e.code !== 'Enter' && e.code !== 'Backspace' && e.code !== 'Space' && e.code !== 'Delete') return

    removeElement(idx)

    if (e.target.previousElementSibling) e.target.previousElementSibling.focus()
    else if (inputbox) inputbox.focus()
  }

  function onInputKeyDown(e) {
    if (disabled) return
    if (e.code !== 'Backspace' || e.target.selectionStart !== 0) return

    if (e.target.previousElementSibling) e.target.previousElementSibling.focus()
  }

  function onInputValueChanged(e) {
    let value = e.target.value.trim()
    if (!datasource.includes(value)) {
      datasource.push(value)
      datasource = datasource
      show_error = iserror(datasource)
    }

    e.target.value = ''
  }
</script>

<div theme={theme} class="wrapper" {disabled}>
  {#each datasource as entry, idx}
  <span {disabled} on:keydown="{e => onChipKeyDown(e, idx)}" class="chip" tabindex="0">{entry}
    <button on:click="{() => removeElement(idx)}" class="chip-x" tabindex="-1" {disabled}>&cross;</button>
  </span> 
  {/each}
  {#if !hide_input}
  <input bind:this={inputbox} on:keydown={onInputKeyDown} on:change={onInputValueChanged} {disabled} type="text">
  <label {away}>{caption}</label>
  {/if}
</div>
{#if show_error}
<small>{error}</small>
{/if}