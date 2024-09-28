<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const q = useQuasar()
const router = useRouter()

const nameField = ref('')
const surnameField = ref('')
const nicknameField = ref('')
const emailField = ref('')
const passwordField = ref('')

const createAccountTapped = () => {

  const name = nameField.value
  const surname = surnameField.value
  const nickname = nicknameField.value
  const email = emailField.value
  const password = passwordField.value

  if (name === '') {
    q.notify({
      type: 'negative',
      icon: 'person',
      message: 'Enter your name!',
      color: 'red-5',
      position: 'center',
      timeout: 500
    })
    return
  }

  if (surname === '') {
    q.notify({
      type: 'negative',
      icon: 'person',
      message: 'Enter your surname!',
      color: 'red-5',
      position: 'center',
      timeout: 500
    })
    return
  }

  if (nickname === '') {
    q.notify({
      type: 'negative',
      icon: 'person',
      message: 'Enter your nickname!',
      color: 'red-5',
      position: 'center',
      timeout: 500
    })
    return
  }

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

function validateEmail(val) {
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
    <p id="createAccountTitle">Account creation</p>
    <p id="createAccountSubtitle">Please enter your information.</p>

    <div id="name-surname-container">
      <q-input
        id="nameField"
        label="Name"
        type="name"
        placeholder=""
        v-model="nameField"
        outlined
        dense
        :style="{ width: '45%' }"
      />

      <q-input
        id="surnameField"
        label="Surname"
        type="surname"
        placeholder=""
        v-model="surnameField"
        outlined
        dense
        :style="{ width: '45%' }"
      />
    </div>

    <q-input
      id="nicknameField"
      label="Nickname"
      type="nickname"
      placeholder=""
      v-model="nicknameField"
      outlined
      dense
      :style="{ marginBottom: '3vh' }"
    />

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
      id="createAccountButton"
      label="Create account"
      color="black"
      @click="createAccountTapped"
      no-caps
      unelevated
      dense
    />

    <p id="logInLabel">
      Do you have an account already ?
      <u>
        <router-link :to="{ name: 'login' }">
          Log In
        </router-link>
      </u>
    </p>

  </div>
</template>

<style scoped>

#right-content {
  width: 75%;
  margin-top: 22vh;
  margin-left: 12.5%;
}

#createAccountTitle {
  text-align: center;
  font-size: 6vh;
  margin-bottom: 0;
}

#createAccountSubtitle {
  text-align: center;
  font-size: 2vh;
  margin-bottom: 3vh;
}

#name-surname-container {
  display: flex;
  gap: 10%;
  margin-bottom: 3vh;
}

#createAccountButton {
  width: 90%;
  margin-left: 5%;
  margin-bottom: 3vh;
}

#logInLabel {
  font-size: 1.8vh;
  text-align: center;
}

</style>
