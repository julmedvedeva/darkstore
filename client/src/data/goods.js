import instance from "./axios";

class GoodsManager {
  goods = [];
  pagination = {};

  fetchGoods = async (page = 1, limit = 10) => {
    try {
      const response = await instance.get(`/goods?limit=${limit}&page=${page}`);
      this.goods = response.data.goods;
      this.pagination = response.data.pagination;
      return this.goods;
    } catch (error) {
      console.error("Error fetching goods:", error);
    }
  };
  fetchAllGoods = async () => {
    let allGoods = [];
    let page = 1;
    const limit = 10;

    try {
      while (true) {
        const response = await instance.get(`/goods?limit=${limit}&page=${page}`);
        const goods = response.data.goods;

        if (goods.length === 0) {
          break;
        }

        allGoods = [...allGoods, ...goods];
        page++;
      }

      this.goods = allGoods;
      return this.goods;
    } catch (error) {
      console.error("Error fetching goods:", error);
    }
  }
}
const goodsManager = new GoodsManager();
export { goodsManager }
export default goodsManager;
