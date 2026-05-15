

import { Toaster } from "react-hot-toast";
import MainLayout from "../layout/MainLayout";
import useOrders from "../hooks/useOrders";
import useAuth from "../hooks/useAuth";
import OrdersFilters from "../components/OrdersFilters";
import OrdersTable from "../components/OrdersTable";

export default function Orders() {
  const { userRole } = useAuth();
  const {
    orders,
    centers,
    searchTerm, setSearchTerm,
    selectedCenter, setSelectedCenter,
    selectedStatus, setSelectedStatus,
    loading,
    lastElementRef,
    confirmUpdate,
    editDevice,
    editIssue,
  } = useOrders();

  return (
    <MainLayout>
      <Toaster position="top-center" />
      <OrdersFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCenter={selectedCenter}
        setSelectedCenter={setSelectedCenter}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        centers={centers}
      />
      <OrdersTable
        orders={orders}
        centers={centers}
        loading={loading}
        lastElementRef={lastElementRef}
        confirmUpdate={confirmUpdate}
        editDevice={editDevice}
        editIssue={editIssue}
        userRole={userRole}
      />
    </MainLayout>
  );
}

