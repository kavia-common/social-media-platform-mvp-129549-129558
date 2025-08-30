<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const router = useRouter()

const isAuthed = computed(() => auth.isAuthenticated)
const userName = computed(() => auth.user?.username ?? '')
const isAdmin = computed(() => auth.user?.is_admin ?? false)

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand" @click="$router.push({ name: 'feed' })">
        <div class="logo-dot" />
        <span class="brand-text">SnapLite</span>
      </div>
      <nav class="nav-actions">
        <RouterLink v-if="!isAuthed" class="btn btn-ghost" :to="{ name: 'login' }">Login</RouterLink>
        <RouterLink v-if="!isAuthed" class="btn btn-ghost" :to="{ name: 'register' }">Register</RouterLink>

        <div v-if="isAuthed" class="profile">
          <RouterLink class="btn btn-ghost" :to="{ name: 'feed' }">Feed</RouterLink>
          <RouterLink class="btn btn-ghost" :to="{ name: 'profile', params: { username: userName } }">
            {{ userName || 'Profile' }}
          </RouterLink>
          <span v-if="isAdmin" class="badge">Admin</span>
          <button class="btn btn-accent" @click="logout">Logout</button>
        </div>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
:root {
  --primary: #3897f0;
  --secondary: #262626;
  --accent: #ed4956;
}

.app-shell {
  min-height: 100vh;
  background: #fff;
  color: var(--secondary);
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #efefef;
  background: #fff;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.logo-dot {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, var(--accent), var(--primary));
  border-radius: 6px;
}
.brand-text {
  font-weight: 700;
  letter-spacing: .3px;
  color: var(--secondary);
}

.nav-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn {
  border: 1px solid transparent;
  background: transparent;
  color: var(--secondary);
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn:hover {
  background: #f7f8fa;
}
.btn-ghost {
  border-color: transparent;
}
.btn-accent {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.btn-accent:hover {
  filter: brightness(0.95);
}

.badge {
  font-size: 12px;
  color: #fff;
  background: var(--primary);
  border-radius: 999px;
  padding: 4px 8px;
  margin-right: 4px;
}

.content {
  max-width: 760px;
  margin: 0 auto;
  padding: 16px;
}
</style>
