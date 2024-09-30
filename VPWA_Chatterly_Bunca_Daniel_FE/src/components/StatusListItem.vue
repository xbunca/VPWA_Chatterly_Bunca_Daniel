<script setup>

const props = defineProps({
  color: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  onClickEvent: {
    type: Function,
    required: true
  }
})

</script>

<template>
  <q-item clickable v-close-popup @click="onClickEvent">
    <q-item-section
      id="avatar-section"
      avatar>
      <q-avatar
        icon=""
        :color="color"
        size="xs"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        {{ props.title }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<style scoped>

#avatar-section {
  align-items: center;
}

</style>
