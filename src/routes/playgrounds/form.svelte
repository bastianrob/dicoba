<script>
import Form from "../../components/layouts/Form.svelte"
import Chips from "../../components/inputs/Chips.svelte"
import Select from "../../components/inputs/Select.svelte"
import Textbox from "../../components/inputs/Textbox.svelte"
import Slider from "../../components/inputs/Slider.svelte"
let schema = [{
  dom: {
    id: "price",
    name: "price",
    type: "number",
    min: 0,
    max: 100000000, //100mio
    step: 0.01
  },
  label: {
    caption: "Price",
    prefix: "Rp",
    postfix: ",-"
  },
  info: {
    show: true,
    message: "",
    condition: function(value) {
      return !value
    }
  },
  error: {
    show: true,
    message: "",
    condition: function(value) {
      return value >= this.dom.min && value <= this.dom.max
    }
  },
  field: {
    type: "float64",
    key: "price",
    value: 10000, //10k
  }
}, {
  dom: {
    id: "name",
    name: "name",
    type: "text",
    placeholder: "Name Please"
  },
  label: {
    caption: "Name"
  },
  info: {
    show: true,
    message: "",
    condition: function(value) {
      return !value
    }
  },
  error: {
    show: true,
    message: "",
    condition: function(value) {
      return value >= this.dom.min && value <= this.dom.max
    }
  },
  field: {
    type: "string",
    key: "name",
    value: "John Doe",
  }
}]

let chips = ["This", "That"]
let selects = [{
  id: "USER-0001",
  user: {name: "John"}
}, {
  id: "USER-0002",
  user: {name: "Jane"}
}, {
  id: "USER-0003",
  user: {name: "Jule"}
}]
</script>

<!-- <Form schema={schema} on:form.submitted="{({detail: {datasource, datanext}})=>console.log(datasource, datanext)}"></Form> -->
<!-- <Chips bind:datasource={chips}></Chips> -->
<div style="margin:20px; width: 400px;">
  <!-- <Chips bind:datasource={chips} theme="light"></Chips> -->
  <!-- <button on:click="{() => console.log()}">LOOK</button> -->
  <Textbox caption="Name" type="text"></Textbox>
  <Textbox caption="Email" type="text"></Textbox>
  <Textbox caption="Password" type="password"></Textbox>
  <Textbox caption="Password Confirm" type="password" disabled></Textbox>
  <Chips caption="Select" theme="light" error="Length <= 0 IS FORBIDDEN" 
    iserror="{function(e){return e.length <= 0}}"></Chips>
  <Slider caption="Check This" error="Must be checked" iserror="{v => !v}"></Slider>

  <!-- <Select multiple datasource={selects} caption_path="user.name" value_path=""></Select> -->
</div>