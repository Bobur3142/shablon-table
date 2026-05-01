<template>
  <div class="flex h-full flex-col gap-4 p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold tracking-tight text-slate-800">
          {{ t('modules.userRoles') }}
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <q-btn
          flat
          dense
          icon="refresh"
          size="md"
          class="rounded-lg bg-slate-900 px-2 py-1.5 text-white"
          :loading="loading"
          @click="refresh"
        >
          <q-tooltip class="bg-slate-900 text-xs">{{ t('captions.refresh') }}</q-tooltip>
        </q-btn>

        <q-btn
          flat
          dense
          size="md"
          class="rounded-lg bg-sky-600 px-3 py-1.5 normal-case text-white"
          :loading="loading"
          @click="openCreate"
        >
          <div class="flex items-center gap-2">
            <q-icon size="sm" name="add" />
            <span>{{ t('captions.add') }}</span>
          </div>
        </q-btn>
      </div>
    </div>

    <q-table
      ref="tableRef"
      flat
      row-key="id"
      :rows="rows"
      :columns="columns"
      :loading="loading"
      v-model:pagination="pagination"
      :rows-per-page-options="[10, 20, 50, 100]"
      class="my-sticky-header-table w-full flex-1 rounded-lg border border-slate-200/80 bg-white shadow-sm"
      table-header-class="bg-slate-50 text-slate-700 uppercase tracking-wider"
      style="height: calc(100vh - 220px)"
      @request="getData"
    >
      <template #loading>
        <q-inner-loading showing>
          <q-spinner-dots size="36px" color="primary" />
        </q-inner-loading>
      </template>

      <template #no-data>
        <div class="flex w-full flex-col items-center gap-3 py-16">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <q-icon name="inbox" size="32px" class="text-slate-300" />
          </div>
          <div class="text-center">
            <p class="text-sm font-medium text-slate-500">{{ t('system.noData') }}</p>
          </div>
        </div>
      </template>

      <template #body-cell-status="{ row }">
        <q-td>
          <span
            class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
            :class="statusClass(row.status)"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {{ row.status }}
          </span>
        </q-td>
      </template>

      <template #body-cell-descriptions="{ row }">
        <q-td>
          <div class="flex flex-col text-sm text-slate-700">
            <span>{{ row.description_ru }}</span>
            <span>{{ row.description_uk }}</span>
            <span>{{ row.description_uz }}</span>
          </div>
        </q-td>
      </template>

      <template #body-cell-actions="{ row }">
        <q-td class="text-right">
          <div class="flex items-center justify-end">
            <q-btn
              flat
              round
              dense
              icon="published_with_changes"
              size="sm"
              class="rounded-lg text-slate-400 transition-all duration-150 hover:bg-amber-50 hover:text-amber-700"
              @click="onChangeStatus(row)"
            >
              <q-tooltip class="bg-slate-900 text-xs">{{ t('captions.changeStatus') }}</q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="createDialog" persistent>
      <q-card class="w-full max-w-[720px] !rounded-lg">
        <div class="flex items-center justify-between px-5 py-2">
          <div class="text-base font-semibold text-slate-800">{{ t('captions.add') }}</div>
          <q-btn
            flat
            round
            dense
            icon="close"
            class="rounded-lg text-slate-500 hover:bg-slate-100"
            @click="closeCreate"
          />
        </div>

        <q-separator />

        <q-form @submit.prevent="onCreateSubmit">
          <div class="grid grid-cols-1 gap-4 py-5 px-5 md:grid-cols-2">
            <q-input
              v-model="formBean.name"
              outlined
              dense
              :label="t('captions.name')"
              :rules="[requiredRule]"
            />
            <q-input
              v-model="formBean.name_ru"
              outlined
              dense
              :label="t('captions.nameRu')"
              :rules="[requiredRule]"
            />
            <q-input
              v-model="formBean.name_uk"
              outlined
              dense
              :label="t('captions.nameUk')"
            />
            <q-input
              v-model="formBean.name_uz"
              outlined
              dense
              :label="t('captions.nameUz')"
            />
          </div>

          <q-separator />

          <div class="py-3 flex items-center justify-end gap-2 px-5">
            <q-btn
              flat
              dense
              type="button"
              class="rounded-lg border border-slate-200 px-4 py-2 normal-case text-slate-700"
              @click="closeCreate"
            >
              {{ t('captions.cancel') }}
            </q-btn>
            <q-btn
              flat
              dense
              type="submit"
              class="rounded-lg bg-emerald-600 px-4 py-2 normal-case text-white"
              :loading="createLoading"
            >
              {{ t('captions.save') }}
            </q-btn>
          </div>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { $axios } from 'src/boot/axios'
import { urls } from 'src/boot/constants'
import { useComp } from 'src/composables/useComp'

type UserRoleRow = {
  id: number
  name: string
  status: string
  name_ru?: string
  name_uk?: string
  name_uz?: string
  description_ru?: string
  description_uk?: string
  description_uz?: string
}

type CreateUserRoleForm = {
  name: string
  name_ru: string
  name_uk: string
  name_uz: string
}

const { t } = useI18n()
const { parsePaginationQuery, showError, tableFilterQuery, ask } = useComp()

const tableRef = ref()
const rows = ref<UserRoleRow[]>([])
const loading = ref(false)

const pagination = ref({
  sortBy: 'id',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const filter = ref<Record<string, any>>({})

const columns = computed(() => [
  { name: 'id', label: t('captions.id'), align: 'left', field: 'id', sortable: true, style: 'width: 70px' },
  { name: 'name', label: t('captions.name'), align: 'left', field: 'name', sortable: true },
  { name: 'status', label: t('captions.status'), align: 'left', field: 'status', sortable: true, style: 'width: 140px' },
  { name: 'name_ru', label: t('captions.nameRu'), align: 'left', field: 'name_ru', sortable: false },
  { name: 'name_uk', label: t('captions.nameUk'), align: 'left', field: 'name_uk', sortable: false },
  { name: 'name_uz', label: t('captions.nameUz'), align: 'left', field: 'name_uz', sortable: false },
  { name: 'descriptions', label: t('captions.descriptions'), align: 'left', field: 'description_ru', sortable: false },
  { name: 'actions', label: t('captions.actions'), align: 'right', field: 'actions', sortable: false, style: 'width: 110px' },
])

function statusClass(status?: string) {
  const s = String(status ?? '').toLowerCase()
  if (['active', '1', 'true', 'enabled'].includes(s)) return 'bg-emerald-100 text-emerald-700'
  if (['inactive', '0', 'false', 'disabled'].includes(s)) return 'bg-slate-100 text-slate-600'
  if (['pending', 'wait', 'new'].includes(s)) return 'bg-amber-100 text-amber-700'
  if (['blocked', 'banned', 'deleted'].includes(s)) return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-600'
}

async function getData(params: any) {
  loading.value = true
  pagination.value = params.pagination

  await $axios
    .get(urls.USER_ROLES + tableFilterQuery(params.filter) + parsePaginationQuery(params.pagination))
    .then((res) => {
      rows.value = res.data?.rows ?? []
      pagination.value.rowsNumber = res.data?.total ?? 0
    })
    .catch((err) => showError(err))
    .finally(() => (loading.value = false))
}

function refresh() {
  getData({ filter: filter.value, pagination: pagination.value })
}

function onChangeStatus(row: UserRoleRow) {
  ask(t('modules.userRoles'), t('system.confirm'), async () => {
    loading.value = true
    await $axios
      .put(urls.USER_ROLES + '/status', { id: row.id })
      .then(() => refresh())
      .catch((err) => showError(err))
      .finally(() => (loading.value = false))
  })
}

const createDialog = ref(false)
const createLoading = ref(false)
const defaultFormBean: CreateUserRoleForm = {
  name: '',
  name_ru: '',
  name_uk: '',
  name_uz: '',
}
const formBean = ref<CreateUserRoleForm>({ ...defaultFormBean })

function openCreate() {
  formBean.value = { ...defaultFormBean }
  createDialog.value = true
}

function closeCreate() {
  createDialog.value = false
}

function requiredRule(val: any) {
  return (val !== null && val !== undefined && String(val).trim().length > 0) || t('system.required')
}

function onCreateSubmit() {
  ask(t('modules.userRoles'), t('system.confirm'), async () => {
    createLoading.value = true
    await $axios
      .post(urls.USER_ROLES, formBean.value)
      .then(() => {
        closeCreate()
        refresh()
      })
      .catch((err) => showError(err))
      .finally(() => (createLoading.value = false))
  })
}

onMounted(() => {
  refresh()
})
</script>

<style></style>

