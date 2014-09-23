---
title: Gerrit use cases
---
<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />

Gerrit use cases
================

Basis
-----

### Fetch remote changes
* Checkout: `git fetch `*ssh://user@host:29418/project refs/changes/ID#*` && git checkout FETCH_HEAD -b `*topic_branch*
* Cherry Pick: `git fetch `*https://host/gerrit/project refs/changes/ID#*` && git cherry-pick FETCH_HEAD`
* Pull: `git pull `*http://host/gerrit/project refs/changes/ID#*
* Using git-review: `git review -l && git review -d `*ID#*

### Push local changes
* Basic push on master: `git push origin HEAD:refs/for/master`
* Push in a Gerrit topic branch: `git push origin HEAD:refs/for/`*master*`/`**topic**
* Push a draft: `git push origin HEAD:refs/`**drafts**`/`*master*
* Push in a specific branch: `git push origin HEAD:refs/for/`**branch**
* Use git-review: `git review -t `*topic*

Submit new changes
------------------
0. `git checkout `*master*` && git pull`
1. `git checkout -b `*topic_branch* *master*
2. Make some modifications
3. `git add `*file1 file2 fileN*
4. `git commit -m `"*commit message*"
5. [Push changes](#push-local-changes)

Modify a Change
---------------
1. [Fetch the change](#fetch-remote-changes)
2. Make some modifications
3. `git add `*file1 file2 fileN*
4. `git commit --amend`
5. [Push changes](#push-local-changes)

Modify a Change that have dependencies
--------------------------------------
(C1)--(C2)--(C3 to modify)--(C4)

1. `git checkout `*topic_branch*
2. `git rebase -i origin`/*master*
3. Replace *pick* by *edit* at the start of the lines of the commits you want to modify
4. `git add `*file1 file2 fileN*
5. `git commit --amend`
6. `git rebase --continue`
7. [Push changes](#push-local-changes)

> Since Gerrit 2.4, you can also [fetch and modify](#modify-a-change) the commit then use the *Rebase* button in the Web UI

Deal with Gerrit merge conflicts
--------------------------------
1. [Fetch every changes](#fetch-remote-changes)
2. Make some modifications
3. `git checkout `*topic_branch2*
4. `git rebase `*topic_branch1*
5. Resolv the conflict
    1. `git status`
    2. Mofify conflicting files
    3. `git add `*conflicting_file1 conflicting_file2 conflicting_fileN*
    4. `git commit`
    5. `git rebase --continue`
5. (`git checkout `*topic_branch3*` && git rebase `*topic_branch2*)
6. [Push changes](#push-local-changes)

Work with branches
------------------
* Work on new branches
    1. `git checkout -b` *branchname* `origin/`*branchname*
    2. `git checkout -b` *topic_branch branchname*
    3. Make some modifications
    4. `git push origin HEAD:refs/for/`*branchname* OR `git review`
* Push new branches
    1. `git checkout -b` *branchname master*
    2. Make some modifications
    3. `git push origin origin/`*master*`:refs/heads/`*branchname*
    4. `git push origin HEAD:refs/for/`*branchname* OR `git review`
> You need to have the right to Push in refs/heads/* (cf. the Gerrit projet's access settings)

Misc
----
* Push tags:
    1. `git tag` *v1.0*
    2. `git push origin` *v1.0*`:refs/tags/`*v1.0*
* Setup Gerrit in an existing repository:
    1. `git remote add|set-url origin` *ssh://gerrit/project*
    2. `git push origin` *master*`:ref/heads/`*master*

Best Practice
-------------
* Always work in topic branches
    * Avoid useless dependencies between commits
    * (Reverse local changes: `git reset --hard origin/`*master*)
* Try to keep your *master* branch up to date
    * Avoid surprises at pushing time
* Use Gerrit topics (bug/ID#,feature/ID#,...)
    * Commits can be browsed by topic
* Use tags in commit messages ([Bug#],[Feature#],...)
    * Gerrit can create hyperlinks depending on this tags
* Use Gerrit drafts for WIP commits
    * Save your co-worker's time
* NEVER EVER use `git push -f`
