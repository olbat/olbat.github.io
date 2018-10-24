require 'yaml'
require 'json'
require 'uri'
require 'open-uri'
require 'digest/sha2'
require 'jekyll'
require 'json/ld'
require 'json-schema'
require 'html-proofer'
require 'htmlcompressor'
require 'mkmf'

SITE_DIR="_site"
SITE_DATA_DIR="data"
IMAGES_DIR="assets/images"
JAVASCRIPT_DIR="assets/js"
STYLE_DIR="assets/css"
DATA_DIR="_data"
FILES_DIR="files"

JEKYLL_CONFIG_FILE ="_config.yml"
BANNER_IMAGE_FILE=File.join(IMAGES_DIR, "banner.jpg")
IDENTITY_FILE=File.join(DATA_DIR, "identities.yml")
FONTAWESOME_FILE=File.join(JAVASCRIPT_DIR, "fontawesome.min.js")
STYLESHEET_FILE=File.join(STYLE_DIR, "main.css")
JSON_RESUME_FILE=File.join(FILES_DIR, "resume.json")
PDF_FILES=["misc/cv-*.pdf"].map{|f| File.join(FILES_DIR, f) }

THEME_INCLUDES_TO_COPY=["seo.html"]
BANNER_IMAGE_SIZE=[1600, 300]
PDF_PREVIEW_SIZE=[300, 425]
FONTAWESOME_VERSION='5.4.1'
UNCSS_DOCKER_IMAGE="olbat/uncss"
JSON_RESUME_SCHEMA="https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json"
SRI_LINK_TYPES=["stylesheet", "application/atom+xml", "icon"]


def jekyll_config
  @jekyll_config ||= YAML.load_file(JEKYLL_CONFIG_FILE)
end

def site_path
  @site_path ||= (jekyll_config["destination"] || SITE_DIR)
end

def cmd(command, debug=true)
  puts command if debug
  `#{command}`.tap{ abort "command failed" unless $?.success? }
end

namespace :sync do
  desc "Copy files from the current version of the theme to modify them"
  task :copy_theme_includes do
    theme = Jekyll::Theme.new(jekyll_config['theme'])
    THEME_INCLUDES_TO_COPY.each do |filename|
      sh "cp #{File.join(theme.includes_path, filename)} _includes/"
    end
  end
end

namespace :generate do
  desc "Generate a minified version of Font Awesome"
  # uses/requires Node.js, fa-minify (https://www.npmjs.com/package/fa-minify)
  # and uglify-js (https://www.npmjs.com/package/uglify-js)
  task :fontawesome do
    sh "node scripts/generate-fontawesome.js #{FONTAWESOME_VERSION} "\
      << "> #{FONTAWESOME_FILE}"
  end

  desc "Generate the banner image"
  # uses/requires ImageMagick (https://www.imagemagick.org/)
  # and Node.js/trianglify (https://www.npmjs.com/package/trianglify)
  task :banner_image do
    conf = YAML.load_file(IDENTITY_FILE)
    fingerprint = seed = nil
    if conf['pgp'] && (fingerprint = conf['pgp']['fingerprint'])
      seed = fingerprint.gsub(/\s+/, '')
    else
      seed = rand(16 ** 16).to_s(16)
    end

    sh "node scripts/generate-banner.js "\
      << "#{BANNER_IMAGE_SIZE[0]} #{BANNER_IMAGE_SIZE[1]} 0x#{seed} " \
      << '| convert svg:- ' \
      << "-sampling-factor 4:2:0 -strip -quality 80 " \
      << "-interlace JPEG -colorspace sRGB " \
      << "-flop " \
      << BANNER_IMAGE_FILE
  end

  desc "Generate the preview images for CV files"
  # uses/requires ImageMagick (https://www.imagemagick.org/)
  task :preview_images do
    Dir.glob(*PDF_FILES).each do |srcfile|
      dstfile = File.join(IMAGES_DIR, "#{File.basename(srcfile, ".pdf")}.jpg")
      # see https://developers.google.com/speed/docs/insights/OptimizeImages
      sh 'convert ' \
        << "#{srcfile} " \
        << "-resize #{PDF_PREVIEW_SIZE.join('x')} " \
        << "-sampling-factor 4:2:0 -strip -quality 70 " \
        << "-interlace JPEG -colorspace sRGB " \
        << dstfile
    end
  end
end
task :generate => [
  "generate:fontawesome",
  "generate:banner_image",
  "generate:preview_images",
]

namespace :build do
  # equivalent to: jekyll build --strict_front_matter --verbose
  desc "Build the website using jekyll"
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
    Dir[*jconfig["exclude"].map{|d| File.join(site_path, d) }].each do |d|
      sh "rm -r #{d}"
    end if jconfig["exclude"]
  end

  # FIXME: to be done using Jekyll (not done yet as it renders YAML files)
  desc "Copy data into the #{site_path} directory"
  task :data do
    data_dir = File.join(site_path(), SITE_DATA_DIR)
    Dir.mkdir(data_dir) unless File.exists?(data_dir)

    Dir[File.join(DATA_DIR, "*")].each do |f|
      sh "cp -P #{f} #{data_dir}"
    end
  end

  desc "Generates Subresource Integrity digests"
  # see https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity
  task :sri do
    link_types = SRI_LINK_TYPES.map{|type| "@rel='#{type}'" }
    Dir[File.join(site_path, '**', '*.html')].each do |f|
      puts "generate SRI digests for #{f}"

      # look for <script> and <link> tags
      doc = Nokogiri::HTML(File.read(f))
      doc.xpath("//script|//link[#{link_types.join(' or ')}]").each do |node|
        link = nil
        if node.name == 'script' && node.has_attribute?('src')
          link = URI(node['src'])
        elsif node.name == 'link' && node.has_attribute?('href')
          link = URI(node['href'])
        end

        if link  # only take in account external resources
          if link.host  # add CORS requirements
            node['crossorigin'] = 'anonymous'
          else  # local files
            link = URI(File.join(site_path, link.to_s))
          end

          # fetch the content for linked resources
          content = open(link.to_s){|f| f.read }

          # add the "integrity" attribute
          node['integrity'] = "sha384-#{Digest::SHA384.base64digest(content)}"
        end
      end

      # write the page back
      File.write(f, doc.to_html)
    end
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
          dat = JSON.load(t.text)
          dat = JSON::LD::API.compact(dat, dat['@context'])
          t.replace(dat.to_json)
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
    task :css do
      f = File.join(site_path(), STYLESHEET_FILE)

      css = cmd("uncss --noBanner --htmlroot '#{site_path()}' "\
        "--stylesheets '/#{STYLESHEET_FILE}' "\
        "'#{File.join(site_path(), "**", "*.html")}' ")

      puts "minify #{f}"
      File.write(f, css)
    end

    desc "Minify Javascript files using uglifyjs"
    # see https://github.com/mishoo/UglifyJS2
    task :js do
      Dir[File.join(site_path, JAVASCRIPT_DIR, '*.js')].each do |f|
        js = cmd("uglifyjs --compress --mangle --comments=license -- #{f}")

        puts "minify #{f}"
        File.write(f, js)
      end
    end
  end
  task :compress => ["compress:css", "compress:js", "compress:pages"]
end
task :build => [
  "build:jekyll",
  "build:compress:css",  # to be done before SRI
  "build:compress:js",  # to be done before SRI
  "build:sri",
  "build:data",
  "build:cleanup",
  "build:compress:pages",
]


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

  desc "Validates structured data contained in pages"
  task :structured_data do
    Dir[File.join(site_path, '**', '*.html')].each do |f|
      puts "testing #{f}"
      page = File.read(f)
      doc = Nokogiri::HTML(page)
      doc.xpath('//script[@type="application/ld+json"]/text()').each do |t|
        dat = JSON.load(t.text)
        JSON::LD::API.compact(dat, dat['@context'], validate: true)
      end
    end
  end

  desc "Verify signed data using the PGP public key"
  task :signed_data do
    conf = YAML.load_file(IDENTITY_FILE)
    return unless conf['pgp']
    sh "gpg --import #{conf['pgp']['file']}"
    fingerprint = conf['pgp']['fingerprint'].gsub(/\s+/,'')
    file = File.join(site_path(), conf['signature_file'])

    content = cmd("gpg --decrypt -u #{fingerprint} #{file}")

    abort "data != signed data" unless File.read(IDENTITY_FILE) == content
  end

  desc "Validates JSON resume"
  task :json_resume do
    if File.exists?(JSON_RESUME_FILE)
      err = JSON::Validator.fully_validate(JSON_RESUME_SCHEMA, JSON_RESUME_FILE)
      abort "invalid JSON resume:\n- #{err.join("\n- ")}" if err && !err.empty?
    end
  end
end
task :test => [
  "test:htmlproofer",
  "test:structured_data",
  "test:signed_data",
  "test:json_resume",
]
