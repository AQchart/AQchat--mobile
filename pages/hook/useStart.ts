/*
 * @Author: howcode 1051495009@qq.com
 * @Date: 2024-04-22 20:26:00
 * @LastEditors: howcode 1051495009@qq.com
 * @LastEditTime: 2024-04-22 22:44:47
 * @Description: 
 */

import { ref,reactive,onMounted } from 'vue'
import multiavatar from '@multiavatar/multiavatar/esm'

export default ()=>{

  interface UserForm {
    userName:string,
    userAvatar:string
  }
  const step = ref(1)
  const userForm = reactive<UserForm>({
    userName:'',
    userAvatar:''
  })
  const reloadLoading = ref(true)

  onMounted(()=>{
    userForm.userName =  generateUsernameFun(4)
	initAvatar()
  })

  // 生成随机名
  const generateUsernameFun = (length:number)=>{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < length; i++) {
        username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return username;
  }
  
  const initAvatar = () => {
	  userForm.userAvatar = multiavatar(userForm.userName)
  }

  // 点击开启
  const toStartFun = ()=>{
    userForm.userName =  generateUsernameFun(4);
	initAvatar()
  }

  // 重新生成用户头像、姓名
  const reloadFun = ()=>{
    reloadLoading.value = false;
    setTimeout(()=>{
      reloadLoading.value = true;
      userForm.userName =  generateUsernameFun(4)
	  initAvatar()
    },100)
    
  }

  // 进入聊天室
  const enterChatFun = ()=>{
    
  }

  return{
    step,
    userForm,
    reloadLoading,
    toStartFun,
    reloadFun,
    enterChatFun
  }
}