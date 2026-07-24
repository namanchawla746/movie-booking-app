<template>
  <v-container class="fill-height justify-center">
    <v-card width="420" color="#12141c" class="pa-6 rounded-xl elevation-12 border-glass">
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
          class="rounded-lg font-weight-bold text-none"
          :loading="loading"
        >
          Register
        </v-btn>
      </v-form>

      <div class="text-center mt-6 text-body-2 text-grey">
        Already have an account?
        <router-link to="/login" class="text-indigo-accent-2 font-weight-bold text-decoration-none ms-1">
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
  if (!name.value || !email.value || !password.value) {
    alert('Please fill in all fields.');
    return;
  }

  loading.value = true;

  try {
    const newUser = {
      id: Date.now(),
      name: name.value,
      email: email.value.trim().toLowerCase(),
      password: password.value
    };

    // Store created user in localStorage for client-side persistence
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if email already exists
    const userExists = existingUsers.some(u => u.email === newUser.email);
    if (userExists) {
      alert('An account with this email already exists!');
      loading.value = false;
      return;
    }

    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    alert('🎉 Account created successfully! Please login now.');
    router.push('/login');
  } catch (err) {
    console.error('Registration error:', err);
    alert('Failed to register. Please try again.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
</style>