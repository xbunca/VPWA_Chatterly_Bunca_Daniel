<script setup lang="ts">

export interface Status {
  color?: string;
  title?: string;
  onClickEvent?: () => void;
}

withDefaults(defineProps<Status>(), {});

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
        {{ title }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<style scoped>

#avatar-section {
  align-items: center;
}

</style>
