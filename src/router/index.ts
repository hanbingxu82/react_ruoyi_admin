/*
 * @Author: your name
 * @Date: 2021-03-05 16:36:31
 * @LastEditTime: 2021-10-09 10:40:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /blogreact/src/router/router.tsx
 */
import App from '../views/App/App';
// import Details from '../views/Details/Details';
// import Details from '../views/Details/Details'
// import Messages from '../views/Messages/Messages';
// import Resumes from '../views/Resumes/Resumes';
// import NoMatch from '../views/NoMatch/NoMatch';

const routers = [{
  path:'/',
  exact: true,
  component: App
},
// {
//   path:'/Details',
//   exact: false,// 严格匹配
//   component: Details
// },
// {
//   path:'/Messages',
//   exact: false,
//   component: Messages
// },
// {
//   path:'/Resumes',
//   exact: false,
//   component: Resumes
// },
// {
//   path: '',
//   exact: false,
//   component: NoMatch
// }
];
export default routers;