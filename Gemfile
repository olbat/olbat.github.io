source "https://rubygems.org"

gem "minimal-mistakes-jekyll", "~> 4.24.0"
gem "jekyll-github-metadata", #"~> 2.16.0"
  # this is a temporary hack as a repository that has been taken down makes
  # jekyll-github-metadata fail to gather metadata
  # TODO: use the stable library once the repository has been deleted
  github: 'olbat/github-metadata', branch: 'ignore-repository-access-blocked-errors'

group :production do
  gem "htmlcompressor", "~> 0.4.0"
  gem "yui-compressor", "~> 0.12.0"
  gem "nokogiri", ">= 1.16.0"
  gem "json-ld", "~> 3.1.0"
end

group :test do
  gem "html-proofer", "~> 5.0.0"
  gem "json-schema", "~> 4.2.0"
end

group :production, :test do
  gem "rake", ">= 0.7"
end
