source "https://rubygems.org"

gem "minimal-mistakes-jekyll", "~> 4.5.0"

group :production do
  gem "htmlcompressor", "~> 0.3.0"
end

group :test do
  gem "html-proofer", "~> 3.7.0"
end

group :production, :test do
  gem "rake", ">= 0.7"
end
