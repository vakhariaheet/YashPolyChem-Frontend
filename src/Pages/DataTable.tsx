import * as React from "react";
import { DataGrid, GridColDef,GridToolbar} from "@material-ui/data-grid";


export interface DataTableProps {
  rows: Array<Object>;
  columns: GridColDef[];
  checkboxSelection?: boolean;
  height?: number | string;
}
 
const DataTable: React.SFC<DataTableProps> = ({rows,columns,checkboxSelection=false,height = 500}) => {
  return (
    <div style={{ height, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoPageSize={true}
        checkboxSelection={checkboxSelection}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
}
 
export default DataTable;
