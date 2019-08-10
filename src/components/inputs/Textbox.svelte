<style>
    input {
        padding: 8px;
        border: 1px solid lightgray;
        box-sizing: border-box;
        width: 100%;
        font-size: 12px;
        margin: 10px 0;
    }
</style>

<script>
    export let text, placeholder, disabled
</script>

<input bind:value={text} placeholder={placeholder} />