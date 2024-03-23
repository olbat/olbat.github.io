FROM debian:stable-slim
MAINTAINER devel@olbat.net

ARG NODE_VERSION=16

# dependencies for Jekyll (Ruby), uncss (NodeJS) and YUICompressor (Java)
RUN apt-get update \
&& apt-get install -y \
  ruby bundler gnupg zlib1g-dev libcurl4 \
  curl jq gnupg \
  default-jre-headless \
  imagemagick libcairo2-dev libjpeg-dev \
&& curl -s https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
  > /etc/apt/trusted.gpg.d/nodesource-repo.asc \
&& echo "deb http://deb.nodesource.com/node_${NODE_VERSION}.x nodistro main" \
  > /etc/apt/sources.list.d/nodejs.list \
&& apt-get update \
&& apt-get install -y git nodejs npm \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

RUN sed \
  -e '/<\/policymap>/i<policy domain="coder" rights="read | write" pattern="PDF" />' \
  -i /etc/ImageMagick-6/policy.xml

RUN mkdir /src
WORKDIR /src
VOLUME /src

ENV NODE_PATH=/usr/local/lib/node_modules
RUN npm install -g --unsafe-perm=true uncss uglify-js fa-minify trianglify@~3

RUN bundle config set --local system 'true'
COPY Gemfile Gemfile.lock /src/
RUN bundle install

COPY deps/minimal-mistakes/package.json /src/
RUN npm install

# safeguard to make sure the git submodule is in sync
RUN [ "$(bundle show minimal-mistakes-jekyll | awk -F- '{print $NF}')" \
  = "$(jq -r '.version' package.json)" ]

CMD bundle exec jekyll build
