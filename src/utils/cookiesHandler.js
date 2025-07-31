import { getCurrentInstance } from 'vue'

function getCookiesInstance() {
  const { appContext } = getCurrentInstance()
  return appContext.config.globalProperties.$cookies
}

export function setCookie(name, value, options = {}) {
  const $cookies = getCookiesInstance()
  $cookies.set(name, value, {
    path: '/',
    expires: '1d', // par défaut 1 jour
    ...options,
  })
}

export function getCookie(name) {
  const $cookies = getCookiesInstance()
  return $cookies.get(name)
}

export function removeCookie(name) {
  const $cookies = getCookiesInstance()
  $cookies.remove(name)
}
