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

SITE_DATA_DIR = "data"
IMAGES_DIR = "assets/images"
JAVASCRIPT_DIR = "assets/js"
STYLE_DIR = "assets/css"
FILES_DIR = "files"

FONTAWESOME_FILE = File.join(JAVASCRIPT_DIR, "fontawesome.min.js")
STYLESHEET_FILE = File.join(STYLE_DIR, "main.css")
BANNER_FILE = File.join(FILES_DIR, "misc", "banner.svg")
AVATAR_FILE = File.join(FILES_DIR, "misc", "avatar.png")
IDENTITY_FILE = "identities.yml"
RESUME_FILES = {
  :pdf => {
    :en => File.join(FILES_DIR, "misc", "cv-sarzyniec-en.pdf"),
    :fr => File.join(FILES_DIR, "misc", "cv-sarzyniec-fr.pdf"),
  },
  :json => {
    :en => File.join(FILES_DIR, "misc", "resume.json"),
  },
}.freeze
IMAGE_FILES = {
  "banner.jpg" => {
    source: BANNER_FILE,
    size: [1600, 300],
    quality: 80,
    args: "-sampling-factor 4:2:0 -interlace JPEG -colorspace sRGB -flop",
  },
  "avatar-small.png" => {
    source: AVATAR_FILE,
    size: [110, 110],
    quality: 93,
    args: "-depth 8",
  },
  "avatar-large.png" => {
    source: AVATAR_FILE,
    size: [460, 460],
    quality: 93,
    args: "-depth 8",
  },
  "favicon.ico" => {
    source: AVATAR_FILE,
    size: [32, 32],
    args: "-depth 8",
    destdir: ".",
  },
  "cv-sarzyniec-en.jpg" => {
    source: RESUME_FILES[:pdf][:en],
    size: [300, 425],
    quality: 70,
    args: "-sampling-factor 4:2:0 -interlace JPEG -colorspace sRGB",
  },
  "cv-sarzyniec-fr.jpg" => {
    source: RESUME_FILES[:pdf][:fr],
    size: [300, 425],
    quality: 70,
    args: "-sampling-factor 4:2:0 -interlace JPEG -colorspace sRGB",
  },
}.freeze

THEME_INCLUDES_TO_COPY = ["seo.html", "page__hero.html"]
FONTAWESOME_VERSION = '5.8.2'
JSON_RESUME_SCHEMA = "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json"
SRI_LINK_TYPES = ["stylesheet", "application/atom+xml", "icon"]
CSS_STYLE_TO_KEEP = [".header-link"]  # force the CSS minifier to keep this styles


def cmd(command, debug=true)
  puts command if debug
  `#{command}`.tap{ abort "command failed" unless $?.success? }
end


@jekyll_config = Jekyll.configuration
@site_path = @jekyll_config["destination"]


namespace :sync do
  desc "Copy files from the current version of the theme to modify them"
  task :copy_theme_includes do
    theme = Jekyll::Theme.new(@jekyll_config['theme'])
    THEME_INCLUDES_TO_COPY.each do |filename|
      sh "cp #{File.join(theme.includes_path, filename)} _includes/"
    end
  end
end


namespace :build do
  namespace :generate do
    desc "Generate a minified version of Font Awesome"
    # uses/requires Node.js, fa-minify (https://www.npmjs.com/package/fa-minify)
    # and uglify-js (https://www.npmjs.com/package/uglify-js)
    task :fontawesome do
      Dir.mkdir(JAVASCRIPT_DIR) unless File.exists?(JAVASCRIPT_DIR)
      sh "node scripts/generate-fontawesome.js #{FONTAWESOME_VERSION} "\
        << "> #{FONTAWESOME_FILE}"
    end

    desc "Generate the banner SVG image"
    # uses/requires ImageMagick (https://www.imagemagick.org/)
    # and Node.js/trianglify (https://www.npmjs.com/package/trianglify)
    task :banner do
      conf = YAML.load_file(File.join(@jekyll_config["data_dir"], IDENTITY_FILE))
      fingerprint = seed = nil
      if conf['pgp'] && (fingerprint = conf['pgp']['fingerprint'])
        seed = fingerprint.gsub(/\s+/, '')
      else
        seed = rand(16 ** 16).to_s(16)
      end

      img = IMAGE_FILES.select{|f, i| i[:source] == BANNER_FILE }.first[1]

      sh "node scripts/generate-banner.js "\
        << "#{img[:size][0]} #{img[:size][1]} 0x#{seed} " \
        << "> #{BANNER_FILE}"
    end

    desc "Generate images"
    # uses/requires ImageMagick (https://www.imagemagick.org/)
    task :images do
      Dir.mkdir(IMAGES_DIR) unless File.exists?(IMAGES_DIR)

      IMAGE_FILES.each_pair do |dest, img|
        sh 'convert ' \
          << "#{img[:source]} " \
          << "-resize #{img[:size].join('x')} " \
          << "-strip -quality #{img[:quality] || 70} " \
          << "#{img[:args]} " \
          << File.join(img[:destdir] || IMAGES_DIR, dest)
      end
    end
  end
  task :generate => [
    "generate:fontawesome",
    "generate:banner",
    "generate:images",
  ]

  # equivalent to: jekyll build --strict_front_matter --verbose
  desc "Build the website using jekyll"
  task :jekyll do
    config = Jekyll.configuration({
      'verbose' => true,
      'strict_font_matter' => true,
    })
    Jekyll::Commands::Build.build(Jekyll::Site.new(config), config)
  end

  # FIXME: to be removed once fixed in minimal-mistakes
  desc "Removes themes leftovers in the #{@site_path} directory"
  task :cleanup do
    jkcfg = @jekyll_config
    Dir[*jkcfg["exclude"].map{|d| File.join(@site_path, d) }].each do |d|
      sh "rm -r #{d}"
    end if jkcfg["exclude"]
  end

  # FIXME: to be done using Jekyll (not done yet as it renders YAML files)
  desc "Copy data into the #{@site_path} directory"
  task :data do
    data_dir = File.join(@site_path, SITE_DATA_DIR)
    Dir.mkdir(data_dir) unless File.exists?(data_dir)

    Dir[File.join(@jekyll_config["data_dir"], "*")].each do |f|
      sh "cp -P #{f} #{data_dir}"
    end
  end

  desc "Generates Subresource Integrity digests"
  # see https://developer.mozilla.org/docs/Web/Security/Subresource_Integrity
  task :sri do
    link_types = SRI_LINK_TYPES.map{|type| "@rel='#{type}'" }
    Dir[File.join(@site_path, '**', '*.html')].each do |f|
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
            link = URI(File.join(@site_path, link.to_s))
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

      Dir[File.join(@site_path, '**', '*.html')].each do |f|
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
      f = File.join(@site_path, STYLESHEET_FILE)

      css = cmd("uncss --noBanner --htmlroot '#{@site_path}' "\
        "--stylesheets '/#{STYLESHEET_FILE}' "\
        "--ignore '/#{Regexp.union(*CSS_STYLE_TO_KEEP).source}/' "\
        "'#{File.join(@site_path, "**", "*.html")}' ")

      puts "minify #{f}"
      File.write(f, css)
    end

    desc "Minify Javascript files using uglifyjs"
    # see https://github.com/mishoo/UglifyJS2
    task :js do
      Dir[File.join(@site_path, JAVASCRIPT_DIR, '*.js')].each do |f|
        js = cmd("uglifyjs --compress --mangle --comments=license -- #{f}")

        puts "minify #{f}"
        File.write(f, js)
      end
    end
  end
  task :compress => ["compress:css", "compress:js", "compress:pages"]
end
task :build => [
  "build:generate",
  "build:jekyll",
  "build:compress:css",  # to be done before SRI
  "build:compress:js",  # to be done before SRI
  "build:sri",
  "build:data",
  "build:cleanup",
  "build:compress:pages",
]


namespace :test do
  desc "Run HTMLProofer on the #{@site_path} directory"
  task :htmlproofer do
    config = {
      disable_external: %w{0 false off}.include?(ENV['EXT']),
      typhoeus: { ssl_verifypeer: false },
      # FIXME: necessary for linkedin.com URLs
      # (see https://github.com/gjtorikian/html-proofer/issues/215)
      http_status_ignore: [999],
    }
    HTMLProofer.check_directory(@site_path, config).run
  end

  desc "Validates structured data contained in pages"
  task :structured_data do
    Dir[File.join(@site_path, '**', '*.html')].each do |f|
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
    identity_file = File.join(@jekyll_config["data_dir"], IDENTITY_FILE)
    conf = YAML.load_file(identity_file)
    return unless conf['pgp']
    sh "gpg --import #{conf['pgp']['file']}"
    fingerprint = conf['pgp']['fingerprint'].gsub(/\s+/,'')
    file = File.join(@site_path, conf['signature_file'])

    content = cmd("gpg --decrypt -u #{fingerprint} #{file}")

    abort "data != signed data" unless File.read(identity_file) == content
  end

  desc "Validates JSON resume"
  task :json_resume do
    RESUME_FILES[:json].each_value do |f|
      err = JSON::Validator.fully_validate(JSON_RESUME_SCHEMA, f)
      abort "invalid JSON resume:\n- #{err.join("\n- ")}" if err && !err.empty?
    end if RESUME_FILES[:json]
  end
end
task :test => [
  "test:htmlproofer",
  "test:structured_data",
  "test:signed_data",
  "test:json_resume",
]
