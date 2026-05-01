<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="bg-white text-gray-800">
      <q-toolbar class="h-14 px-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <q-btn
            flat
            round
            dense
            class="text-gray-500 hover:text-primary-600"
            @click="miniDrawer = !miniDrawer"
          >
            <q-icon size="28px" :name="miniDrawer ? 'chevron_right' : 'chevron_left'" />
          </q-btn>

          <span class="text-lg font-semibold text-gray-800">
            {{ t(pageTitle) }}
          </span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="288"
      :mini-width="71"
      :mini="miniDrawer"
      :breakpoint="600"
      bordered
      class="bg-gray-900 text-white"
    >
      <div :class="miniDrawer ? 'px-5' : ''" class="flex items-center no-wrap gap-3 h-14 border-b border-gray-700 px-4">
        <q-icon size="28px" name="mdi-apple-icloud" />
        <span v-if="!miniDrawer" class="text-lg text-white whitespace-nowrap">Название проекта</span>
      </div>

      <q-list class="p-2">
        <q-item
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          clickable
          v-ripple
          active-class="bg-primary-600 text-white rounded-lg"
          class="rounded-lg mb-1 text-gray-300"
        >
          <q-item-section avatar>
            <q-icon :name="link.meta.icon" size="22px" />
          </q-item-section>
          <q-item-section v-if="!miniDrawer">
            <q-item-label class="text-sm font-medium">{{ t(link.meta.title) }}</q-item-label>
          </q-item-section>
          <q-tooltip v-if="miniDrawer" anchor="center right" self="center left" class="bg-gray-800">
            {{ t(link.meta.title) }}
          </q-tooltip>
        </q-item>
      </q-list>

    </q-drawer>

    <q-page-container class="h-[100vh]">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import routes from "src/router/routes";
import {useRoute} from "vue-router";
import {useI18n} from "vue-i18n";

const { t } = useI18n()
const route = useRoute()

const menus = routes.find(el => el.name === 'CabinetPage')

const drawer = ref(false)
const miniDrawer = ref(false)
const navLinks = ref(menus?.children)

const pageTitle = computed(() => route.meta?.title)
</script>

<style lang="scss">
</style>
