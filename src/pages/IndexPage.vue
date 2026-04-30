<template>
<div class="flex justify-center items-center h-[100vh]">
  <div class="w-[400px] flex flex-col gap-2">
    {{ t('system.login') }}

    <q-input
      dense
      placeholder="login"
      outlined
      v-model="bean.login"
    />

    <q-input
      dense
      placeholder="password"
      outlined
      type="number"
      v-model="bean.password"
    />

    <q-btn label="Submit" color="primary" @click="clickFun()" />
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { $axios } from "boot/axios";
import { urls } from "boot/constants";
import { useComp } from "src/composables/useComp";
import { piniaState } from "stores/piniaState";
import { useRouter } from "vue-router";

const router = useRouter()

const { t } = useI18n()
const { showError } = useComp()

const bean = ref({
  login: "chief_admin",
  password: 123,
})

function clickFun(){
  $axios.post(urls.LOGIN, bean.value,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  ).then(res => {
    console.log(res.data)
    if (res && res.data) {
      const auth = {
        token: res.data.token,
        refresh_token: res.data.refresh_token,
      };

      piniaState().accessList = res.data.accessList
      piniaState().auth = auth;

      router.push({ name: 'Tabel' })
    }
  }).catch(err => {
    showError(err)
  })
}
</script>

<style lang="scss"></style>
