<template>
  <!--
  ╔══════════════════════════════════════════════════════════╗
  ║  LAYOUT ШАБЛОН — Quasar 2 + Vue 3 + Tailwind            ║
  ║  Cursor промпт: см. cursor_prompts/LAYOUT_PROMPT.md      ║
  ╚══════════════════════════════════════════════════════════╝
  -->
  <q-layout view="lHh Lpr lff">

    <!-- ════════════ HEADER ════════════ -->
    <q-header class="bg-white border-b border-slate-200/80">
      <q-toolbar class="h-[60px] px-4 flex items-center justify-between gap-3">

        <!-- Toggle drawer -->
        <q-btn flat dense round
          :icon="!miniDrawer ? 'menu_open' : 'menu'"
          class="text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-150 rounded-xl"
          @click="miniDrawer = !miniDrawer"
        />

        <!-- Logo + App name -->
        <div class="flex items-center gap-2.5 flex-1">
          <!-- [CURSOR] Замени span на <img src="..." class="h-8"> если есть лого -->
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm">
            <q-icon name="bolt" size="18px" class="text-white" />
          </div>
          <span class="text-[15px] font-semibold text-slate-800 tracking-tight">
            <!-- [CURSOR] Название приложения -->
            {{ t(pageTitle) }}
          </span>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center gap-1">
          <!-- [CURSOR] Уведомления — убери если не нужно -->
          <q-btn flat dense round icon="notifications_none" size="md"
            class="text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-150 rounded-xl"
          >
            <q-badge color="red" floating rounded class="text-[10px]">3</q-badge>
            <q-tooltip class="bg-slate-800 text-xs">Уведомления</q-tooltip>
          </q-btn>

          <!-- [CURSOR] Аватар пользователя — убери если не нужно -->
          <q-btn flat dense round class="ml-1 rounded-xl">
            <q-avatar size="32px" class="bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs font-bold shadow-sm">
              <!-- [CURSOR] Инициалы пользователя -->
              AB
            </q-avatar>
            <q-tooltip class="bg-slate-800 text-xs">Профиль</q-tooltip>
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>

    <!-- ════════════ SIDEBAR DRAWER ════════════ -->
    <!--
      [CURSOR] Убери весь <q-drawer> если sidebar не нужен
      :width="256"     — ширина открытого
      :mini-width="68" — ширина мини-режима
    -->
    <q-drawer
      v-model="drawer"
      show-if-above
      :width="256"
      :mini-width="68"
      :mini="miniDrawer"
      :breakpoint="768"
      class="bg-slate-900 flex flex-col"
    >
      <div :class="{'px-5': miniDrawer}" class="flex items-center no-wrap gap-3 h-[60px] px-4 py-2 border-b border-slate-700/50">
        <q-icon size="28px" color="white" name="mdi-apple-icloud" />
        <span v-if="!miniDrawer" class="text-lg text-white whitespace-nowrap">Название проекта</span>
      </div>


      <!-- Nav links -->
      <!-- [CURSOR] Замени navLinks массив на свои пункты меню -->
      <q-list class="px-2 py-2 flex-1">
        <q-item
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          clickable
          v-ripple
          :active="route.name === link.name"
          active-class="!bg-emerald-600/20 !text-primary-400"
          class="
            rounded-xl mb-0.5 min-h-[42px]
            text-slate-400 hover:text-white hover:bg-slate-700/50
            transition-all duration-150 group
          "
        >
          <q-item-section avatar class="min-w-0 pr-0" :class="miniDrawer ? 'justify-center' : ''">
            <q-icon :name="link.meta.icon" size="20px" class="transition-colors duration-150" />
          </q-item-section>

          <q-item-section v-if="!miniDrawer" class="pl-2">
            <q-item-label class="text-sm font-medium">{{ t(link.meta.title) }}</q-item-label>
          </q-item-section>

          <q-tooltip v-if="miniDrawer" anchor="center right" self="center left"
            class="bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl"
          >
            {{ t(link.meta.title) }}
          </q-tooltip>
        </q-item>
      </q-list>

      <!-- User info bottom (убери если не нужен) -->
      <div :class="{'px-4': miniDrawer}" class="border-t border-slate-700/50 px-3 py-3">
        <div class="flex items-center gap-2.5">
          <q-avatar v-if="!miniDrawer" size="32px" class="bg-gradient-to-br from-primary-400 to-primary-600 text-white text-xs font-bold shrink-0">
            AB
          </q-avatar>
          <div v-if="!miniDrawer" class="flex-1 min-w-0">
            <!-- [CURSOR] Имя и роль пользователя -->
            <div class="text-sm font-medium text-slate-200 truncate">Имя Пользователя</div>
            <div class="text-[11px] text-slate-500 truncate">Администратор</div>
          </div>
          <q-btn
            flat
            dense
            class="p-2 text-slate-500 rounded-md hover:text-red-400 transition-colors duration-150"
          >
            <q-icon name="logout" size="18px" />
            <q-tooltip class="bg-slate-800 text-xs">Выйти</q-tooltip>
          </q-btn>
        </div>
      </div>

    </q-drawer>

    <!-- ════════════ PAGE CONTENT ════════════ -->
    <q-page-container class="bg-slate-50 h-[100vh]">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useRoute} from "vue-router";
import routes from "src/router/routes";
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
// Кастомные стили sidebar если нужны
</style>
