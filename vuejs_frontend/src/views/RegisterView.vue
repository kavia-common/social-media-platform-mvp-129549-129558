<script setup lang="ts">
import { ref } from 'vue'
import { apiRegister } from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

async function onSubmit() {
  loading.value = true
  error.value = null
  success.value = null
  try {
    await apiRegister(username.value, password.value)
    success.value = 'Account created. You can now login.'
    setTimeout(() => router.push({ name: 'login' }), 600)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-wrap">
    <div class="card auth-card">
      <h2>Create account</h2>
      <p class="muted">Join SnapLite</p>

      <form @submit.prevent="onSubmit" class="form">
        <label>
          <span>Username</span>
          <input class="input" v-model="username" placeholder="yourname" required />
        </label>
        <label>
          <span>Password</span>
          <input class="input" v-model="password" type="password" placeholder="••••••••" required />
        </label>

        <button class="btn btn-primary" :disabled="loading" type="submit">
          {{ loading ? 'Creating…' : 'Create account' }}
        </button>
      </form>

      <p class="muted small">
        Already have an account?
        <router-link :to="{ name: 'login' }">Login</router-link>
      </p>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </div>
</template>

<style scoped>
.auth-wrap {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 64px);
}
.auth-card {
  width: 100%;
  max-width: 420px;
  display: grid;
  gap: 12px;
}
.form {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}
label span {
  display: block;
  font-size: 12px;
  color: #8e8e8e;
  margin-bottom: 6px;
}
.small { font-size: 12px; }
.error { color: #ed4956; margin-top: 8px; }
.success { color: #2f9e44; margin-top: 8px; }
</style>
