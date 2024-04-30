import * as Pinia from 'pinia';

import { createUnistorage } from '/uni_modules/pinia-plugin-unistorage'

const pinia = Pinia.createPinia()
pinia.use(createUnistorage())

export default pinia