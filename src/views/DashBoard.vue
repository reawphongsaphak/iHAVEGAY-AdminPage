<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// ข้อมูลสถิติ
const totalSales = ref(125000);
const totalProducts = ref(340);
const totalOrders = ref(230);
const totalProfit = ref(50000);
const newCustomers = ref(45);
const cancelledOrders = ref(10);
const stockAlert = ref(["RTX 4060", "Ryzen 7 5800X", "16GB DDR4 RAM"]);

// รายการคำสั่งซื้อ
const recentOrders = ref([
  { id: "#00123", customer: "John Doe", amount: "฿35,000", status: "Completed" },
  { id: "#00124", customer: "Alice Brown", amount: "฿42,000", status: "Pending" },
  { id: "#00125", customer: "Michael Lee", amount: "฿29,500", status: "Shipped" }
]);

// ฟังก์ชันสร้างกราฟ
const createSalesChart = () => {
  const ctx = document.getElementById("salesChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "ยอดขาย (฿)",
          data: [10000, 15000, 12000, 20000, 18000, 22000],
          borderColor: "#4CAF50",
          fill: true,
          backgroundColor: "rgba(76, 175, 80, 0.2)"
        }
      ]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
};

const createProductChart = () => {
  const ctx = document.getElementById("productChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["CPU", "GPU", "RAM", "SSD", "PSU"],
      datasets: [
        {
          label: "ยอดขายแยกตามสินค้า (ชิ้น)",
          data: [50, 80, 60, 40, 30],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#8E44AD"]
        }
      ]
    },
    options: { responsive: true }
  });
};

onMounted(() => {
  createSalesChart();
  createProductChart();
});
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">📊 Admin Dashboard</h1>

    <!-- Card Stat Widgets -->
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold">💰 ยอดขายรวม</h2>
        <p class="text-2xl font-bold text-green-500">฿{{ totalSales.toLocaleString() }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold">📦 จำนวนสินค้า</h2>
        <p class="text-2xl font-bold text-blue-500">{{ totalProducts }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold">🛒 คำสั่งซื้อทั้งหมด</h2>
        <p class="text-2xl font-bold text-orange-500">{{ totalOrders }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold">📈 กำไรสุทธิ</h2>
        <p class="text-2xl font-bold text-purple-500">฿{{ totalProfit.toLocaleString() }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold">👥 ลูกค้าใหม่</h2>
        <p class="text-2xl font-bold text-cyan-500">{{ newCustomers }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold">🚨 คำสั่งซื้อที่ถูกยกเลิก</h2>
        <p class="text-2xl font-bold text-red-500">{{ cancelledOrders }}</p>
      </div>
    </div>

    <!-- กราฟยอดขาย -->
    <div class="grid grid-cols-2 gap-6 mt-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">📈 กราฟยอดขาย 6 เดือนล่าสุด</h2>
        <canvas id="salesChart"></canvas>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">📊 ยอดขายแยกตามประเภทสินค้า</h2>
        <canvas id="productChart"></canvas>
      </div>
    </div>

    <!-- รายการคำสั่งซื้อ & สินค้าคงเหลือ -->
    <div class="grid grid-cols-2 gap-6 mt-6">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-2">📝 รายการคำสั่งซื้อล่าสุด</h2>
        <ul>
          <li v-for="order in recentOrders" :key="order.id" class="flex justify-between border-b py-2">
            <span>{{ order.id }} - {{ order.customer }}</span>
            <span class="font-bold text-green-500">{{ order.amount }}</span>
            <span class="text-gray-500">{{ order.status }}</span>
          </li>
        </ul>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-2">⚠️ สินค้าใกล้หมด</h2>
        <ul>
          <li v-for="item in stockAlert" :key="item" class="text-red-500 font-semibold">
            🔴 {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom Style */
</style>
