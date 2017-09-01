---
layout: single
title: Research
permalink: "research/"
---
{% if site.data.identities.profiles.google_scholar or site.data.identities.profiles.research_gate %}
<div style="float: right;">
<p><i class="fa fa-fw fa-university"></i> {% if site.data.identities.profiles.google_scholar %}<a href="http://scholar.google.com/citations?user={{site.data.identities.profiles.google_scholar}}">Google Scholar</a>{% endif %}{% if site.data.identities.profiles.research_gate %} · <a href="https://www.researchgate.net/profile/{{site.data.identities.profiles.research_gate}}">ResearchGate</a>{% endif %}</p>
</div>
{% endif %}


## Papers
{% for paper in site.data.research.papers %}
- {% include research-doc.html doc=paper %}
{% endfor %}


## Posters
{% for poster in site.data.research.posters %}
- {% include research-doc.html doc=poster %}
{% endfor %}


## Slides
{% for slides in site.data.research.slides %}
- {% include research-doc.html doc=slides %}
{% endfor %}


## Projects
{% for project in site.data.research.projects -%}
- [{{project.name}}]({{project.url}}) ({{project.description}})
{% endfor %}


## Misc
{% for doc in site.data.research.misc %}
- {% include research-doc.html doc=doc %}
{% endfor %}
