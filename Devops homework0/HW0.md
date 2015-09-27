# HW

# Part 1: Git Basics

## I. Introduction Sequence

### 1. Intorduction to git commits
>     git commit   
>     git commit

### 2. Branching in Git
>     git branch bugFix
>     git checkout bugFix

### 3. Merging in Git
>     git branch bugFix 
>     git checkout bugFix 
>     git commit 
>     git checkout master 
>     git commit 
>     git merge bugFix

### 4. Rebase Introduction
>     git branch bugFix 
>     git checkout bugFix 
>     git commit
>     git checkout master 
>     git commit 
>     git checkout bugFix 
>     git rebase master

## II. Ramping Up

### 1. Detach yo' HEAD
>     git checkout C4

### 2. Relative Refs
>     git checkout C4 
>     git checkout HEAD^

### 3. Relative Refs2
>     git checkout C6 
>     git branch -f master HEAD~0 
>     git checkout C1
>     git branch -f bugFix HEAD~1

### 4. Reversing changes in Git
>     git reset HEAD~1
>     git checkout pushed 
>     git revert pushed
 

### Screenshot demonstrating progress 
![Alt text](https://github.ncsu.edu/kdinava/HW/blob/master/screenshot.png "Screenshot for puzzle")
---

# Part 2: Hooks
### Content of post-commit
>     #!/bin/sh 
>     start http://www.google.com
 
### Link to screencast
   https://www.youtube.com/watch?v=iWH9hJqZhqw&feature=youtu.be&hd=1

