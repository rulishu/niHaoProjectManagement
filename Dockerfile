FROM nginx:1-alpine

ENV APPDIR /usr/share/nginx/web
RUN mkdir -p $APPDIR

WORKDIR $APPDIR

ADD ./build $APPDIR

COPY nginx.conf /etc/nginx/conf.d
RUN cat /etc/nginx/conf.d/nginx.conf

EXPOSE 33200
