<template>
  <a-modal
    :visible="visible"
    title="New Version Available"
    okText="Update"
    cancelText="Cancel"
    @cancel="cancel"
    @ok="handleOk">
    <p>New version <a>v{{ newVersion }}</a> detected, current version <a>v{{ oldVersion }}</a>. Please uninstall the old version before installing the new one!</p>
    <p>Update content: {{ updateContent }}</p>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
const packageInfo = require('../../../package.json')

const visible = ref<boolean>(false)
const newVersion = ref<string>('')
const oldVersion = ref<string>(packageInfo.version)
const updateContent = ref<string>('')
const url = ref<string>('')

const cancel = () => {
  visible.value = false
}

const handleOk = () => {
  console.log('handleOk')
  window.electron.openBrowser(url.value)
  visible.value = false
}

const checkUpdate = async () => {
  try {
    const { body } = await window.electron.got('https://api.github.com/repos/blogwy/BilibiliVideoDownload/releases/latest', { responseType: 'json' })
    newVersion.value = body.tag_name.substr(1)
    url.value = body.html_url
    updateContent.value = body.body
    const newVersionArray = body.tag_name.substr(1).split('.').map((item: any) => Number(item))
    const oldVersionArray = oldVersion.value.split('.').map(item => Number(item))
    if (newVersionArray[0] > oldVersionArray[0]) {
      visible.value = true
      return
    }
    if (newVersionArray[1] > oldVersionArray[1]) {
      visible.value = true
      return
    }
    if (newVersionArray[2] > oldVersionArray[2]) {
      visible.value = true
    }
  } catch (error) {
    message.error(`Update check failed: ${error}`)
  }
}

defineExpose({
  checkUpdate
})
</script>

<style scoped lang="less"></style>
