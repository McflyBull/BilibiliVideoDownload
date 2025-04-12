<div align="center">
  <img src="./build/icons/256x256.png" alt="" width="128">
  <h1>BilibiliVideoDownload</h1>
  <blockquote>Cross-platform desktop software for downloading Bilibili videos, supporting Windows, macOS, and Linux</blockquote>
</div>

<div align="center">
  <a href="https://github.com/blogwy/BilibiliVideoDownload/issues"><img src="https://img.shields.io/github/issues/blogwy/BilibiliVideoDownload" alt="issues"></a>
  <a><img src="https://img.shields.io/github/forks/blogwy/BilibiliVideoDownload" alt="forks"></a>
  <a><img src="https://img.shields.io/github/stars/blogwy/BilibiliVideoDownload" alt="stars"></a>
  <a><img src="https://img.shields.io/github/license/blogwy/BilibiliVideoDownload" alt="license"></a>
</div>

## Note

* The software does not support paid videos and region-restricted videos, which may cause errors

* Login information has an expiration time, which seems to be about six months

* Due to the fact that the downloaded audio and video are separate, the project uses ffmpeg for merging, which makes the installation package a bit large (ffmpeg is about 70+ MB)

## Installation

Go to the [releases](https://github.com/blogwy/BilibiliVideoDownload/releases) page and download the installation package for your platform. When downloading videos, you will be prompted to log in. After logging in, the software will only get your SESSDATA for downloads. A regular account supports downloading up to 1080P videos, VIP members can download 8K videos, and without login, the maximum supported download is 480P videos.

## Preview

![1](./screenshots/1.png)
![2](./screenshots/2.png)
![3](./screenshots/3.png)
![4](./screenshots/4.png)
![5](./screenshots/5.png)


## Features

* [x] Download regular videos
* [x] Download anime videos
* [x] Download multi-part videos
* [x] Download movies (except those requiring extra payment)
* [x] Download video covers
* [x] Download subtitles
* [x] Download danmaku
* [x] Download progress
* [x] Basic video information
* [x] Delete download history
* [ ] Pause/resume downloads

## Development

**Make sure you have a VPN since dependencies like electron and electron-builder need to be downloaded from GitHub**

```bash
git clone https://github.com/blogwy/BilibiliVideoDownload.git

cd BilibiliVideoDownload

yarn

yarn electron:serve

yarn electron:build
```
## Versions

v3.3.3 `2022-07-02`

1. Fixed abnormal close event error [issues/88](https://github.com/blogwy/BilibiliVideoDownload/issues/88)
2. Added play video function with right-click in download list [issues/86](https://github.com/blogwy/BilibiliVideoDownload/issues/86)

v3.3.2 `2022-06-04`

1. Fixed audio bitrate error when downloading videos, now using the highest available audio bitrate [issues/76](https://github.com/blogwy/BilibiliVideoDownload/issues/76)
2. Fixed update popup button not responding [issues/83](https://github.com/blogwy/BilibiliVideoDownload/issues/83)
3. Added settings option for whether to download cover [issues/81](https://github.com/blogwy/BilibiliVideoDownload/issues/81)
4. Added copy/paste/select all right-click menu to download URL input box [issues/82](https://github.com/blogwy/BilibiliVideoDownload/issues/82)

v3.3.1 `2022-05-28`

1. Fixed danmaku style abnormality issue

v3.3.0 `2022-05-12`

1. Upgraded to Vue3+TypeScript and Electron 16
2. Optimized code, using contextBridge instead of Node integration
3. Added manual SESSDATA input function
4. Added re-download with right-click
5. Changed download folder/name format to [px]VideoName-FirstUploaderName-bvNumber-uuid
6. Added scroll bar to download page
7. Download danmaku

v3.2.0 `2022-02-26`

1. Support for macOS arm
2. Support for AV number parsing

v3.1.8 `2021-12-18`

1. Support for EP, SS videos (anime, documentaries, movies), with multi-part (batch) download

v3.1.7 `2021-12-11`

1. Added right-click menu to task list
2. Multiple selection in task list by holding shift key
3. Support for 8K videos
4. Support for Dolby Vision

v3.1.6 `2021-11-06`

1. Fixed download issues
2. HDR video support

v3.1.5 `2021-10-08`

1. Fixed cannot delete bug [issues/41](https://github.com/blogwy/BilibiliVideoDownload/issues/41)
2. Added enter key confirmation on main page

v3.1.4 `2021-09-24`

1. Fixed issue where settings page could not be closed after version upgrade [issues/39](https://github.com/blogwy/BilibiliVideoDownload/issues/39)
2. Added option to download to separate folder in settings page

v3.1.3 `2021-09-11`

1. Fixed login bug in settings sidebar

v3.1.2 `2021-09-02`

1. Fixed layout issues when there are multiple uploaders [issues/36](https://github.com/blogwy/BilibiliVideoDownload/issues/36)

v3.1.1 `2021-08-11`

1. Added select all function for multi-part videos
2. Added maximum concurrent download task setting (1~5)

v3.1.0 `2021-06-29`

1. Added QR code login to get cookie, no need to set manually
2. Added subtitle download function

v3.0.6 `2021-05-22`

Added batch download for multi-part videos. It's recommended not to download more than 5 videos at the same time, as too many may cause the program to freeze.

v3.0.5 `2021-05-15`

Added update checking

v3.0.4 `2021-04-29`

Fixed download bug

v3.0.1 `2021-03-03`

Added error messages

v3.0.0 `2021-02-21`

Brand new GUI version launched

v2.1.0 `2019-09-12`

Added danmaku download and user lookup via danmaku

v2.0.2 `2019-06-19`

Added support for VIP quality (requires SESSDATA from a VIP account)

v2.0.1 `2019-03-29`

Added multi-part detection and download function

v2.0.0 `2019-03-24`

Rebuilt with Node.js, previous version in vuejs branch

## Acknowledgements

* Special thanks to JetBrains for providing free licenses for open source projects. Apply at: [https://www.jetbrains.com/community/opensource/#support](https://www.jetbrains.com/community/opensource/#support)
* Thanks to [bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect) for Bilibili API support
* Thanks to [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved) for danmaku support
* [FFmpeg](https://ffmpeg.org/)
* [Electron](https://www.electronjs.org/)
* [Vue.js](https://vuejs.org/)
* [Ant Design Vue](https://antdv.com/docs/vue/introduce-cn/)
* [got](https://github.com/sindresorhus/got)

