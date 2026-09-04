---
layout: post
title: Atoms of Confusion - Investigating Confusing Code Elements
topic: Software Engineering, Programming Languages, Program Understanding
description: I participated in a project that investigates confusing elements that can occur in C code. The confusing elements are termed atoms of confusions and their occurrances in software projects were studied using quantitative methods.
link: https://dl.acm.org/doi/10.1145/3196398.3196432
image: /images/portfolio/atom_occurrence.png
---

![Atom of Confusion Occurrences](/images/portfolio/atom_occurrence.png)
*Occurrence Rate of each Atoms of Confusion*

I participated in a project called Atoms of Confusion back in my junior year in collegue. The project is mainly led by then-PhD student Dan Gopstein.

The idea of the project is to identify confusing elements - termed Atoms of Confusion, in C code. Examples include *Omitted Curly Brace* (such as an if-statement followed by one line of statement without curly braces) and *Operator Precedence* (a mixing of operators without brackets).

My main contribution was to develop classifiers for certain atoms such as the *Conditional Operator* and *Reversed Subscript*. I also started investigating the occurrence of *operator pairs* - an extension of operator precedence atom that further dives into which operators are tend to be used together without brackets. This line of pursuit was unfortunately discontinued as I moved on to other projects.

This was my first experience participating in a research project. I also learned functional programming and Clojure, which was very different from C-like programming languages.

[>> Read our Paper <<](https://dl.acm.org/doi/10.1145/3196398.3196432)