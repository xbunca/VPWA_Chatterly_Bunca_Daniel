<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const q = useQuasar()
const router = useRouter()

const emailField = ref('')
const passwordField = ref('')

const logInTapped = () => {

  const email = emailField.value
  const password = passwordField.value

  if (email === '' || validateEmail(email) !== true) {
    q.notify({
      type: 'negative',
      icon: 'mail',
      message: 'Enter your email address!',
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
      message: 'Enter your password!',
      color: 'red-5',
      position: 'center',
      timeout: 500
    })
    return
  }

  router.push({ name: 'home' })

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
      type="password"
      placeholder=""
      v-model="passwordField"
      outlined
      dense
      :style="{ marginBottom: '3vh' }"
    />

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
