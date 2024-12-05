# firebase emulator 설정

```
$ npm install -g firebase-tools
$ firebase login
$ firebase init
```

firebase init 이후에는 초기화 할 종류를 결정하게 된다
- Emulators
- Use an existing project
    - 만들어둔 firebase 프로젝트 선택
- Authentication Emulator

순으로 선택해주면 된다.
나머지는 기본값

```
$ firebase emulators:start
```

이후에 Authentication 에뮬레이터 실행되고 , 9099 포트 번호로 실행됐다고 나오면 됨
UI 주소는 localhost:4000/auth이다

## .env 키값

firebase console에 맞춰서 쓰면 된다.

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```