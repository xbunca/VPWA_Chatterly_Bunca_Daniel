<script setup lang="ts">
</script>

<template>
  <div id="intro-screen">
    <div id="intro-content">
      <h1>Welcome to Chatterly</h1>
      <p>Select or join a chat to start messaging with your friends.</p>
    </div>
  </div>
</template>

<style scoped>
#intro-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  background-color: transparent;
}

#intro-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-bottom: 1rem;
  font-size: 2.5rem;
  color: #333;
}

p {
  margin-bottom: 2rem;
  font-size: 1.25rem;
  color: #555;
}

@media (max-width: 850px) {
  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
