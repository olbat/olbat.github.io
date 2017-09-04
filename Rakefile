require 'yaml'
require 'json'
require 'jekyll'
require 'html-proofer'
require 'htmlcompressor'
require 'net/http'
require 'tempfile'
require 'tmpdir'
require 'mkmf'

JEKYLL_CONFIG_FILE ="_config.yml"
SITE_PATH="_site"

FONTELLO_HOST="http://fontello.com"
STYLESHEET_PATH="assets/css/main.css"
UNCSS_DOCKER_IMAGE="olbat/uncss"


def jekyll_config
  @jekyll_config ||= YAML.load_file(JEKYLL_CONFIG_FILE)
end

def site_path
  @site_path ||= (jekyll_config["destination"] || SITE_PATH)
end


namespace :generate do
  desc "Generate the font files from fontello.com"
  # see https://github.com/fontello/fontello/wiki/How-to-save-and-load-projects
  task :fonts do
    config = File.new(File.join('config', 'fontello.json'))
    zip = nil
    uri = URI(FONTELLO_HOST)
    Net::HTTP.start(uri.host, uri.port) do |http|
      req = Net::HTTP::Post.new(uri)
      req.set_form({"config" => config}, 'multipart/form-data')
      res = http.request(req)

      uri.path = File.join('/', res.body.strip, 'get')
      puts "fetching #{uri.to_s}"
      req = Net::HTTP::Get.new(uri)
      zip = http.request(req).body
    end

    Tempfile.open("fonts") do |f|
      f.write(zip)
      f.close

      Dir.mktmpdir("fonts") do |d|
        sh "unzip #{f.path} 'fontello-*/font/*' -d #{d}"

        Dir[File.join(d, "**", "font", "*")].each do |src|
          dst = File.basename(src).gsub('fontello', 'fontawesome-webfont')
          sh "cp #{src} #{File.join('assets', 'fonts', dst)}"
        end
      end
    end
  end
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
      compressor = HtmlCompressor::Compressor.new(
        compress_css: true,
        css_compressor: :yui,
        compress_javascript: true,
        javascript_compressor: :yui,
      )

      Dir[File.join(site_path, '**', '*.html')].each do |f|
        puts "compressing #{f}"
        page = File.read(f)

        # compress structured data
        doc = Nokogiri::HTML(page)
        doc.xpath('//script[@type="application/ld+json"]/text()').each do |t|
          t.replace(JSON.load(t.text).to_json)
        end
        page = doc.to_html

        # compress HTML/CSS/JS
        page = compressor.compress(page)

        # write the page back
        File.write(f, page)
      end
    end

    desc "Remove unused styles from CSS files using uncss"
    # see https://github.com/giakki/uncss
    task :uncss do
      cmd = "uncss --noBanner --htmlroot '#{site_path()}' "\
        "--stylesheets '/#{STYLESHEET_PATH}' "\
        "'#{File.join(site_path(), "**", "*.html")}'"
      unless find_executable('uncss')
        # if uncss is not installed, use the docker image
        cmd = "docker run -v #{Dir.pwd}:/src -w /src -u #{Process.uid} "\
              "--net=host #{UNCSS_DOCKER_IMAGE} #{cmd}"
      end

      # run uncss
      puts cmd
      css = `#{cmd}`
      abort "command failed" unless $?.success?

      # write the uncss output to the css file
      file = File.join(site_path(), STYLESHEET_PATH)
      puts "rewrite #{file}"
      File.write(file, css)
    end
  end
  task :compress => ["compress:uncss", "compress:pages"]
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
