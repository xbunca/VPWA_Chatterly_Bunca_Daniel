<script setup lang="ts">

import { UserState } from 'components/models';
import { useUserStore } from 'stores/userStore';
import { updateUserState } from 'boot/api';

const props = withDefaults(defineProps<UserState>(), {});

const userStore = useUserStore();

async function onUserStateClicked() {
  const account = await updateUserState(props.id)
  userStore.user.stateId = account.stateId;
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
