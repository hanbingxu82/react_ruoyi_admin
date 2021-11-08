/*
 * @Author: your name
 * @Date: 2021-11-08 16:07:50
 * @LastEditTime: 2021-11-08 16:11:26
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /use-hooks/src/assets/icons/index.js
 */

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)