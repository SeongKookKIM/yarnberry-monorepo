# zzz

1. yarn set version berry
2. `.yarnrc.yml`

```js
nodeLinker: pnp;
pnpMode: loose;
추가;
```

3. yarn init
4. workspace(monorepo) 셋팅 - `package.json`파일을 열고 name 및에 `workspace`를 아래와 같이 추가합니다.

```js
{
  "name": "monorepo",
  "workspaces": {
    "packages": [
      "package/*"
    ]
  },
  "packageManager": "yarn@4.1.1",
  "devDependencies": {
    "eslint": "^8.57.0",
    "prettier": "^3.2.5",
    "typescript": "^5.4.3"
  }
}

```

5. project 생성 (package 폴더 생성 후 `backend` `frontend` 나누기)

```js
- `yarn create vite` -> frontend
- `.exlintrc.cjs`
    "no-unused-vars": "off",
    "react/prop-types": "off",
    추가
```

6. typescript 에러

```js
- root 최상단 폴더 이동 후
- `yarn add -D typescript prettier eslint` 설치
- `yarn dlx @yarnpkg/sdks vscode` 설치
- `frontend` yarn dev 확인
```

7. `backend` 이동 후 `server.ts` 생성 후 `yarn init`
8. `frontend` `package.json`에

```js
  "dependencies": {
    "axios": "^1.6.8",
    "backend": "*", -> 생성
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
```

```js
`backend` server.ts
const str: string = "이 변수를 공유해보자!";
export default str;

`frontend`에서
import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import str from '@monorepo/common'

function App() {
  const [count, setCount] = useState(0)
  console.log(str)
...}
-> 이런식으로 공유 가능 (모노레포)
```

9. `backend` 이동 후

```js
- yarn add express cors dotenv
- yarn add -D @types/cors @types/express @types/node nodemon ts-node
- `tsc --init` ->tsconfig.json 파일 생성, TS를 JS로 컴파일하는 옵션 설정
```

10. tsconfig.json 변경

```js
{
  "compilerOptions": {
    "target": "es6", // 어떤 버전으로 컴파일

    "allowSyntheticDefaultImports": true, // default export가 없는 모듈에서 default imports를 허용
    "experimentalDecorators": true, // decorator 실험적 허용
    "emitDecoratorMetadata": true, // 데코레이터가 있는 선언에 대해 특정 타입의 메타 데이터를 내보내는 실험적인 지원
    "skipLibCheck": true, // 정의 파일 타입 체크 여부
    "moduleResolution": "node", // commonJS -> node 에서 동작
    "module": "commonjs", // import 문법
    "strict": true, // 타입 검사 엄격하게
    "pretty": true, // error 메시지 예쁘게
    "sourceMap": true, // 소스맵 파일 생성 -> .ts가 .js 파일로 트랜스 시 .js.map 생성
    "outDir": "./dist", // 트랜스 파일 (.js) 저장 경로
    "allowJs": true, // js 파일 ts에서 import 허용
    "esModuleInterop": true, // ES6 모듈 사양을 준수하여 CommonJS 모듈을 가져올 수 있게 허용
    "typeRoots": [
      "./src/types/express.d.ts", // 타입(*.d.ts)파일을 가져올 디렉토리 설정
      "./node_modules/@types" // 설정 안할시 기본적으로 ./node_modules/@types
    ]
  },
  "include": [
    "./src/**/*" // build 시 포함
  ],
  "exclude": [
    "node_modules", // build 시 제외
    "tests"
  ]
}
```

11. `nodemon.json` 생성

```js
{
  "watch": ["src", ".env"],
  "ext": "js,ts,json",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "yarn nodemon --exec \"yarn ts-node\" ./server.ts"
}
- watch : 변경 감지 경로
- ext : 변경 감지 확장자
- ignore : 변경 감지 제외
- exec : nodemon 수행 명령
```

12. `backend` `package.json` 수정

```js
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "server.ts",
  "author": "",
  "license": "ISC",
  "scripts": {
    "server": "nodemon",
    "build": "tsc && node dist"
  },
  "packageManager": "yarn@4.1.1",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.30",
    "nodemon": "^3.1.0",
    "ts-node": "^10.9.2"
  }
}
```

13. `servert.ts` react연동 셋팅

```js
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";

import test from "./router/test";

const app = express();

app.use(express.urlencoded({ extended: true }));

// React Server.js 연결
app.use(express.json());
app.use(cors());

app.listen("8080", () => {
  console.log(`
        #############################################
        🛡️ Server listening on port: 8000 🛡️
        #############################################  
    `);
});

// server-react connect
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", function (req, res) {
  console.log(req);
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.use("/", (req, res) => {
  console.log(req.body);
  return res.status(200).send("하이");
});

app.use("/test", test);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
```

14. router 분리

```js
- ./roter/test.ts

import express, { Request, Response, NextFunction } from "express";

let test = express.Router();

test.post("/", (req, res) => {
  console.log(req.body);
  return res.status(200).send("test 안녕");
});
export default test;

```

15. yarn server로 테스트
