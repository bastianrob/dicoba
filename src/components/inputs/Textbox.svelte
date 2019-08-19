<style>
  .wrapper {
    position: relative;
  }
  
  label {
    color:#aaa; 
    font-size:14px;
    position: absolute;
    pointer-events: none;
    top: 28px;
    left: 8px;
    margin: 0;
    transition:0.2s ease all; 
    -moz-transition:0.2s ease all; 
    -webkit-transition:0.2s ease all;
  }

  input {
    padding: 8px 32px 8px 8px;
    border-width: 0 0 1px 0;
    border-color: orangered;
    box-sizing: border-box;
    width: 100%;
    font-size: 14px;
    margin: 20px 0 0 0;
    outline: none;
    background: antiquewhite
  }

  input:disabled, input:disabled ~ button {
    background: gainsboro;
    color: dimgray;
  }

  /* This means label must comes after the input */
  input:focus ~ label, input:valid ~ label {
    top: 0;
    left: 0;
    color: orangered;
  }

  button {
    background: transparent;
    border: none;
    outline: none;
    position: absolute;
    right: 8px;
    top: 27px;
    color: orangered;
  }

  button:hover {
    opacity: 0.6;
  }

  button:active {
    opacity: 1;
  }

  small {
    color: crimson;
  }
</style>

<script>
  export let value = ""
  export let type = "text"
  export let caption = ""
  export let error = ""
  export let info = ""
  export let disabled = false
  export let iserror = function() {return false}

  let show_error = iserror(value)
</script>

<div class="wrapper">
  <input type={type} on:change="{(e) => show_error = iserror(e.target.value)}" {disabled} required>
  <label>{caption}</label>
  <button tabindex="-1" type="button">
    <i class="ico-info"></i>
  </button>
  {#if show_error}
  <small>{error}</small>
  {/if}
</div>
