import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridSelectionModelChangeParams,
} from "@material-ui/data-grid";


export interface DataTableProps {
  rows: Array<Object>;
  columns: GridColDef[];
  checkboxSelection?: boolean;
  height?: number | string;
  onSelectionModelChange?: (param: GridSelectionModelChangeParams) => void;
}

const DataTable: React.SFC<DataTableProps> = ({
  rows,
  columns,
  checkboxSelection = false,
  height = 500,
  onSelectionModelChange = (param: GridSelectionModelChangeParams) => {},
}) => {
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
        onSelectionModelChange={onSelectionModelChange}
      />
    </div>
  );
};
 
export default DataTable;
