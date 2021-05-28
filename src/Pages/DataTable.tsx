import * as React from "react";
import { DataGrid, GridColDef,GridToolbar,GridRowSelectedParams} from "@material-ui/data-grid";


export interface DataTableProps {
  rows: Array<Object>;
  columns: GridColDef[];
  checkboxSelection?: boolean;
  height?: number | string;
  onRowSelected?: (param: GridRowSelectedParams) => void ;
}
 
const DataTable: React.SFC<DataTableProps> = ({rows,columns,checkboxSelection=false,height = 500,onRowSelected = (param: GridRowSelectedParams) => {}}) => {
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
        onRowSelected={onRowSelected}
      />
    </div>
  );
}
 
export default DataTable;
