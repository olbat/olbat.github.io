# Personal website [![Gitlab CI build status](https://gitlab.com/olbat/olbat.gitlab.io/badges/source/pipeline.svg)](https://gitlab.com/olbat/olbat.gitlab.io/commits/source)


## About
This website is generated using [Jekyll](https://jekyllrb.com/) with the [Minimal mistakes theme](https://mmistakes.github.io/minimal-mistakes/).

Generation, post-build/optimization and test tasks are defined in the [Rakefile](Rakefile) file.  
Data used to generate the pages are available as YAML files in the [_data/](_data) directory.  
Pages' content is generated from templates ([Markdown](https://en.wikipedia.org/wiki/Markdown)) located in the [_pages/](_pages) directory.  
Structured data are generated from templates ([JSON-LD](https://en.wikipedia.org/wiki/JSON-LD)) located in the [_includes/structured_data/](_includes/structured_data) directory.  
Static files such as documents and public keys are saved in the [files/](files) directory.

__Note__: the [website](https://olbat.net/) is built and deployed by [Gitlab CI](.gitlab-ci.yml)


## Requirements
- [Ruby](https://ruby-lang.org/) and [Bundler](https://bundler.io/)
- [Jekyll](https://jekyllrb.com/) and [few other gems](Gemfile)
- [uncss](https://github.com/giakki/uncss) and [uglify](https://github.com/mishoo/UglifyJS2)


## Usage
Install dependencies:
```bash
bundle install
```

Build the website using Jekyll then compress/minify the output files:
```bash
bundle exec rake build
```

Build the website without optimizations:
```bash
bundle exec rake build:jekyll
# or: bundle exec jekyll build
```

Serve the website locally:
```bash
bundle exec jekyll serve
# the website is then accessible at http://localhost:4000/
```
