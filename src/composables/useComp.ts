import { useQuasar } from "quasar";
import { push } from "notivue";
import {useI18n} from "vue-i18n";
function formatPrice(value: number): string {
  const val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatPhone(phone: string): string {
  let retVal;
  if (phone) {
    if (phone.length === 9) {
      retVal = `(${phone.substring(0, 2)}) ${phone.substring(2, 5)}-${phone.substring(5, 7)}-${phone.substring(7, 9)}`;
    } else {
      const result = phone.slice(-9);
      retVal = `(${result.substring(0, 2)}) ${result.substring(2, 5)}-${result.substring(5, 7)}-${result.substring(7, 9)}`;
    }
  } else {
    retVal = "";
  }
  return retVal;
}
function formatDate(dateString: number | string | null) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

function tableFilterQuery(filter: {[key: string]: any}, is_not_pagination?: number) {
  if (!filter) return "?";
  let queryArray: any[] = [];
  Object.keys(filter).map((objectKey, index) => {
    let value = filter[objectKey];
    if (value === undefined || value === null || value.length === 0) return;
    else
      queryArray.push(objectKey + "=" + value);
  });
  if (queryArray.length !== 0) return (is_not_pagination ? "?" : "?") + queryArray.join("&");
  else return "?";
}

function parsePaginationQuery(pagination: {[key: string]: string | number}) {
  const queryArray = [];

  if (!pagination) {
    return "";
  }
  if (pagination.sortBy) {
    queryArray.push("sortBy=" + pagination.sortBy);
  }
  if (pagination.descending !== undefined)
    queryArray.push("descending=" + pagination.descending);

  if (pagination.page) queryArray.push("page=" + pagination.page);
  if (pagination.rowsPerPage)
    queryArray.push("perPage=" + pagination.rowsPerPage);
  if (pagination.branches_id)
    queryArray.push("branches_id=" + pagination.branches_id);

  if (queryArray.length !== 0) return "&" + queryArray.join("&");
  else return "";
}

function retTextByLocale(obj: {[key: string]: string | number | null | undefined} | undefined, fieldName: string): string | number | null | undefined {
  const locale = useI18n().locale
  if (obj) return obj[`${fieldName}_${locale.value}`] || obj[fieldName]
  else return ""
}

function showError(error: {errorMessage: string, errorCode?: number, errorDescription?: string}) {
  if (!error.errorMessage) return;

  push.error({
    title: error.errorMessage,
    message: error.errorDescription || '',
  })
}

export const useComp = () => {
  const $q = useQuasar()
  const { t } = useI18n()
  function ask(title, message, callback) {
    $q.notify({
      caption: title,
      message: message,
      timeout: 0,
      icon: 'mdi-comment-question-outline',
      color: 'primary',
      position: 'center',
      actions: [
        { label: t('system.No'), color: 'white' },
        { label: t('system.Yes'), color: 'yellow', handler: callback },
      ]
    })
  }

  return {
    formatPrice,
    formatPhone,
    formatDate,
    tableFilterQuery,
    parsePaginationQuery,
    retTextByLocale,
    showError,
    ask,
  };
};
