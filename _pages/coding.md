---
layout: single
title: Coding
permalink: "coding/"
---
{% include structured_data/coding.html research=site.data.coding %}

{% assign links = "ids/#coding" | relative_url | prepend: "other profiles|" | append: "," %}
{% assign github = site.data.identities.profiles | where: "id", "github" %}
{% if github %}
{% assign github = github[0] %}
{% assign github = github.name | append: "|" | append: github.url %}
{% assign links = links | prepend: "," | prepend: github %}
{% endif %}
{% assign links = links | split: "," %}
{% include top-links.html icon="github" links=links %}

## Projects
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Language</th>
      <th>Last commit</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
{% for project in site.data.coding.projects %}
    <tr>
      <th colspan="4" style="border-bottom: 1px solid black;">
        {{project.group | capitalize}}
      </th>
    </tr>
  {% for repository in site.github.public_repositories %}
    {%- if project.repositories contains repository.name %}
    <tr>
      <td><a href="{{repository.html_url}}">{{repository.name}}</a></td>
      <td>{{repository.language}}</td>
      <td style="text-align: center;">
        <time datetime="{{repository.pushed_at}}">
          {{repository.pushed_at | date: "%F"}}
        </time>
      </td>
      <td>{{repository.description | truncatewords: 10}}</td>
    </tr>
    {%- endif %}
  {%- endfor %}
{% endfor %}
  </tbody>
</table>


## Code snippets
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Language</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
{% for cs in site.data.coding.code_snippets %}
    <tr>
      <td><a href="{{cs.url}}">{{cs.name}}</a></td>
      <td>{{cs.language}}</td>
      <td>{{cs.description | truncatewords: 15}}</td>
    </tr>
{% endfor %}
  </tbody>
{% if site.data.coding.code_snippets_url %}
  <tfoot>
    <tr><td colspan="3" style="text-align: center;">
      <a href="{{site.data.coding.code_snippets_url}}">more …</a>
    </td></tr>
  </tfoot>
{% endif %}
</table>