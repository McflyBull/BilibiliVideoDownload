<template>
  <a-modal
    wrapClassName="custom-modal-padding"
    :visible="visible"
    :closable="false"
    :maskClosable="false"
    title="Please login to Bilibili"
    :okText="handleOkText()"
    :okButtonProps="{ disabled: (activeTab === 1 && scanStatus !== 2 ) || (activeTab === 2 && !IPTSESSDATA) }"
    cancelText="Don't login"
    @cancel="notLogin"
    @ok="login">
    <a-tabs v-model:activeKey="activeTab" centered>
      <a-tab-pane :key="1" tab="QR Code Login" force-render>
        <div class="login-box">
          <div class="qr-modal" v-if="!countDown">
            <SyncOutlined class="refresh" @click="createQrcode" />
          </div>
          <img :src="imageBase64" alt="" />
        </div>
      </a-tab-pane>
      <a-tab-pane :key="2" tab="Manual Input">
        <div class="login-box">
          <a-input v-model:value="IPTSESSDATA" placeholder="Enter your SESSDATA">
            <template #suffix>
              <a-tooltip>
                <template #title>
                  <a @click="openBrowser('https://github.com/blogwy/BilibiliVideoDownload/wiki/%E8%8E%B7%E5%8F%96SESSDATA')">Click here</a> to learn how to get SESSDATA
                </template>
                <InfoCircleOutlined style="color: rgba(0, 0, 0, 0.45)" />
              </a-tooltip>
            </template>
          </a-input>
        </div>
      </a-tab-pane>
    </a-tabs>
    <div class="mt16 desc">Note: After login, the software will only use your SESSDATA for downloads. Regular accounts can download 1080P videos, VIP members can download 8K videos, without login max download is 480P</div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { InfoCircleOutlined, SyncOutlined } from '@ant-design/icons-vue'
import qrCode from 'qrcode'
import { checkLogin } from '../../core/bilibili'
import { store } from '../../store'

const visible = ref<boolean>(false)
// 0 Not scanned 1 Scanned 2 Confirmed
const scanStatus = ref<number>(0)
const activeTab = ref<number>(1)
const QRSESSDATA = ref<string>('')
const IPTSESSDATA = ref<string>('')
const imageBase64 = ref<string>('')
const oauthKey = ref<string>('')
const countDown = ref<number>(180)
const isCheck = ref<boolean>(true)
let timer: any = null

const handleOkText = () => {
  const okText = ['Not scanned', 'Scanned', 'Confirm login']
  if (activeTab.value === 1) {
    return okText[scanStatus.value]
  } else {
    return 'Confirm login'
  }
}

const open = async () => {
  console.log('open')
  await createQrcode()
  visible.value = true
  isCheck.value = true
  checkScanStatus(oauthKey.value)
}

const notLogin = () => {
  console.log('notLogin')
  store.baseStore().setAllowLogin(false)
  hide()
}

const login = async () => {
  console.log('login')
  // Get SESSDATA
  const SESSDATA = activeTab.value === 1 ? QRSESSDATA.value : IPTSESSDATA.value
  if (activeTab.value === 1 && !SESSDATA) {
    message.error('Please enter SESSDATA')
    return
  }
  // Store SESSDATA
  store.settingStore().setSESSDATA(SESSDATA)
  // Validate SESSDATA
  const status = await checkLogin(store.settingStore().SESSDATA)
  // Store LoginStatus
  store.baseStore().setLoginStatus(status)
  hide()
}

const hide = () => {
  isCheck.value = false
  setTimeout(() => {
    clearInterval(timer)
    timer = null
  }, 1000)
  visible.value = false
}

const openBrowser = (url: string):void => {
  window.electron.openBrowser(url)
}

const createQrcode = async () => {
  const { body } = await window.electron.got('http://passport.bilibili.com/qrcode/getLoginUrl', { responseType: 'json' })
  const qrcode = await qrCode.toDataURL(body.data.url, {
    margin: 0,
    errorCorrectionLevel: 'H',
    width: 400
  })
  imageBase64.value = qrcode
  oauthKey.value = body.data.oauthKey
  // 开始倒计时
  countDown.value = 180
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  timer = setInterval(() => {
    if (!countDown.value) {
      clearInterval(timer)
      return
    }
    countDown.value -= 1
  }, 1000)
}

const checkScanStatus = (oauthKey: string) => {
  run(oauthKey)
  async function run (oauthKey: string) {
    if (!isCheck.value) return
    const { body } = await window.electron.got('http://passport.bilibili.com/qrcode/getLoginInfo', {
      method: 'POST',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: { oauthKey }
    })
    console.log(body)
    if (!body.status) {
      if (body.data === -4) {
        scanStatus.value = 0
      }
      if (body.data === -5) {
        scanStatus.value = 1
      }
      setTimeout(() => {
        run(oauthKey)
      }, 3000)
      return
    }
    // 获取SESSDATA
    QRSESSDATA.value = body.data.url.match(/SESSDATA=(\S*)&bili_jct/)[1]
    scanStatus.value = 2
    isCheck.value = false
  }
}

defineExpose({
  open
})
</script>

<style scoped lang="less">
.login-box{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  .qr-modal{
    position: absolute;
    width: 200px;
    height: 200px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(190, 190, 190, 0.8);
    z-index: 10;
    .refresh{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
      font-size: 24px;
      color: @primary-color;
    }
  }
  img{
    width: 200px;
    height: 200px;
  }
}
</style>
