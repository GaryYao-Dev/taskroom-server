# 使用 Node.js v18.13.0 作为基础镜像
FROM node:18.13.0

# 设置工作目录
WORKDIR /usr/src/app

# 将 package.json 和 package-lock.json 复制到容器中
COPY package*.json ./

# 安装依赖项
RUN npm install

# 将整个应用程序复制到容器中
COPY . .

# 暴露端口
EXPOSE 8000

# 运行应用程序
CMD ["node", "index.js"]# 