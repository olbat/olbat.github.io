---
layout: single
title: Identities
permalink: "ids/"
---
{% if site.data.identities.signature_file %}<div style="float: right;"><p><i class="fa fa-fw fa-key"></i> <a href="{{site.data.identities.signature_file | relative_url}}">Signature</a></p></div>{% endif %}

## Profiles
{% if site.data.identities.profiles %}
{% if site.data.identities.profiles.keybase %}- [Keybase](https://keybase.io/{{site.data.identities.profiles.keybase}}){% endif %}
{% if site.data.identities.profiles.github %}- [GitHub](https://github.com/{{site.data.identities.profiles.github}}){% endif %}
{% if site.data.identities.profiles.linkedin %}- [LinkedIn](https://www.linkedin.com/in/{{site.data.identities.profiles.linkedin}}){% endif %}
{% if site.data.identities.profiles.google_scholar %}- [Google Scholar](http://scholar.google.com/citations?user={{site.data.identities.profiles.google_scholar}}){% endif %}
{% if site.data.identities.profiles.research_gate %}- [ResearchGate](https://www.researchgate.net/profile/{{site.data.identities.profiles.research_gate}}){% endif %}
{% if site.data.identities.profiles.twitter %}- [Twitter](https://twitter.com/{{site.data.identities.profiles.twitter}}){% endif %}
{% if site.data.identities.profiles.youtube %}- [Youtube](https://www.youtube.com/user/{{site.data.identities.profiles.youtube}}){% endif %}
{% if site.data.identities.profiles.steam %}- [Steam](https://steamcommunity.com/id/{{site.data.identities.profiles.steam}}){% endif %}
{% if site.data.identities.profiles.reddit %}- [reddit](https://www.reddit.com/user/{{site.data.identities.profiles.reddit}}){% endif %}
{% endif %}


{% if site.data.identities.pgp or site.data.identities.ssh %}
## Public keys
{% if site.data.identities.pgp %}
<details>
  <summary>PGP{% if site.data.identities.pgp.fingerprint %} <a href="http://pool.sks-keyservers.net/pks/lookup?search=0x{{site.data.identities.pgp.fingerprint | replace: ' ', ''}}&op=vindex">{{site.data.identities.pgp.fingerprint}}</a>{% endif %} – <a href="{{site.data.identities.pgp.file | relative_url}}">file</a></summary>
  <pre>{{site.data.identities.pgp.key}}</pre>
</details>
{% endif %}
{% if site.data.identities.ssh %}
<details>
  <summary>SSH – <a href="{{site.data.identities.pgp.file | relative_url}}">file</a></summary>
  <pre>{{site.data.identities.ssh.key}}</pre>
</details>
{% endif %}
{% endif %}


{% if site.data.identities.websites %}
## Websites
{% for website in site.data.identities.websites %}
- {{website[0]}}: [{{website[1]}}]({{website[1]}})
{% endfor %}
{% endif %}


{% if site.data.identities.bitcoin_address %}
## Misc
- Bitcoint address: `{{site.data.identities.bitcoin_address}}`
{% endif %}
