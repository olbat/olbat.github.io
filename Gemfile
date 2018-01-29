source "https://rubygems.org"

gem "minimal-mistakes-jekyll", "~> 4.8.1"
gem "jekyll-github-metadata", "~> 2.9.0"

group :production do
  gem "htmlcompressor", "~> 0.3.0"
  gem "yui-compressor", "~> 0.12.0"
  gem "nokogiri", "~> 1.8.0"
  gem "json-ld", "~> 2.1.0"
end

group :test do
  gem "html-proofer", "~> 3.7.0"
  gem "json-schema", "~> 2.8.0"
end

group :production, :test do
  gem "rake", ">= 0.7"
end
