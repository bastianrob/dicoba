<style>
  .box {
    border: 1px solid #ddd;
    display: flow-root;
  }
</style>

<script>
  export let padding = "1em"
</script>

<div class="box" style="padding: {padding}">
  <slot></slot>
</div>