FROM node:22.22.1

ENV APP_PATH /app
RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

COPY package.json ./
RUN corepack enable && corepack install

CMD ["/bin/bash"]
