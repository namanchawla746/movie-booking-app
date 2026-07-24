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
    const res = await fetch('http://localhost:3001/users');
    const users = await res.json();

    const cleanEmail = email.value.trim().toLowerCase();
    const cleanPassword = password.value.trim();

    // Find matching user from db.json
    const foundUser = users.find(
      (u) => u.email && u.email.trim().toLowerCase() === cleanEmail && String(u.password).trim() === cleanPassword
    );

    if (foundUser) {
      // Save state directly into authStore & localStorage ('currentUser')
      authStore.login(foundUser);

      alert('🎉 Login Successful!');

      // Agar user booking/kisi specific page se redirect hokar aaya tha, toh wahan waapas bhejo
      const redirectPath = route.query.redirect || '/';
      router.push(redirectPath);
    } else {
      alert('❌ Invalid Email or Password');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('❌ Failed to connect to server. Make sure json-server is running on port 3001!');
  } finally {
    loading.value = false;
  }
};
</script>