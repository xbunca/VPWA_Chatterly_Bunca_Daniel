<script setup lang="ts">

import { UserState } from 'components/models';
import { useUserStore } from 'stores/userStore';

const props = withDefaults(defineProps<UserState>(), {});

const userStore = useUserStore();

function onUserStateClicked() {
  userStore.user.stateId = props.id;
}

</script>

<template>
  <q-item clickable v-close-popup @click="onUserStateClicked">
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
        {{ name }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<style scoped>

#avatar-section {
  align-items: center;
}

</style>
