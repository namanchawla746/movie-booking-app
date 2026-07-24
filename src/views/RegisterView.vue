<template>
  <v-container class="fill-height justify-center">
    <v-card width="420" color="#12141c" class="pa-6 rounded-xl elevation-12">
      <div class="text-center mb-6">
        <h2 class="text-h4 font-weight-black text-white">Create Account 🎬</h2>
        <p class="text-caption text-grey">Join CinePass for instant ticket booking</p>
      </div>

      <v-form @submit.prevent="handleRegister">
        <v-text-field
          v-model="name"
          label="Full Name"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          color="indigo-accent-2"
          class="mb-2"
          required
        ></v-text-field>

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
          Register
        </v-btn>
      </v-form>

      <div class="text-center mt-6 text-body-2 text-grey">
        Already have an account?
        <router-link to="/login" class="text-indigo-accent-2 font-weight-bold text-decoration-none">
          Login Here
        </router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const handleRegister = async () => {
  loading.value = true;
  try {
    const newUser = {
      name: name.value,
      email: email.value,
      password: password.value
    };

    await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    alert('🎉 Account created! Please login now.');
    router.push('/login');
  } catch (err) {
    alert('Failed to register');
  } finally {
    loading.value = false;
  }
};
</script>