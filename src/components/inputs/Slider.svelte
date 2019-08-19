<style>
  .wrapper {
    position: relative;
  }

  .caption {
    font-size:14px;
    pointer-events: none;
    margin: 0;
    color: orangered;
  }

  .switch {
    position: relative;
    display: block;
    width: 60px;
    height: 34px;
    margin-bottom: 0;
  }

  .switch input { 
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: orangered;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px orangered;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  .switch input:hover ~ .slider {
    box-shadow: 0px 0px 0px 1px mediumslateblue;
  }

  small {
    color: crimson;
  }
</style>

<script>
  export let caption = ""
  export let error = ""
  export let checked = false
  export let iserror = function() {return false}

  let show_error = iserror(checked);
</script>

<div class="wrapper">
  <label class="caption">{caption}</label>
  <label class="switch">
    <input on:change='{e => show_error = iserror(checked)}' bind:checked={checked} type="checkbox">
    <span class="slider round"></span>
  </label>
  {#if show_error}
  <small>{error}</small>
  {/if}
</div>