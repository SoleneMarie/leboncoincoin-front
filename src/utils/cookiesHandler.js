import { getCurrentInstance } from 'vue'

export function useCookies() {
  const { appContext } = getCurrentInstance()
  const $cookies = appContext.config.globalProperties.$cookies

  return {
    set: (name, value, options = {}) => $cookies.set(name, value, { path: '/', ...options }),

    get: (name) => $cookies.get(name),

    remove: (name) => $cookies.remove(name),
  }
}
