<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Settings -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" placeholder="John Doe" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" placeholder="john@example.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea rows="3" placeholder="Tell us about yourself..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Preferences -->
      <div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
          <div class="space-y-3">
            <label class="flex items-center">
              <input type="checkbox" class="mr-3 w-4 h-4 text-blue-600" defaultChecked />
              <span class="text-gray-700">Dark Mode</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-3 w-4 h-4 text-blue-600" defaultChecked />
              <span class="text-gray-700">Email Notifications</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" class="mr-3 w-4 h-4 text-blue-600" />
              <span class="text-gray-700">Push Notifications</span>
            </label>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Account</h3>
          <div class="space-y-3">
            <button class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Change Password
            </button>
            <button class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Privacy Settings
            </button>
            <button class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Save Button -->
    <div class="mt-6 flex justify-end">
      <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
// Settings logic can be added here
</script>