<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg">
      <div class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">Inventory & Sales Dashboard</h1>
            <p class="text-blue-100">Real-time monitoring and analytics</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-blue-200">Last updated: {{ currentDate }}</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-grow container mx-auto px-4 py-8">
      <!-- Dashboard overview cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-500 mr-4">
              <i class="fas fa-exclamation-triangle text-xl"></i>
            </div>
            <div>
              <h3 class="text-gray-500 text-sm font-medium">Low Stock Items</h3>
              <p class="text-2xl font-semibold text-gray-800">{{ lowStockItemsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <i class="fas fa-money-bill-wave text-xl"></i>
            </div>
            <div>
              <h3 class="text-gray-500 text-sm font-medium">Total Revenue (3 days)</h3>
              <p class="text-2xl font-semibold text-gray-800">฿{{ totalRevenue.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <i class="fas fa-shopping-cart text-xl"></i>
            </div>
            <div>
              <h3 class="text-gray-500 text-sm font-medium">Total Orders (3 days)</h3>
              <p class="text-2xl font-semibold text-gray-800">{{ totalOrders }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Two-column layout for main content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left column -->
        <div>
          <!-- Low Stock Products -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-800">
                <i class="fas fa-boxes text-red-500 mr-2"></i>
                Low Stock Products
              </h2>
              <span class="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded-full">Critical</span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead>
                  <tr class="bg-gray-100 border-b">
                    <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Product</th>
                    <th class="text-center py-3 px-4 font-semibold text-sm text-gray-600">Count &lt; 5</th>
                    <th class="text-center py-3 px-4 font-semibold text-sm text-gray-600">Product IDs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in groupedLowStockItems" :key="item.category" class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4 font-medium">{{ item.category }}</td>
                    <td class="py-3 px-4 text-center">
                      <span class="px-2 py-1 bg-red-100 text-red-800 rounded-full font-semibold text-xs">
                        {{ item.quantity }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center text-sm text-gray-500">{{ item.productId.join(', ') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Latest 5 Transactions -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-800">
                <i class="fas fa-receipt text-blue-500 mr-2"></i>
                Latest Transactions
              </h2>
              <span class="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Recent</span>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead>
                  <tr class="bg-gray-100 border-b">
                    <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">User</th>
                    <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Order ID</th>
                    <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Amount</th>
                    <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Date</th>
                    <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="txn in latestTransactions" :key="txn.orderId" class="border-b hover:bg-gray-50">
                    <td class="py-3 px-4 font-medium">{{ String(txn.userId).padStart(3, '0') }}</td>
                    <td class="py-3 px-4 text-sm text-gray-500">{{ txn.orderId }}</td>
                    <td class="py-3 px-4 font-semibold">฿{{ txn.totalPrice.toLocaleString() }}</td>
                    <td class="py-3 px-4 text-sm text-gray-500">{{ txn.date }}</td>
                    <td class="py-3 px-4">
                      <span
                        :class="{
                          'px-2 py-1 rounded-full text-xs font-semibold': true,
                          'bg-green-100 text-green-800': txn.status === 'Paid',
                          'bg-yellow-100 text-yellow-800': txn.status === 'Pending',
                          'bg-red-100 text-red-800': txn.status === 'Failed'
                        }">
                        {{ txn.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div>
          <!-- Top 5 Users By Spending -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="mb-4">
              <h2 class="text-xl font-bold text-gray-800">
                <i class="fas fa-trophy text-yellow-500 mr-2"></i>
                Top Users by Spending
              </h2>
            </div>
            <div class="space-y-4">
              <div v-for="(user, index) in topUsersBySpending" :key="user.userId"
                   class="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div class="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold mr-4">
                  {{ index + 1 }}
                </div>
                <div class="flex-grow">
                  <p class="font-semibold">User #{{ String(user.userId).padStart(3, '0') }}</p>
                  <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div class="bg-blue-600 h-2.5 rounded-full" :style="{width: (user.totalSpent / topUsersBySpending[0].totalSpent * 100) + '%'}"></div>
                  </div>
                </div>
                <div class="text-right font-bold">
                  ฿{{ user.totalSpent.toLocaleString() }}
                </div>
              </div>
            </div>
          </div>

        <!-- Inventory Summary -->
        <div class="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 class="text-xl font-bold text-gray-800 mb-4">
            <i class="fas fa-warehouse text-indigo-500 mr-2"></i>
            Inventory Summary by Category
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead>
                <tr class="bg-gray-100 border-b">
                  <th class="py-2 px-4 text-left text-sm font-medium text-gray-600">Category</th>
                  <th class="py-2 px-4 text-center text-sm font-medium text-gray-600">Total Items</th>
                  <th class="py-2 px-4 text-center text-sm font-medium text-gray-600">Total Stock</th>
                  <th class="py-2 px-4 text-center text-sm font-medium text-gray-600">Total Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in categorySummary" :key="item.category" class="border-b hover:bg-gray-50">
                  <td class="py-2 px-4 font-medium">{{ item.category }}</td>
                  <td class="py-2 px-4 text-center">{{ item.totalItems }}</td>
                  <td class="py-2 px-4 text-center">{{ item.totalStock }}</td>
                  <td class="py-2 px-4 text-center">฿{{ item.totalValue.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p>&copy; 2024 Inventory Management System</p>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-blue-400 transition-colors">Dashboard</a>
            <a href="#" class="hover:text-blue-400 transition-colors">Reports</a>
            <a href="#" class="hover:text-blue-400 transition-colors">Settings</a>
            <a href="#" class="hover:text-blue-400 transition-colors">Help</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'InventoryDashboard',
  data() {
    return {
      lowStockItems: [
        // { _id: "67e58bc52ca60623632086e5", productID: "10002", category: "CPU", quantity: 3 },
        // { _id: "67e58bc52ca60623632086e6", productID: "10003", category: "CPU", quantity: 2 },
        // { _id: "67e58bc52ca60623632086e7", productID: "20001", category: "RAM", quantity: 1 },
        // { _id: "67e58bc52ca60623632086e8", productID: "30001", category: "Case", quantity: 1 },
        // { _id: "67e58bc52ca60623632086e9", productID: "40001", category: "M.2", quantity: 2 },
        // { _id: "67e58bc52ca60623632086e4", productID: "10001", category: "CPU", quantity: 28 },
        // { _id: "67e7dd52dca9972e2d442c7e", productID: "20002", category: "RAM", quantity: 41 }
      ],
      salesSummary: [
        // { date: '2024-03-27', totalOrders: 3, overall_price: 100000 },
        // { date: '2024-03-28', totalOrders: 5, overall_price: 153200 },
        // { date: '2024-03-29', totalOrders: 2, overall_price: 48250 }
      ],
      topUsersBySpending: [
        // { userId: 1, totalSpent: 32000 },
        // { userId: 2, totalSpent: 29850 },
        // { userId: 3, totalSpent: 27500 },
        // { userId: 4, totalSpent: 25000 },
        // { userId: 5, totalSpent: 23000 }
      ],
      latestTransactions: [
        // { userId: 1, orderId: 'ORD001', totalPrice: 7800, date: '2024-03-29', status: 'Paid' },
        // { userId: 3, orderId: 'ORD002', totalPrice: 12200, date: '2024-03-28', status: 'Pending' },
        // { userId: 2, orderId: 'ORD003', totalPrice: 5400, date: '2024-03-28', status: 'Paid' },
        // { userId: 5, orderId: 'ORD004', totalPrice: 3300, date: '2024-03-27', status: 'Failed' },
        // { userId: 4, orderId: 'ORD005', totalPrice: 11100, date: '2024-03-27', status: 'Paid' }
      ],
      categorySummary: [],
      currentDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
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
    },
    lowStockItemsCount() {
      return this.lowStockItems.filter(item => item.quantity < 5).length;
    },
    totalRevenue() {
      return this.salesSummary.reduce((sum, day) => sum + day.overall_price, 0);
    },
    totalOrders() {
      return this.salesSummary.reduce((sum, day) => sum + day.totalOrders, 0);
    }
  },
  mounted() {
    this.fetchData();
    // this.fetchSalesSummary();
  },
  methods: {
    async fetchData() {
      console.log("🔥 fetchData called");
      try {
        await Promise.all([
          this.fetchLowStockItems(),
          this.fetchSalesSummary(),
          this.fetchTopUsers(),
          this.fetchLatestTransactions(),
          this.fetchCategorySummary()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async fetchLowStockItems() {
  try {
    const response = await axios.get('http://localhost:8000/api/v1/admin/inventory/low-stock?limit=20');

    if (Array.isArray(response.data)) {
      // Map API structure to your app format
      this.lowStockItems = response.data.map(item => ({
        _id: item.product_id.toString(), // If needed, can generate UUID or use product_id
        productID: item.product_id.toString(),
        category: item.category,
        quantity: item.stock_quantity
      }));
    }
  } catch (error) {
    console.error("Error fetching low stock items:", error);
  }
},
    async fetchSalesSummary() {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/admin/sales/last-five-days');
        console.log("Raw sales data:", response.data);
        if (response.data && Array.isArray(response.data)) {
          // Map API fields to match expected structure
          this.salesSummary = response.data.map(item => ({
            date: item.date,
            overall_price: item.total_sales,
            totalOrders: item.order_count
          }));
          console.log("salesSummary fetched:", this.salesSummary);
        }
      } catch (error) {
        console.error("Error fetching sales summary:", error);
        // Continue with mock data
      }
    }
,
async fetchTopUsers() {
  try {
    const response = await fetch('http://localhost:8000/api/v1/admin/customers/top?limit=5');
    const data = await response.json();

    if (Array.isArray(data)) {
      this.topUsersBySpending = data.map(user => ({
        userId: user.user_id,
        totalSpent: user.total_spent
      }));

    }
  } catch (error) {
    console.error("Error fetching top users:", error);
  }
}
,
    async fetchLatestTransactions() {
  try {
    const response = await fetch('http://localhost:8000/api/v1/admin/orders/recent?limit=5');
    const data = await response.json();

    if (Array.isArray(data)) {
      this.latestTransactions = data.map(order => ({
        userId: order.user_id,
        orderId: order.order_id.toString(),
        totalPrice: order.total_price,
        date: order.order_date.split('T')[0],
        status: order.status
      }));
    }
  } catch (error) {
    console.error("Error fetching latest transactions:", error);
  }
},
async fetchCategorySummary() {
  try {
    const response = await fetch('http://localhost:8000/api/v1/admin/inventory/summary');
    const data = await response.json();

    if (data.categories && Array.isArray(data.categories)) {
      this.categorySummary = data.categories.map(item => ({
        category: item.category,
        totalItems: item.total_items,
        totalStock: item.total_stock,
        totalValue: item.total_value
      }));
    }
  } catch (error) {
    console.error("Error fetching category summary:", error);
  }
}


  }
};
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

body {
  font-family: 'Inter', 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f7f9fc;
  color: #333;
  line-height: 1.6;
}

.transition-shadow {
  transition: box-shadow 0.3s ease;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.transition-colors {
  transition: color 0.3s ease;
}
</style>
