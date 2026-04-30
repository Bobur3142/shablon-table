import { defineBoot } from '#q-app/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = typeof messages['uz'];

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}

  export interface DefineDateTimeFormat {}

  export interface DefineNumberFormat {}
}

export default defineBoot(({ app }) => {
  const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
    locale: 'uz',
    legacy: false,
    messages,
  });

  app.use(i18n);
});
