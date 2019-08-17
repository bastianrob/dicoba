<script>
  import Table from "../../components/layouts/Table.svelte"

  let columns = [{
    position: 0,
    field: "attributes.name",
    caption: "Name",
    type: "string",
    format: undefined,
    align: "left",
    width: "200",
    filter: {
      allow: true,
      key: "name",
      value: ""
    }
  }, {
    position: 1,
    field: "attributes.province",
    caption: "Province",
    type: "string",
    format: undefined,
    align: "left",
    width: "100",
    filter: {
      allow: true,
      key: "province",
      value: ""
    }
  }, {
    position: 3,
    field: "attributes.developer_name",
    caption: "Developer",
    type: "string",
    format: undefined,
    align: "right",
    width: "300",
    filter: {
      allow: true,
      key: "developer_name",
      value: ""
    }
  }]

  let data = [{
    col1: "Row 1 value of col 1",
    col2: "Row 1 value of col 2",
    col3: "Row 1 value of col 3"
  }, {
    col1: "Row 2 value of col 1",
    col2: "Row 2 value of col 2",
    col3: "Row 2 value of col 3"
  }]

  function onRowClicked({detail: {entry, idx} = {}}) {
    console.log(`${idx+1}. ${JSON.stringify(entry)}`)
  }

  function onFilterChanged({detail: {field, value} = {}}) {}
</script>

<Table theme="light" rpp="10"
  show_filter={true} columns={columns} 
  source_url="http://localhost:8081/1.1/complex/apartment"
  total_page_path="paging.total_page" data_path="data"
  on:table.row.clicked={onRowClicked}></Table>