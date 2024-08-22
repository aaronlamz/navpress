<template>
    <footer class="bg-gray-100 dark:bg-gray-800 text-center py-4 mt-4">
      <span class="text-gray-500 dark:text-gray-400">
        Powered by
        <a href="https://github.com/aaronlamz/navpress" target="_blank" class="text-blue-500 hover:text-blue-700"> Navpress</a>
      </span>
      <a href="https://github.com/aaronlamz/navpress" target="_blank" class="inline-flex items-center ml-2">
        <i class="fab fa-github text-gray-500 hover:text-gray-700 w-5 h-5"></i>
      </a>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'FooterComponent',
  };
  </script>
  
  <style scoped>
  footer {
    margin-top: auto;
  }
  </style>