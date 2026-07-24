<template>
  <v-container class="fill-height justify-center">
    <v-card width="420" color="#12141c" class="pa-6 rounded-xl elevation-12">
      <div class="text-center mb-6">
        <h2 class="text-h4 font-weight-black text-white">Welcome Back 👋</h2>
        <p class="text-caption text-grey">Login to access your tickets & bookings</p>
      </div>

      <v-form @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          label="Email Address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          color="indigo-accent-2"
          class="mb-2"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          prepend-inner-icon="mdi-lock-outline"
          type="password"
          variant="outlined"
          color="indigo-accent-2"
          class="mb-4"
          required
        ></v-text-field>

        <v-btn
          type="submit"
          block
          color="indigo-accent-3"
          size="large"
          class="rounded-lg font-weight-bold"
          :loading="loading"
        >
          Login
        </v-btn>
      </v-form>

      <div class="text-center mt-6 text-body-2 text-grey">
        Don't have an account?
        <router-link to="/register" class="text-indigo-accent-2 font-weight-bold text-decoration-none">
          Register Here
        </router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authStore } from '@/stores/auth'; // Reactive store import

const email = ref('');
const password = ref('');
const loading = ref(false);

const router = useRouter();
const route = useRoute();

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Please enter both Email and Password!');
    return;
  }

  loading.value = true;
  try {
    // 1. Static db.json fetch karo
    const res = await fetch('/db.json');
    const data = await res.json();
    
    // 2. Full object me se users extract karo
    const users = data.users || [];

    const cleanEmail = email.value.trim().toLowerCase();
    const cleanPassword = password.value.trim();

    // 3. Match user from db.json
    const foundUser = users.find(
      (u) => u.email && u.email.trim().toLowerCase() === cleanEmail && String(u.password).trim() === cleanPassword
    );

    if (foundUser) {
      authStore.login(foundUser);

      alert('🎉 Login Successful!');

      const redirectPath = route.query.redirect || '/';
      router.push(redirectPath);
    } else {
      alert('❌ Invalid Email or Password');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('❌ Could not load user data from db.json. Please check if db.json is in public folder.');
  } finally {
    loading.value = false;
  }
};
</script>