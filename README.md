# track

[배포페이지](http://trackthebeat.com)

## Dependency

- linux ffmpeg 설치
- .env파일은 ncloud object storage env에 보관됨

## 배포환경

- pm2
- nginx
  - nginx 80 port => localhost 3000 port

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
