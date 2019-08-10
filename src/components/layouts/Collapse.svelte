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
    transition: all 0.35s;
  }

  .tab-content {
    max-height: 0;
    padding: 0 1em;
    color: #2c3e50;
    background: white;
    transition: all 0.35s;
    overflow: hidden;
    border: 1px solid #ddd;
  }

  /*
    .tab-close {
      display: flex;
      justify-content: flex-end;
      padding: 1em;
      font-size: 0.75em;
      background: #2c3e50;
      cursor: pointer;
    }
    .tab-close:hover {
      background: #1a252f;
    }
  */
  
  input:checked+.tab-label {
    background: #1a252f;
  }

  input:checked+.tab-label::after {
    transform: rotate(90deg);
  }

  input:checked~.tab-content {
    max-height: 100vh;
    padding: 1em;
  }
</style>

<script>
  export let expand = false
  export let id, anchor, href, caption = ""
</script>


<div class="tabs">
  <div class="tab">
    <input bind:checked={expand} type="checkbox" id={id} class="collapse">
    <label class="tab-label" for={id}>
        <a name={anchor} href={href}>{caption}</a>
      </label>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</div>