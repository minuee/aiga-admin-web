module.exports = {
    apps: [
      {
        name: "aiga-admin",
        script: "node_modules/next/dist/bin/next",
        args: "start --port 6001",
        instances: 2,
        exec_mode: "cluster",
        wait_ready: true, // Node앱으로 부터 앱이 실행되었다는 신호를 받기위해 기다리겠다는 것 "ready"
        listen_timeout: 50000, // 앱 실행신호까지 기다릴 최대시간 ms단위 50초
        kill_timeout: 5000, //새로운 프로세스 실행이 완료된 후 예전 프로세스를 교체하기까지 기다릴 시간  5초
        max_memory_restart: "2G", // 프로그램의 메모리 크기가 일정 크기 이상이 되면 재시작시킴
        // 개발환경 설정
        env: {
          NODE_ENV: "development",
        },
        // 운영환경 설정 실행시 --env production 옵션으로 지정할 수 있다.
        env_production: {
          NODE_ENV: "production",
          PORT: "8080",
        },
      },
    ],
  };