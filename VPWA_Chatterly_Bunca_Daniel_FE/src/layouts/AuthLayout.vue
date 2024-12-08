<script setup lang="ts">

import { useUserStore } from 'stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore()
const router = useRouter()

if (userStore.accessToken !== null) {
  router.replace({ name: 'home' })
}

</script>

<template>
  <div class="container">
    <div class="left">
      <q-img id="logo" src="src/assets/logo.png" fit="scale-down" />
      <p id="title">Chatterly</p>
      <p id="subtitle">The best place to chat !</p>
    </div>
    <div class="right">
      <router-view/>
    </div>
    <div class="divider"></div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  display: flex;
  height: 100vh;
  position: relative;
}

.left {
  width: 65%;
  justify-content: center;
  align-items: center;
  position: relative;
}

.right {
  width: 35%;
  position: relative;
}

.divider {
  position: absolute;
  left: 65%;
  top: 10%;
  height: 80%;
  width: 1px;
  background-color: black;
}

#logo {
  height: 40vh;
  margin-top: 18vh;
}

#title {
  text-align: center;
  font-size: 10vh;
  margin-bottom: 0;
}

#subtitle {
  text-align: center;
  font-size: 5vh;
  margin-bottom: 0;
}

@media (max-width: 1030px) {
  .left {
    display: none;
  }

  .right {
    width: 100%;
  }

  .divider {
    display: none;
  }
}
</style>
