<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Low Stock Products</h1>
    <table class="w-full border-collapse border border-gray-300 mb-10">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Product</th>
          <th class="border border-gray-300 px-4 py-2">Quantity (Count of items &lt; 5)</th>
          <th class="border border-gray-300 px-4 py-2">Product IDs (quantity &lt; 5)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in groupedLowStockItems" :key="item.category" class="text-center">
          <td class="border border-gray-300 px-4 py-2">{{ item.category }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.quantity }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ item.productId.join(', ') }}</td>
        </tr>
      </tbody>
    </table>

    <h1 class="text-2xl font-bold mb-4">Sales Summary by Date</h1>
    <table class="w-full border-collapse border border-gray-300 mb-10">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Date</th>
          <th class="border border-gray-300 px-4 py-2">Total Orders</th>
          <th class="border border-gray-300 px-4 py-2">Overall Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(summary, index) in salesSummary" :key="index" class="text-center">
          <td class="border border-gray-300 px-4 py-2">{{ summary.date }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ summary.totalOrders }}</td>
          <td class="border border-gray-300 px-4 py-2">฿{{ summary.overall_price }}</td>
        </tr>
      </tbody>
    </table>

    <h1 class="text-2xl font-bold mb-4">Top 5 Users by Total Spending</h1>
    <table class="w-full border-collapse border border-gray-300 mb-10">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">User ID</th>
          <th class="border border-gray-300 px-4 py-2">Total Spent</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in topUsersBySpending" :key="user.userId" class="text-center">
          <td class="border border-gray-300 px-4 py-2">{{ String(user.userId).padStart(3, '0') }}</td>
          <td class="border border-gray-300 px-4 py-2">฿{{ user.totalSpent }}</td>
        </tr>
      </tbody>
    </table>

    <h1 class="text-2xl font-bold mb-4">Latest 5 Transactions</h1>
    <table class="w-full border-collapse border border-gray-300 mb-10">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">User ID</th>
          <th class="border border-gray-300 px-4 py-2">Order ID</th>
          <th class="border border-gray-300 px-4 py-2">Total Price</th>
          <th class="border border-gray-300 px-4 py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(txn, index) in latestTransactions" :key="txn.orderId" class="text-center">
          <td class="border border-gray-300 px-4 py-2">{{ String(txn.userId).padStart(3, '0') }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ txn.orderId }}</td>
          <td class="border border-gray-300 px-4 py-2">฿{{ txn.totalPrice }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ txn.date }}</td>
        </tr>
      </tbody>
    </table>

    <h1 class="text-2xl font-bold mb-4">Product summary</h1>
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Product</th>
          <th class="border border-gray-300 px-4 py-2">Quantity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(summary, index) in productCategorySummary" :key="index" class="text-center">
          <td class="border border-gray-300 px-4 py-2">{{ summary.category }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ summary.total }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>




<script>
import axios from 'axios';

export default {
  data() {
    return {
      lowStockItems: [
        { _id: "67e58bc52ca60623632086e5", productID: "10002", category: "CPU", quantity: 3 },
        { _id: "67e58bc52ca60623632086e6", productID: "10003", category: "CPU", quantity: 2 },
        { _id: "67e58bc52ca60623632086e7", productID: "20001", category: "RAM", quantity: 1 },
        { _id: "67e58bc52ca60623632086e8", productID: "30001", category: "Case", quantity: 1 },
        { _id: "67e58bc52ca60623632086e9", productID: "40001", category: "M.2", quantity: 2 },
        { _id: "67e58bc52ca60623632086e4", productID: "10001", category: "CPU", quantity: 28 },
        { _id: "67e7dd52dca9972e2d442c7e", productID: "20002", category: "RAM", quantity: 41 }
      ],
      salesSummary: [
        { date: '2024-03-27', totalOrders: 3, overall_price: 100000 },
        { date: '2024-03-28', totalOrders: 5, overall_price: 153200 },
        { date: '2024-03-29', totalOrders: 2, overall_price: 48250 }
      ],
      topUsersBySpending: [
        { userId: 1, totalSpent: 32000 },
        { userId: 2, totalSpent: 29850 },
        { userId: 3, totalSpent: 27500 },
        { userId: 4, totalSpent: 25000 },
        { userId: 5, totalSpent: 23000 }
      ],
      latestTransactions: [
       { userId: 1, orderId: 'ORD001', totalPrice: 7800, date: '2024-03-29' },
       { userId: 3, orderId: 'ORD002', totalPrice: 12200, date: '2024-03-28' },
       { userId: 2, orderId: 'ORD003', totalPrice: 5400, date: '2024-03-28' },
       { userId: 5, orderId: 'ORD004', totalPrice: 3300, date: '2024-03-27' },
       { userId: 4, orderId: 'ORD005', totalPrice: 11100, date: '2024-03-27' }
     ]

    };
  },
  computed: {
    groupedLowStockItems() {
      const filtered = this.lowStockItems.filter(item => item.quantity < 5);
      return Object.values(
        filtered.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = { category: item.category, quantity: 0, productId: [] };
          }
          acc[item.category].quantity += 1;
          acc[item.category].productId.push(item.productID);
          return acc;
        }, {})
      );
    },
    productCategorySummary() {
      return Object.values(
        this.lowStockItems.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = { category: item.category, total: 0 };
          }
          acc[item.category].total += 1;
          return acc;
        }, {})
      );
    }
  },
  async mounted() {
    await this.fetchLowStockItems();
    await this.fetchSalesSummary();
    await this.fetchTopUsers();
    await this.fetchLatestTransactions();
  },
  methods: {
    async fetchLowStockItems() {
      try {
        const response = await axios.get('/low-stock');
        if (response.data.low_stock_items && response.data.low_stock_items.length > 0) {
          this.lowStockItems = response.data.low_stock_items;
        }
      } catch (error) {
        console.error("Error fetching low stock items:", error);
      }
    },
    async fetchSalesSummary() {
      try {
        const response = await axios.get('/sales-summary');
        if (response.data && Array.isArray(response.data)) {
          this.salesSummary = response.data;
        }
      } catch (error) {
        console.error("Error fetching sales summary:", error);
      }
    },
    async fetchTopUsers() {
      try {
        const response = await axios.get('/top-users');
        if (response.data && Array.isArray(response.data)) {
          this.topUsersBySpending = response.data;
        }
      } catch (error) {
        console.error("Error fetching top users:", error);
      }
    },
    async fetchLatestTransactions() {
      try {
        const response = await axios.get('/latest-transactions');
        if (response.data && Array.isArray(response.data)) {
          this.latestTransactions = response.data;
        }
      } catch (error) {
        console.error("Error fetching latest transactions:", error);
      }
    }
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
}
</style>
