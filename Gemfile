source "https://rubygems.org"

gem "minimal-mistakes-jekyll", "~> 4.24.0"
gem "jekyll-github-metadata", "~> 2.16.0"

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
