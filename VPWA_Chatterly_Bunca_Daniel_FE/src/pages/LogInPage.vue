<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { login } from 'boot/api';

const q = useQuasar()
const router = useRouter()

const emailField = ref('')
const passwordField = ref('')

const showPassword = ref(false);

const logInTapped = async () => {

  const email = emailField.value
  const password = passwordField.value

  if (email === '' || validateEmail(email) !== true) {
    q.notify({
      type: 'negative',
      icon: 'mail',
      message: 'Enter your email address',
      color: 'red-5',
      position: 'center',
      timeout: 500
    })
    return
  }

  if (password === '') {
    q.notify({
      type: 'negative',
      icon: 'lock',
      message: 'Enter your password',
      color: 'red-5',
      position: 'center',
      timeout: 500
    })
    return
  }

  try {
    await login(email, password)
    await router.push({ name: 'home' })
  } catch (error) {
    if (error instanceof Error) {
      q.notify({
        type: 'negative',
        icon: 'warning',
        message: error.message,
        color: 'red-5',
        position: 'center',
        timeout: 500
      })
    }
  }

}

defineOptions(
  {
    name: 'LogInLayout'
  }
)

function validateEmail(val: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(val)) {
    return true
  } else {
    return 'Please enter a valid email'
  }
}


const handleEnterKey = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    logInTapped()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEnterKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEnterKey)
})

</script>

<template>
  <div id="right-content">
    <p id="welcomeTitle">Welcome !</p>
    <p id="welcomeSubtitle">Log in with your account or create one.</p>

    <q-input
      id="emailField"
      label="E-mail"
      type="email"
      placeholder=""
      v-model="emailField"
      :rules="[validateEmail]"
      outlined
      dense
      :style="{ marginBottom: '1vh' }"
    />

    <q-input
      id="passwordField"
      label="Password"
      :type="showPassword ? 'text' : 'password'"
      placeholder=""
      v-model="passwordField"
      outlined
      dense
      :style="{ marginBottom: '3vh' }"
    > 
      <template v-slot:append>
        <q-icon
          :name="showPassword ? 'visibility' : 'visibility_off'"
          class="cursor-pointer"
          @click="showPassword = !showPassword"
        />
      </template>
     </q-input>
    <q-btn
      id="logInButton"
      label="Log In"
      color="black"
      @click="logInTapped"
      no-caps
      unelevated
      dense
    />

    <p id="createAccountLabel">
      Don’t have an account yet ?
      <u>
        <router-link :to="{ name: 'register' }">
          Create one
        </router-link>
      </u>
    </p>

  </div>
</template>

<style scoped>

#right-content {
  width: 75%;
  margin-top: 25vh;
  margin-left: 12.5%;
}

#welcomeTitle {
  text-align: center;
  font-size: 6vh;
  margin-bottom: 0;
}

#welcomeSubtitle {
  text-align: center;
  font-size: 2vh;
  margin-bottom: 3vh;
}

#logInButton {
  width: 90%;
  margin-left: 5%;
  margin-bottom: 3vh;
}

#createAccountLabel {
  font-size: 1.8vh;
  text-align: center;
}

</style>
