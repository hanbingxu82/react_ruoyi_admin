/*
 * @Author: your name
 * @Date: 2021-11-08 15:41:03
 * @LastEditTime: 2021-11-09 08:51:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/utils/validate.ts
 */
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
    return /^(https?:|mailto:|tel:)/.test(path)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validUsername(str: string) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
  }
  
  /**
   * @param {string} url
   * @returns {Boolean}
   */
  export function validURL(url: string) {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validLowerCase(str: string) {
    const reg = /^[a-z]+$/
    return reg.test(str)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validUpperCase(str: string) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function validAlphabets(str: string) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
  }
  
  /**
   * @param {string} email
   * @returns {Boolean}
   */
  export function validEmail(email: string) {
    const reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$")
    // const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
  }
  
  /**
   * @param {string} str
   * @returns {Boolean}
   */
  export function isString(str: any) {
    if (typeof str === 'string' || str instanceof String) {
      return true
    }
    return false
  }
  
  /**
   * @param {Array} arg
   * @returns {Boolean}
   */
  export function isArray(arg: any) {
    if (typeof Array.isArray === 'undefined') {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
  }
  