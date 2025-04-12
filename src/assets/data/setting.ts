const formConfig = [
  {
    label: 'Login Status',
    type: 'status',
    name: '',
    tips: 'After login, regular accounts can download up to 1080P videos, VIP members can download 4K videos, without login max download is 480P'
  },
  {
    label: 'Download Location',
    placeholder: 'Please set download location',
    type: 'downloadPath',
    name: 'downloadPath',
    tips: 'Cannot download without setting download location'
  },
  {
    label: 'Max Downloads',
    type: 'slider',
    name: 'downloadingMaxSize',
    tips: 'Cannot download without setting maximum concurrent downloads'
  },
  {
    label: 'Transcode and merge after download',
    type: 'switch',
    name: 'isMerge',
    tips: 'Downloaded source files are separate audio and video m4s files, they need to be merged'
  },
  {
    label: 'Delete original files after download',
    type: 'switch',
    name: 'isDelete',
    tips: 'Delete m4s files after merging'
  },
  {
    label: 'Download to separate folder',
    type: 'switch',
    name: 'isFolder',
    tips: 'When enabled, each task will download to a separate folder'
  },
  {
    label: 'Download subtitles',
    type: 'switch',
    name: 'isSubtitle',
    tips: 'When enabled, subtitles will be downloaded if available'
  },
  {
    label: 'Download danmaku',
    type: 'switch',
    name: 'isDanmaku',
    tips: 'When enabled, video danmaku will be downloaded'
  },
  {
    label: 'Download cover',
    type: 'switch',
    name: 'isCover',
    tips: 'When enabled, video cover will be downloaded'
  }
]

const settingData = {
  downloadPath: '',
  isMerge: true,
  isDelete: true,
  isSubtitle: true,
  isDanmaku: true,
  isFolder: true,
  isCover: true,
  downloadingMaxSize: 5
}

const settingRules = {
  downloadPath: [
    {
      required: true,
      message: 'Please set download location'
    }
  ],
  downloadingMaxSize: [
    {
      required: true,
      message: 'Please select maximum concurrent downloads'
    }
  ],
  isMerge: [
    {
      required: false
    }
  ],
  isDelete: [
    {
      required: false
    }
  ],
  isFolder: [
    {
      required: false
    }
  ],
  isSubtitle: [
    {
      required: false
    }
  ],
  isDanmaku: [
    {
      required: false
    }
  ],
  isCover: [
    {
      required: false
    }
  ]
}

const formItemLayout = { span: 24, offset: 0 }

const loginStatusText = ['Not logged in', 'Regular user', 'VIP member']

export {
  settingData,
  formConfig,
  formItemLayout,
  settingRules,
  loginStatusText
}
