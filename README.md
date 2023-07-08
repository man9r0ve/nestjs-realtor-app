## Realtor-app

### 1. PostgreSQL 설치 하기
  * 로컬에 설치
    * docker 로 설치

      docker-compose.yml
      ```yml
      version: '3.1'

      services:
        postgres:
          image: postgres
          container_name: postgres
          ports:
            - 15432:5432
          environment:
            POSTGRES_USER: mangrove
            POSTGRES_PASSWORD: password
          restart: always
      ```

      ```bash
      docker-compose up -d
      ```

  * 클라우드에 설치 (aws, asure, heroku ...)

### 2. Libraries
  * ORM: [Prisma](https://prisma.io)

### 3. VSCode Extention
  * [Prisma](vscode:Prisma.prisma)
  * [DotEMV](vscode:mikestead.dotenv)

### 4. Prisma
  * 스키마 서버에 적용 (superuser 권한이 필요한지는 확인해 봐야 함)
    ```bash
    npx prisma db push
    ```

  * Prisma studio start
    ```bash
    npx prisma studio
    ```

### 5. 로직
#### 로그인
    - 이메일로 사용자 찾기
    - 해시된 패스워드로 비교하기
    - jwt 리턴하기

#### 중개사
    - GET    /home     : 매물 리스트
    - GET    /home/:id : 매물 상세
    - POST   /home     : 매물 등록
    - PUT    /home/:id : 매물 수정
    - DELETE /home/:id : 매물 삭제
    - POST   /home/:id : 매물 문의