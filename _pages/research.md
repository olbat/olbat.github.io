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
- __{{paper.title}}__  {% if paper.reference%}
  {{paper.reference}}  {% endif %}{% if paper.target.description%}  
  {{paper.target.description}}  {% endif %}
  _{% if paper.target.url %}[{{paper.target.name}}]({{paper.target.url}}){% else %}{{paper.target.name}}{% endif %}{% if paper.target.location %}, {{paper.target.location}}{% endif %} – [file]({{paper.file | relative_url}}){% if paper.url %} · [www]({{paper.url}}){% endif %}_
{% endfor %}


## Posters
{% for poster in site.data.research.posters %}
- __{{poster.title}}__  {% if poster.target.description %}
  {{poster.target.description}}  {% endif %}
  _{% if poster.target.url %}[{{poster.target.name}}]({{poster.target.url}}){% else %}{{poster.target.name}}{% endif %}{% if poster.target.location %}, {{poster.target.location}}{% endif %} – [file]({{poster.file | relative_url}}){% if poster.url %} · [www]({{poster.url}}){% endif %}_
{% endfor %}


## Slides
{% for slides in site.data.research.slides %}
- __{{slides.title}}__  {% if slides.target.description %}
  {{slides.target.description}}  {% endif %}
  _{% if slides.target.url %}[{{slides.target.name}}]({{slides.target.url}}){% else %}{{slides.target.name}}{% endif %}{% if slides.target.location %}, {{slides.target.location}}{% endif %} – [file]({{slides.file | relative_url}}){% if slides.url %} · [www]({{slides.url}}){% endif %}_
{% endfor %}


## Projects
{% for project in site.data.research.projects -%}
- [{{project.name}}]({{project.url}}) ({{project.description}})
{% endfor %}


## Misc
{% for doc in site.data.research.misc %}
- __{{doc.title}}__  {% if doc.description %}
  {{doc.description}}  {% endif %}
  _{% if doc.target.url %}[{{doc.target.name}}]({{doc.target.url}}){% else %}{{doc.target.name}}{% endif %}{% if doc.target.location %}, {{doc.target.location}}{% endif %} – [file]({{doc.file | relative_url}}){% if doc.url %} · [www]({{doc.url}}){% endif %}_
{% endfor %}
