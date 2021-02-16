# API 문서

프로토타입 버전으로 추후 지속적으로 업데이트 예정

## 개정이력

- 2020.08.19 김찬중
  - 최초 작성

## 기본 라우트

```js
'/api/v1'
```

- /api prefix 는 nuxt.config.js에서 설정됨

---

## Artist

- Summary

  | Method | Path    | Description                   | Remarks                |
  | ------ | ------- | ----------------------------- | ---------------------- |
  | GET    | /artist | 모든 아티스트 목록을 가져온다 | 추후 페이지네이션 필요 |

- GET /artist

  - Request parameters

    | Parameter | Type | Location | Description |
    | --------- | ---- | -------- | ----------- |
    |           |      |          |             |

  - Response

    | Field     | Type   | Description         |
    | --------- | ------ | ------------------- |
    | id        | string | 아티스트 ID(uuidv4) |
    | group     | string | 아티스트 그룹       |
    | name      | string | 아티스트 이름       |
    | position  | string | 아티스트 세부 역할  |
    | createdAt | string | 생성일              |
    | updatedAt | string | 변경일              |
    | deletedAt | string | 삭제일              |

---

## Genre

- Summary

  | Method | Path   | Description               | Remarks                |
  | ------ | ------ | ------------------------- | ---------------------- |
  | GET    | /genre | 모든 장르 목록을 가져온다 | 추후 페이지네이션 필요 |

- GET /genre

  - Request parameters

    | Parameter | Type | Location | Description |
    | --------- | ---- | -------- | ----------- |
    |           |      |          |             |

  - Response

    | Field | Type   | Description |
    | ----- | ------ | ----------- |
    | id    | number | 장르 ID     |
    | name  | string | 장르 이름   |

---

## Music - Info

- Summary

  | Method | Path   | Description               | Remarks                |
  | ------ | ------ | ------------------------- | ---------------------- |
  | GET    | /music | 모든 음악 정보를 가져온다 | 추후 페이지네이션 필요 |
  | POST   | /music | 음악 정보를 저장한다      |                        |

- GET /music

  - Request parameters

    | Parameter | Type | Location | Description |
    | --------- | ---- | -------- | ----------- |
    |           |      |          |             |

  - Response

    | Field       | Type   | Description                     |
    | ----------- | ------ | ------------------------------- |
    | id          | string | 곡 정보 ID(uuidv4)              |
    | name        | string | 곡 이름                         |
    | tag         | string | 태그                            |
    | album       | string | 곡 앨범                         |
    | description | string | 곡 설명                         |
    | lyrics      | string | 가사                            |
    | singer      | string | 가수                            |
    | releaseDate | string | 릴리즈 날짜                     |
    | artist      | object | 아티스트                        |
    | files       | array  | 커버 이미지파일, 음악 파일 정보 |
    | musicRights | array  | 저작권                          |
    | musicHit    | object | 조회수                          |
    | createdAt   | string | 생성일                          |
    | updatedAt   | string | 변경일                          |
    | deletedAt   | string | 삭제일                          |

- POST /music

  파일들의 음악ID(FK)가 업데이트되고 음악 정보, 저작권, 조회수가 생성된다

  - Request parameters

    | Parameter   | Type   | Location | Description         |
    | ----------- | ------ | -------- | ------------------- |
    | name        | string | body     | 곡 이름             |
    | tag         | string | body     | 곡 태그             |
    | description | string | body     | 곡 설명             |
    | album       | string | body     | 곡 앨범             |
    | lyrics      | string | body     | 가사                |
    | singer      | string | body     | 가수                |
    | releaseDate | string | body     | 릴리즈 날짜         |
    | genreId     | string | body     | 장르 ID             |
    | artistId    | string | body     | 아티스트 ID         |
    | lyricist    | string | body     | 작사가              |
    | songwriter  | string | body     | 작곡가              |
    | arranger    | string | body     | 편곡가              |
    | singer      | string | body     | 가수                |
    | wavId       | string | body     | Wav file ID         |
    | mp3Id       | string | body     | Mp3 file ID         |
    | coverId     | string | body     | Cover image file ID |

  - Response

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    |       |      |             |

---

### Music - File

- Summary

  | Method | Path                     | Description                                                                             | Remarks |
  | ------ | ------------------------ | --------------------------------------------------------------------------------------- | ------- |
  | GET    | /music/file/:musicInfoId | musicInfoId와 role에 따라 해당하는 파일을 스트림으로 response한다(role 기본값: mp3)     |         |
  | POST   | /music/file/             | wav파일을 업로드받고 mp3로 변환하여 두 파일 모두 Object storage에 업로드, DB row도 생성 |         |
  | POST   | /music/file/cover        | cover image파일을 업로드, DB row도 생성                                                 |         |

- GET /music/file/:musicInfoId

  - Request parameters

    | Parameter   | Type   | Location | Description                 |
    | ----------- | ------ | -------- | --------------------------- |
    | musicInfoId | string | param    | 음악 정보 ID                |
    | role        | string | query    | 파일 종류 (wav, mp3, cover) |

  - Response
    File stream

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    |       |      |             |

- POST /music/file/

  - Request parameters

    | Parameter | Type     | Location | Description |
    | --------- | -------- | -------- | ----------- |
    | file      | formdata | body     | 곡 Wav 파일 |

  - Response

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    |       |      |             |

- POST /music/file/cover

  - Request parameters

    | Parameter | Type     | Location | Description         |
    | --------- | -------- | -------- | ------------------- |
    | cover     | formdata | body     | 곡 커버 이미지 파일 |

  - Response

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    |       |      |             |

---

### Music - Playlist

- Summary

  | Method | Path            | Description                                                        | Remarks                              |
  | ------ | --------------- | ------------------------------------------------------------------ | ------------------------------------ |
  | GET    | /music/playlist | Redis에 저장된 musicInfoId를 기반으로 모든 플레이리스트를 가져온다 | 추후 플레이리스트 목록별로 분리 필요 |
  | POST   | /music/playlist | musicInfoId List를 Redis에 저장한다                                | 추후 플레이리스트 목록별로 분리 필요 |

- GET /

  - Request parameters

    | Parameter | Type | Location | Description |
    | --------- | ---- | -------- | ----------- |
    |           |      |          |             |

  - Response (MusicInfo와 동일한 데이터 구조)

    | Field       | Type   | Description                     |
    | ----------- | ------ | ------------------------------- |
    | id          | string | 곡 정보 ID(uuidv4)              |
    | name        | string | 곡 이름                         |
    | tag         | string | 태그                            |
    | album       | string | 곡 앨범                         |
    | description | string | 곡 설명                         |
    | lyrics      | string | 가사                            |
    | singer      | string | 가수                            |
    | releaseDate | string | 릴리즈 날짜                     |
    | artist      | object | 아티스트                        |
    | files       | array  | 커버 이미지파일, 음악 파일 정보 |
    | musicRights | array  | 저작권                          |
    | musicHit    | object | 조회수                          |
    | createdAt   | string | 생성일                          |
    | updatedAt   | string | 변경일                          |
    | deletedAt   | string | 삭제일                          |

- POST /

  - Request parameters

    | Parameter | Type  | Location | Description   |
    | --------- | ----- | -------- | ------------- |
    | playlist  | array | body     | musicInfoId[] |

  - Response

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    |       |      |             |

---

### Music - Play

- Summary

  | Method | Path                    | Description                                                           | Remarks |
  | ------ | ----------------------- | --------------------------------------------------------------------- | ------- |
  | GET    | /music/end/:musicInfoId | 재생이 끝났을때 호출되는 라우트로 로그를 체크하여 조회수를 증가시킨다 |         |

- GET /music/end/:musicInfoId

  - Request parameters

    | Parameter   | Type   | Location | Description  |
    | ----------- | ------ | -------- | ------------ |
    | musicInfoId | string | param    | 음악 정보 ID |

  - Response

    | Field | Type | Description |
    | ----- | ---- | ----------- |
    |       |      |             |
