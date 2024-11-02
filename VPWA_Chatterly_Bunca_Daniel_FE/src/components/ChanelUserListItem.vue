<script setup lang="ts">
import { Sender } from 'components/models';
import { useSettingsStore } from 'stores/settingsStore';
const props = withDefaults(defineProps<Sender>(), {});
const settingsStore = useSettingsStore()

function getStateColor(stateId: number) {
  return settingsStore.userStates.find(state => state.id === stateId)?.color
}
</script>

<template>
  <div id="container">
    <div id="avatar-container">
      <q-avatar
        id="accountAvatar"
        color="grey-4"
        size="6.5vh"
        font-size="80%"
        text-color="white"
        :icon="'img:https://ui-avatars.com/api/?name=' + props.name[0] + '+' + props.surname[0]"
      />
      <q-avatar
        id="statusAvatar"
        :color="getStateColor(props.stateId)"
        size="2vh"
      />
    </div>

    <div id="account-info-container">
      <p id="nameSurnameLabel">
        {{ props.name }} {{ props.surname }}
      </p>
      <p id="nicknameLabel">@{{ props.nickname }}</p>
    </div>
  </div>
</template>

<style scoped>

#container {
  display: flex;
  align-items: center;
  padding: 3%;
}

#avatar-container {
  display: flex;
  position: relative;
  align-items: center;
}

#statusAvatar {
  position: absolute;
  left: 70%;
  bottom: 5%;
}

#account-info-container {
  margin-left: 10px;
}

#nameSurnameLabel {
  font-weight: bold;
  margin-bottom: 0;
}

#nicknameLabel {
  margin-bottom: 0;
}

</style>
