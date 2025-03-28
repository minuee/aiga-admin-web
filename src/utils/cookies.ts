import { Cookies } from 'react-cookie';

const cookies = new Cookies;

export const setCookie = ( COOKIE_KEY :string , COOKIE_VALUE : string , COOKIE_OPTION? : any ) => {
  return cookies.set(COOKIE_KEY,COOKIE_VALUE,{...COOKIE_OPTION})
}

export const getCookie = (COOKIE_KEY : string) => {
  return cookies.get(COOKIE_KEY)
}

export const removeCookie = (COOKIE_KEY : string) => {
  return cookies.remove(COOKIE_KEY,{path : '/'})
}
