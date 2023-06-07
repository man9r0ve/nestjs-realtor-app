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

### Libraries
  * ORM: [Prisma](https://prisma.io)

### VSCode Extention
  * [Prisma](vscode:Prisma.prisma)
  * [DotEMV](vscode:mikestead.dotenv)

### Prisma
  * 스키마 서버에 적용
    ```bash
    npx prisma db push
    ```