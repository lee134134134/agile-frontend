FROM 10.9.40.23:30080/container/nginx:latest
VOLUME /tmp
#设置时区
ENV TZ=Asia/Shanghai
COPY dist/ /app/dist
COPY default.conf /etc/nginx/conf.d/default.conf
