<template>
  <div class="container">
    <div class="download-logo fr ac jc">
      <img src="../assets/images/logo.png" alt="">
    </div>
    <div class="download-box">
      <a-input v-model:value="videoUrl" size="large" placeholder="Please enter video URL" @keydown.enter="download" @click.right="showContextmenu">
        <template #addonAfter>
          <ArrowDownOutlined v-if="!loading" :style="{fontSize: '18px', color: '#ffffff'}" @click="download" />
          <LoadingOutlined v-else :style="{fontSize: '18px', color: '#ffffff'}" />
        </template>
      </a-input>
    </div>
    <div class="setting">
      <SettingOutlined :style="{fontSize: '18px'}" @click="settingDrawer.open()" />
    </div>
    <div class="user">
      <UserOutlined :style="{fontSize: '18px'}" @click="userModal.toogleVisible()" />
    </div>
  </div>
  <UserModal ref="userModal" />
  <SettingDrawer ref="settingDrawer" />
  <LoginModal ref="loginModal" />
  <VideoModal ref="videoModal" />
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { UserOutlined, ArrowDownOutlined, SettingOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { store } from '../store'
import { checkUrl, checkLogin, checkUrlRedirect, parseHtml } from '../core/bilibili'
import UserModal from '../components/UserModal/index.vue'
import SettingDrawer from '../components/SettingDrawer/index.vue'
import LoginModal from '../components/LoginModal/index.vue'
import VideoModal from '../components/VideoModal/index.vue'

const videoUrl = ref<string | null>(null)
const loading = ref<boolean>(false)
const userModal = ref<any>(null)
const settingDrawer = ref<any>(null)
const loginModal = ref<any>(null)
const videoModal = ref<any>(null)

const showContextmenu = () => {
  window.electron.showContextmenu('home')
}

const download = async () => {
  console.log('download')
  loading.value = true
  if (!videoUrl.value) {
    message.warn('Please enter video URL')
    loading.value = false
    return
  }
  const videoType = checkUrl(videoUrl.value)
  if (!videoType) {
    message.error('Please enter a valid video URL')
    loading.value = false
    return
  }
  // Check login status
  if (store.baseStore().allowLogin) {
    const status = await checkLogin(store.settingStore().SESSDATA)
    store.baseStore().setLoginStatus(status)
    if (status === 0) {
      loginModal.value.open()
      loading.value = false
      return
    }
  }
  // Check for redirects
  const { body, url } = await checkUrlRedirect(videoUrl.value)
  // Parse HTML
  try {
    const videoInfo = await parseHtml(body, videoType, url)
    loading.value = false
    videoModal.value.open(videoInfo)
  } catch (error: any) {
    loading.value = false
    if (error === -1) {
      message.error('Parse error or this video is not supported')
    } else {
      message.error(`Parse error: ${error}`)
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  box-sizing: border-box;
  padding: 16px;
  position: relative;
  height: calc(100% - 28px);
  .download-logo{
    margin: 130px 0px 50px 0px;
    img{
      transform: scale(.6);
    }
  }
  .download-box{
    padding: 0px 64px;
    :deep(.ant-input-group-addon){
      background: @primary-color;
      border: none;
    }
    .icon{
      color: #ffffff;
      font-size: 18px;
    }
  }
  .setting{
    position: absolute;
    left: 16px;
    bottom: 16px;
    z-index: 100;
    color: @primary-color;
    font-size: 16px;
  }
  .user{
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 100;
    color: @primary-color;
    font-size: 16px;
  }
}
</style>
