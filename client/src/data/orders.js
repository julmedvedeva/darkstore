import instance from "./axios";

class OrderManager {
  orders = [];
  order = {};
  pagination = {};

  fetchOrders = async (page = 1, limit = 10) => {
    try {
      const response = await instance.get(`/orders?limit=${limit}&page=${page}`);
      this.orders = response.data.orders;
      this.pagination = response.data.pagination;
      return this.orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  getOrderById = async (id) => {
    try {
      const response = await instance.get(`/orders/${id}`);
      this.order = response.data;
      return this.order;
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  }

  updateOrder = async (id, order) => {
    try {
      const response = await instance.put(`/orders/${id}`, order);
      this.order = response.data;
      return this.order;
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  createOrder = async (order) => {
    try {
      const response = await instance.post('/orders', order);
      this.order = response.data;
      return this.order;
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }
  deleteOrder = async (id) => {
    try {
      await instance.delete(`/orders/${id}`);
      this.order = null;
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }
}
const orderManager = new OrderManager();
export { orderManager };
