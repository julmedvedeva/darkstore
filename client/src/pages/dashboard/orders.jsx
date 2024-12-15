import React, { useEffect, useState, useMemo, useCallback } from "react";
import { orderManager } from "@/data";
import { Button } from "@material-tailwind/react";
import { PaginationGroup, ActionButtons } from "@/widgets/layout";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export function OrdersPage() {
  const navigate = useNavigate();
  const [colDefs, setColDefs] = useState([]);
  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: false,
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const columnDefs = [
      { headerName: 'Order ID', field: 'orderid', sortable: false, filter: false },
      { headerName: 'Total', field: 'totalamount', sortable: false, filter: false },
      {
        headerName: 'Goods',
        field: 'goods',
        sortable: false,
        filter: false,
        valueGetter: (params) => {
          const goodsArray = params.data.goods || [];
          return goodsArray.map(good => good.goodname).join(', ');
        }
      },
      {
        headerName: "Actions",
        cellRenderer: (params) => {
          return (
            <div>
              <Button
                onClick={() => handleEdit(params.data.orderid)}
                className="text-black bg-transparent"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(params.data.orderid)}
                className="text-black bg-transparent"
              >
                Delete
              </Button>
            </div>
          )
        },
      },
    ];
    setColDefs(columnDefs);
  }, []);
  const handleEdit = (id) => {
    const currentUrl = window.location.pathname;
    const newUrl = `${currentUrl}/${id}/edit`;
    navigate(newUrl);
  };
  const handleDelete = async (orderId) => {
    try {
      await orderManager.deleteOrder(orderId);
      fetchOrders(currentPage);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };
  const fetchOrders = useCallback((page) => {
    orderManager.fetchOrders(page).then(() => {
      setOrders(orderManager.orders);
      setTotalPages(orderManager.pagination.totalPages);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  const navigateTo = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchOrders(page);
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  return (
    <div className="ag-theme-quartz my-10 max-w-screen-lg" style={{ height: 500 }}>
      <div className="mb-4">
        <ActionButtons
          onCreate={() => navigate("/dashboard/orders/create")}
        />
      </div>
      <AgGridReact
        rowData={orders}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={false}
      />
      <div className="flex justify-center mt-4">
        <PaginationGroup
          navigateTo={navigateTo}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

export default OrdersPage;
