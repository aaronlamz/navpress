
<template>
  <div>
    <NavComponent />
    <div class="flex">
      <Sidebar />
      <main class="flex-1 p-8">
        <h1 class="text-4xl font-bold mb-4">About</h1>
        <ul>
          <li class="mb-2"><a href="undefined" class="text-blue-600">Home</a></li><li class="mb-2"><a href="undefined" class="text-blue-600">About</a></li>
        </ul>
      </main>
    </div>
  </div>
</template>

<script>
import NavComponent from '../components/NavComponent.vue'
import Sidebar from '../components/Sidebar.vue'

export default {
  name: 'AboutPage',
  components: {
    NavComponent,
    Sidebar,
  },
}
</script>

<style scoped>
</style>
  