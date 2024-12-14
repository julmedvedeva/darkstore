import React, { useEffect, useState, useMemo, useCallback } from "react";
import 'ag-grid-community';
import { goodsManager } from "../../data";
import { AgGridReact } from 'ag-grid-react';


import { ModuleRegistry, InfiniteRowModelModule } from 'ag-grid-community';
ModuleRegistry.registerModules([InfiniteRowModelModule]);


export function Goods() {
  const [colDefs, setColDefs] = useState([]);
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      floatingFilter: false,
    };
  }, []);

  useEffect(() => {
    const columnDefs = [
      { headerName: 'PLU', field: 'plu', sortable: false, filter: false },
      { headerName: 'Name', field: 'name', sortable: false, filter: false },
      { headerName: 'Price', field: 'price', sortable: false, filter: false },
      { headerName: 'Quantity', field: 'stockquantity', sortable: false, filter: false },
    ];
    setColDefs(columnDefs);
  }, []);

  const getRows = useCallback((params) => {
    const limit = 10;
    const page = Math.floor(params.startRow / limit) + 1;

    if (page > goodsManager.pagination.totalPages) {
      params.failCallback();
      return;
    }

    goodsManager.fetchGoods(page, limit).then((data) => {
      const rowsThisPage = data;
      const lastRow = goodsManager.pagination.totalGoods;
      params.successCallback(rowsThisPage, lastRow);
    }).catch((err) => {
      console.error(err);
      params.failCallback();
    });
  }, []);

  const onGridReady = useCallback((params) => {
    const dataSource = {
      rowCount: null,
      getRows: getRows,
    };

    params.api.setGridOption('datasource', dataSource);
  }, [getRows]);

  return (
    <div
      className="ag-theme-quartz my-10 max-w-screen-lg"
      style={{ height: 600 }}
    >
      <AgGridReact
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowModelType={'infinite'}
        onGridReady={onGridReady}
        pagination={false}
        rowBuffer={0}
        rowSelection={'multiple'}
        cacheOverflowSize={2}
        maxConcurrentDatasourceRequests={1}
        infiniteInitialRowCount={10}
        cacheBlockSize={10}
      />
    </div>
  );
}

export default Goods;
