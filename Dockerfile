FROM olbat/debian:stable
MAINTAINER devel@olbat.net

RUN apt-get update \
&& apt-get install -y ruby bundler zlib1g-dev libcurl3 \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

RUN mkdir /src
WORKDIR /src
VOLUME /src

COPY Gemfile Gemfile.lock /src/
RUN bundle install --system

CMD bundle exec jekyll build
