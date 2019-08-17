<style>
:root {
  --color-bg: #ffffff;
  --color-bg-alt: #dddddd;
  --color-tx: #000000;
}

[theme=dark] {
  --color-bg: #2e2e2e;
  --color-bg-alt: #3f3f3f;
  --color-tx: #ffffff;
}

[theme=light] {
  --color-bg: #ffffff;
  --color-bg-alt: #dddddd;
  --color-tx: #000000;
}

.opt {
  list-style: none;
  padding: 4px 0;
  display: block;
  position: absolute;
  min-width: 15rem;
  max-width: 100%;
  overflow: scroll;
  background: var(--color-bg);
  -webkit-box-shadow: 1px 1px 1px 1px rgba(204,204,204,1);
  -moz-box-shadow: 1px 1px 1px 1px rgba(204,204,204,1);
  box-shadow: 1px 1px 1px 1px rgba(204,204,204,1);
}

.opt > li {
  padding: 4px;
  outline: none;
}

.opt > li:focus {
  background: var(--color-bg-alt)
}

.opt[display=none] {
  display: none;
}
</style>

<script>
  import { onMount } from "svelte"
  import Chips from "./Chips.svelte"


  export let theme = "light"
  export let datasource = []
  export let multiple = false
  export let source_url = ""
  export let caption_path = ""
  export let value_path = ""

  let original = []
  let selected_values = []
  let selected_captions = []
  let display_opt = "none"
  let input_box

  function traverse(o, i) { 
    return i ? o[i] : o
  }

  function onEntryRemoved(idx, value) {
    selected_values.splice(idx, 1)
    selected_captions.splice(idx, 1)

    selected_values = selected_values
    selected_captions = selected_captions
  }

  function onKeyDown(e) {
    if (e.code === 'ArrowDown') {
      let target = e.target.nextElementSibling

      if (!target) return
      if (e.target.nextElementSibling.tagName === 'UL') target = target.firstElementChild
      
      display_opt = 'block'
      target.focus()
    } else if (e.code === 'ArrowUp') {
      let target = e.target.previousElementSibling

      if (!target && e.target.parentElement.tagName === 'UL') target = e.target.parentElement.previousElementSibling
      else if (!target) return

      target.focus()
    } else if (e.code === 'Enter' || e.code === 'Space') {
      if (e.target.tagName !== "LI") return
      if (multiple) {
        if (selected_values.includes(e.target.dataset.value)) return

        selected_values.push(e.target.dataset.value)
        selected_captions.push(e.target.dataset.caption)

        selected_values = selected_values
        selected_captions = selected_captions

        display_opt = 'none'
        input_box.focus()
      } else {
        selected_values = [e.target.dataset.value]
        selected_captions = [e.target.dataset.caption]

        display_opt = 'none'
        input_box.focus()
      }
    } else if (e.code === 'Escape') {
      display_opt = 'none'
      input_box.focus()
    }
  }
  
  onMount(async () => {
    original = JSON.parse(JSON.stringify(datasource))
  })
</script>

<div class="wrapper" on:keydown="{onKeyDown}">
  <input bind:this={input_box} type="text">
  <ul display={display_opt} tabindex="-1" theme={theme} class="opt">
    {#each datasource as entry, idx}
    <li tabindex="0" data-value='{JSON.stringify(value_path.split(".").reduce(traverse, entry))}' 
      data-caption='{caption_path.split(".").reduce(traverse, entry)}'>
      {caption_path.split(".").reduce(traverse, entry)}
    </li>
    {/each}
  </ul>

  <Chips hide_input={true} datasource={selected_captions} 
    on:entry.removed="{({detail: {idx, value}}) => onEntryRemoved(idx,value)}"></Chips>
</div>