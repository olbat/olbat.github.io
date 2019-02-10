require "jekyll"

# The minimal-mistakes theme is using the "jekyll-include-cache" plugin since
# version 4.14.0 (see https://github.com/mmistakes/minimal-mistakes/pull/1874).
#
# This change breaks some dynamically generated content, i.e. content
# generated from _includes/head/custom.html and _includes/footer.html.
#
# This plugin monkey patches the "include_cached" tag of "jekyll-include-cache"
# to disable the caching feature and make it work as Jekyll's "include" tag.

Liquid::Template.register_tag("include_cached", Jekyll::Tags::IncludeTag)
