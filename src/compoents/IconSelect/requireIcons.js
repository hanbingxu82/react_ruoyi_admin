/*
 * @Author: your name
 * @Date: 2021-11-10 11:42:05
 * @LastEditTime: 2021-11-10 11:42:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /use-hooks/src/compoents/IconSelect/requireIcons.js
 */

const req = require.context('../../assets/icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

const icons = requireAll(req).map(i => {
  return i.match(re)[1]
})

export default icons
