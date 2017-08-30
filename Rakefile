require 'yaml'
require 'jekyll'
require 'html-proofer'
require 'htmlcompressor'

JEKYLL_CONFIG="_config.yml"
SITE_PATH="_site"


def jekyll_config
  @jekyll_config ||= YAML.load_file(JEKYLL_CONFIG)
end

def site_path
  @site_path ||= (jekyll_config["destination"] || SITE_PATH)
end

namespace :build do
  # equivalent to: jekyll build --strict_front_matter --verbose
  desc "Build using jekyll"
  task :jekyll do
    config = Jekyll.configuration({
      'source' => '.',
      'destination' => site_path(),
      'verbose' => true,
      'strict_font_matter' => true,
    })
    Jekyll::Commands::Build.build(Jekyll::Site.new(config), config)
  end

  # FIXME: to be removed once fixed in the minimal-mistakes theme
  desc "Removes themes leftovers in the #{site_path} directory"
  task :cleanup do
    jconfig = jekyll_config()
    Dir[*jconfig["exclude"].map{|d| File.join(site_path(), d) }].each do |d|
      sh "rm -r #{d}"
    end if jconfig["exclude"]
  end

  namespace :compress do
    desc "Compress webpages"
    task :pages do
      compressor = HtmlCompressor::Compressor.new
      Dir[File.join(site_path, '**', '*.html')].each do |f|
        puts "compressing #{f}"
        File.write(f, compressor.compress(File.read(f)))
      end
    end
  end
  task :compress => ["compress:pages"]
end
task :build => ["build:jekyll", "build:cleanup", "build:compress"]


namespace :test do
  desc "Run HTMLProofer on the #{site_path} directory"
  task :htmlproofer do
    config = {
      disable_external: %w{0 false off}.include?(ENV['EXT']),
      typhoeus: { ssl_verifypeer: false },
      # FIXME: necessary for linkedin.com URLs
      # (see https://github.com/gjtorikian/html-proofer/issues/215)
      http_status_ignore: [999],
    }
    HTMLProofer.check_directory(site_path, config).run
  end
end
task :test => ["test:htmlproofer"]
