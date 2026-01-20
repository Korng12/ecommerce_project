<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
    
    <!-- Success/Error Messages -->
    <div v-if="saveStatus.message" 
         :class="['mb-6 p-4 rounded-lg border', 
                  saveStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
                  saveStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
                  'bg-blue-50 border-blue-200 text-blue-700']">
      {{ saveStatus.message }}
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Settings -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                v-model="profile.name"
                placeholder="John Doe" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                v-model="profile.email"
                placeholder="john@example.com" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" 
                v-model="profile.phone"
                placeholder="+1 (123) 456-7890" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <!-- Theme Settings -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Theme & Display</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select 
                v-model="language"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Column -->
      <div>
        <!-- Preferences -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
          <div class="space-y-3">
            <label class="flex items-center justify-between cursor-pointer group">
              <div>
                <span class="text-gray-700">Dark Mode</span>
                <p class="text-xs text-gray-500">Switch to dark theme</p>
              </div>
              <div class="relative">
                <input 
                  type="checkbox" 
                  v-model="preferences.darkMode"
                  class="sr-only"
                />
                <div 
                  :class="['w-12 h-6 rounded-full transition-colors duration-200', 
                           preferences.darkMode ? 'bg-blue-600' : 'bg-gray-300']"
                >
                  <div 
                    :class="['absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200', 
                             preferences.darkMode ? 'transform translate-x-7' : 'transform translate-x-1']"
                  ></div>
                </div>
              </div>
            </label>
            
            <label class="flex items-center justify-between cursor-pointer group">
              <div>
                <span class="text-gray-700">Email Notifications</span>
                <p class="text-xs text-gray-500">Receive email updates</p>
              </div>
              <input 
                type="checkbox" 
                v-model="preferences.emailNotifications"
                class="w-4 h-4 text-blue-600"
              />
            </label>
            
            <label class="flex items-center justify-between cursor-pointer group">
              <div>
                <span class="text-gray-700">Push Notifications</span>
                <p class="text-xs text-gray-500">Browser notifications</p>
              </div>
              <input 
                type="checkbox" 
                v-model="preferences.pushNotifications"
                class="w-4 h-4 text-blue-600"
              />
            </label>
            
            <label class="flex items-center justify-between cursor-pointer group">
              <div>
                <span class="text-gray-700">Weekly Reports</span>
                <p class="text-xs text-gray-500">Receive weekly summaries</p>
              </div>
              <input 
                type="checkbox" 
                v-model="preferences.weeklyReports"
                class="w-4 h-4 text-blue-600"
              />
            </label>
            
            <div class="pt-3 border-t border-gray-100">
              <label class="block text-sm font-medium text-gray-700 mb-2">Notification Frequency</label>
              <select 
                v-model="preferences.notificationFrequency"
                class="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly Digest</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Account Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Account</h3>
          <div class="space-y-3">
            <button 
              @click="changePassword"
              class="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
            >
              <span>Change Password</span>
              <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            
             <button 
  @click="openPrivacySettings" 
  class="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group"
>
  <span>Privacy Settings</span>
  <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
  </svg>
</button>
            
            <button 
              @click="deleteAccount"
              class="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between group"
            >
              <span>Delete Account</span>
              <svg class="w-4 h-4 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- System Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">App Version</span>
              <span class="text-gray-800 font-medium">v2.5.1</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Last Updated</span>
              <span class="text-gray-800 font-medium">Dec 10, 2025</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Storage Used</span>
              <span class="text-gray-800 font-medium">1.2 GB / 5 GB</span>
            </div>
            <div class="pt-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full" style="width: 24%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Save Button -->
    <div class="mt-6 flex justify-between items-center">
      <button 
        @click="resetToDefaults"
        class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Reset to Defaults
      </button>
      <div class="flex gap-3">
        <button 
          @click="discardChanges"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Discard Changes
        </button>
        <button 
          @click="saveSettings"
          :disabled="isSaving || !hasChanges"
          :class="['px-6 py-2 bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2', 
                   (isSaving || !hasChanges) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700']"
        >
          <svg v-if="isSaving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
    
    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Change Password</h3>
          <button @click="closePasswordModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div class="relative">
              <input 
                :type="showCurrentPassword ? 'text' : 'password'"
                v-model="passwordForm.currentPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Enter current password"
              />
              <button 
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showCurrentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <div v-if="passwordErrors.currentPassword" class="text-red-600 text-sm mt-1">
              {{ passwordErrors.currentPassword }}
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div class="relative">
              <input 
                :type="showNewPassword ? 'text' : 'password'"
                v-model="passwordForm.newPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Enter new password"
              />
              <button 
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <div v-if="passwordErrors.newPassword" class="text-red-600 text-sm mt-1">
              {{ passwordErrors.newPassword }}
            </div>
            <div v-if="passwordForm.newPassword" class="mt-2">
              <div class="flex items-center gap-2 mb-1">
                <div :class="['h-1 flex-1 rounded', 
                           passwordStrength >= 1 ? 'bg-red-500' : 'bg-gray-200']"></div>
                <div :class="['h-1 flex-1 rounded', 
                           passwordStrength >= 2 ? 'bg-yellow-500' : 'bg-gray-200']"></div>
                <div :class="['h-1 flex-1 rounded', 
                           passwordStrength >= 3 ? 'bg-green-500' : 'bg-gray-200']"></div>
                <div :class="['h-1 flex-1 rounded', 
                           passwordStrength >= 4 ? 'bg-green-500' : 'bg-gray-200']"></div>
              </div>
              <p class="text-xs text-gray-500">
                Password strength: 
                <span :class="[
                  passwordStrength === 0 ? 'text-gray-500' :
                  passwordStrength === 1 ? 'text-red-600' :
                  passwordStrength === 2 ? 'text-yellow-600' :
                  passwordStrength === 3 ? 'text-green-600' :
                  'text-green-600'
                ]">
                  {{ ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength] }}
                </span>
              </p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div class="relative">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="passwordForm.confirmPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Confirm new password"
              />
              <button 
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
            <div v-if="passwordErrors.confirmPassword" class="text-red-600 text-sm mt-1">
              {{ passwordErrors.confirmPassword }}
            </div>
            <div v-if="passwordForm.newPassword && passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword" 
                 class="text-red-600 text-sm mt-1">
              Passwords do not match
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button 
            @click="closePasswordModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="updatePassword"
            :disabled="!isPasswordFormValid || isChangingPassword"
            :class="['px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2', 
                     (!isPasswordFormValid || isChangingPassword) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700']"
          >
            <svg v-if="isChangingPassword" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isChangingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Privacy Settings Modal -->
    <div v-if="showPrivacyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800">Privacy Settings</h3>
          <button @click="closePrivacyModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Profile Visibility</h4>
            <div class="space-y-2">
              <label class="flex items-center justify-between cursor-pointer group">
                <div>
                  <span class="text-gray-700">Public Profile</span>
                  <p class="text-xs text-gray-500">Anyone can view your profile</p>
                </div>
                <div class="relative">
                  <input 
                    type="checkbox" 
                     v-model="privacyData.publicProfile" 
                    class="sr-only"
                  />
                  <div 
  :class="['w-12 h-6 rounded-full transition-colors duration-200', 
           privacyData.publicProfile ? 'bg-blue-600' : 'bg-gray-300']"  >
  <div 
    :class="['absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200', 
             privacyData.publicProfile ? 'transform translate-x-7' : 'transform translate-x-1']" 
  ></div>
</div>
                </div>
              </label>
              
              <label class="flex items-center justify-between cursor-pointer group">
                <div>
                  <span class="text-gray-700">Show Email</span>
                  <p class="text-xs text-gray-500">Display email on profile</p>
                </div>
                <input 
                  type="checkbox" 
                  v-model="privacyData.showEmail"
                  class="w-4 h-4 text-blue-600"
                />
              </label>
              
              <label class="flex items-center justify-between cursor-pointer group">
                <div>
                  <span class="text-gray-700">Show Activity Status</span>
                  <p class="text-xs text-gray-500">Show when you're online</p>
                </div>
                <input 
                  type="checkbox" 
                  v-model="privacyData.showActivity"
                  class="w-4 h-4 text-blue-600"
                />
              </label>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Data & Privacy</h4>
            <div class="space-y-2">
              <label class="flex items-center justify-between cursor-pointer group">
                <div>
                  <span class="text-gray-700">Data Collection</span>
                  <p class="text-xs text-gray-500">Allow usage data collection</p>
                </div>
                <input 
                  type="checkbox" 
                  v-model="privacyData.dataCollection"
                  class="w-4 h-4 text-blue-600"
                />
              </label>
              
              <label class="flex items-center justify-between cursor-pointer group">
                <div>
                  <span class="text-gray-700">Personalized Ads</span>
                  <p class="text-xs text-gray-500">Show personalized advertisements</p>
                </div>
                <input 
                  type="checkbox" 
                  v-model="privacyData.personalizedAds"
                  class="w-4 h-4 text-blue-600"
                />
              </label>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Search Visibility</h4>
            <select 
              v-model="privacyData.searchVisibility"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="public">Public - Anyone can find me</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private - Hide from search</option>
            </select>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 mt-8">
          <button 
            @click="closePrivacyModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="savePrivacySettings"
            :disabled="isSavingPrivacy"
            :class="['px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2', 
                     isSavingPrivacy ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700']"
          >
            <svg v-if="isSavingPrivacy" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSavingPrivacy ? 'Saving...' : 'Save Privacy Settings' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Delete Account</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.
        </p>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Type "DELETE" to confirm
          </label>
          <input 
            type="text" 
            v-model="deleteConfirmation"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="DELETE"
          />
        </div>
        <div class="flex justify-end gap-3">
          <button 
            @click="showDeleteConfirm = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmDeleteAccount"
            :disabled="deleteConfirmation !== 'DELETE'"
            :class="['px-4 py-2 bg-red-600 text-white rounded-lg transition-colors', 
                     deleteConfirmation !== 'DELETE' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700']"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// Profile data
const profile = reactive({
  name: 'Meng Korng',
  email: 'korng@gmail.com',
  phone: '+855 1234 5678'
})

// Preferences
const preferences = reactive({
  darkMode: true,
  emailNotifications: true,
  pushNotifications: false,
  weeklyReports: true,
  notificationFrequency: 'daily'
})

// Language
const language = ref('en')

// UI state
const isSaving = ref(false)
const showDeleteConfirm = ref(false)
const deleteConfirmation = ref('')
const saveStatus = reactive({
  type: '', // 'success', 'error', 'info'
  message: ''
})

// Modal states
const showPasswordModal = ref(false)
const showPrivacyModal = ref(false)

// Password form state
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isChangingPassword = ref(false)

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Privacy settings state
const privacyData = reactive({
  publicProfile: true,
  showEmail: false,
  showActivity: true,
  dataCollection: true,
  personalizedAds: false,
  searchVisibility: 'public'
})

const isSavingPrivacy = ref(false)

// Password strength calculator
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return strength
})

// Password form validation
const isPasswordFormValid = computed(() => {
  return (
    passwordForm.currentPassword.length >= 6 &&
    passwordForm.newPassword.length >= 8 &&
    passwordForm.confirmPassword === passwordForm.newPassword &&
    passwordStrength.value >= 2
  )
})

// Check if there are changes
const hasChanges = computed(() => {
  const originalProfile = {
    name: 'Meng Korng',
    email: 'korng@gmail.com',
    phone: '+855 1234 5678'
  }
  
  return JSON.stringify(profile) !== JSON.stringify(originalProfile) ||
         preferences.darkMode !== true ||
         preferences.emailNotifications !== true ||
         preferences.pushNotifications !== false ||
         preferences.weeklyReports !== true ||
         preferences.notificationFrequency !== 'daily' ||
         language.value !== 'en'
})

// Save settings
const saveSettings = async () => {
  if (!hasChanges.value || isSaving.value) return
  
  isSaving.value = true
  saveStatus.message = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In real app, you would save to backend
    console.log('Saving settings:', { 
      profile, 
      preferences, 
      language: language.value
    })
    
    saveStatus.type = 'success'
    saveStatus.message = 'Settings saved successfully!'
    
    // Clear message after 3 seconds
    setTimeout(() => {
      saveStatus.message = ''
    }, 3000)
    
  } catch (error) {
    saveStatus.type = 'error'
    saveStatus.message = 'Failed to save settings. Please try again.'
    console.error('Save error:', error)
  } finally {
    isSaving.value = false
  }
}

// Discard changes
const discardChanges = () => {
  // Reset to original values
  profile.name = 'Meng Korng'
  profile.email = 'korng@gmail.com'
  profile.phone = '+855 1234 5678'
  
  preferences.darkMode = true
  preferences.emailNotifications = true
  preferences.pushNotifications = false
  preferences.weeklyReports = true
  preferences.notificationFrequency = 'daily'
  
  language.value = 'en'
  
  saveStatus.type = 'info'
  saveStatus.message = 'Changes discarded'
  
  setTimeout(() => {
    saveStatus.message = ''
  }, 2000)
}

// Reset to defaults
const resetToDefaults = () => {
  preferences.darkMode = false
  preferences.emailNotifications = true
  preferences.pushNotifications = true
  preferences.weeklyReports = false
  preferences.notificationFrequency = 'realtime'
  
  language.value = 'en'
  
  saveStatus.type = 'info'
  saveStatus.message = 'Reset to default settings'
  
  setTimeout(() => {
    saveStatus.message = ''
  }, 2000)
}

// Account actions
const changePassword = () => {
  // Reset form
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordErrors.currentPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''
  
  showPasswordModal.value = true
}

const openPrivacySettings = () => {
  showPrivacyModal.value = true
}

// Close modal functions
const closePasswordModal = () => {
  showPasswordModal.value = false
}

const closePrivacyModal = () => {
  showPrivacyModal.value = false
}

// Update password function
const updatePassword = async () => {
  if (!isPasswordFormValid.value) return
  
  isChangingPassword.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Updating password:', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    // Show success message
    saveStatus.type = 'success'
    saveStatus.message = 'Password updated successfully!'
    
    // Close modal
    closePasswordModal()
    
    // Clear password form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // Clear message after 3 seconds
    setTimeout(() => {
      saveStatus.message = ''
    }, 3000)
    
  } catch (error) {
    // Simulate error
    passwordErrors.currentPassword = 'Current password is incorrect'
    console.error('Password update error:', error)
  } finally {
    isChangingPassword.value = false
  }
}

// Save privacy settings function
const savePrivacySettings = async () => {
  isSavingPrivacy.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Saving privacy settings:', privacyData)  // Changed here
    
    // Show success message
    saveStatus.type = 'success'
    saveStatus.message = 'Privacy settings updated successfully!'
    
    // Close modal
    closePrivacyModal()
    
    // Clear message after 3 seconds
    setTimeout(() => {
      saveStatus.message = ''
    }, 3000)
    
  } catch (error) {
    console.error('Privacy settings error:', error)
  } finally {
    isSavingPrivacy.value = false
  }
}

const deleteAccount = () => {
  showDeleteConfirm.value = true
  deleteConfirmation.value = ''
}

const confirmDeleteAccount = () => {
  if (deleteConfirmation.value === 'DELETE') {
    console.log('Account deletion requested')
    showDeleteConfirm.value = false
    
    saveStatus.type = 'error'
    saveStatus.message = 'Account deletion request submitted. Check your email for confirmation.'
    
    setTimeout(() => {
      saveStatus.message = ''
    }, 4000)
  }
}

// Load saved settings (simulated)
onMounted(() => {
  // In a real app, you would load from localStorage or backend
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode) {
    preferences.darkMode = savedDarkMode === 'true'
  }
})
</script>