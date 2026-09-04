---
layout: post
title: A Hybrid Search Agent in Bomberman
topic: Artificial Intelligence, Video Games
description: We developed an AI agent that combined rule-based system and Monte Carlo Tree Search in a hybrid approach. The highlight contribution of this project is the process of how we configure the algorithms to work in a resource-intensive environment resembling the Bomberman game.
link: https://dl.acm.org/doi/abs/10.1145/3235765.3235812
image: /images/portfolio/pommerman.png
---

![An overview of Pommerman](/images/portfolio/pommerman.png)
*A Screeenshot of Pommerman*

Various tree search algorithms, such as Monte Carlo Tree Search (MCTS), assume and require the existence of forward models to advance the state of the game. However, not all games support fast computing forward modeling due to factors such as complex game rules that require heavy computation to advance to the next state. 

This is a class project that I worked on in a Game AI class with two other people. In this work, we try to explore the potential of a high-performing agent in a resource-intensive, high frame rate and adversarial game environment. Specifically, the main work was searching for a balanced solution between using heuristics and tree search algorithms in the Pommerman framework (similar to Bomberman). Our solution enhanced the agent’s performance with tree search algorithms because for certain problems it is easier to express the goal rather than the strategies to reach the goal. The notable technical work here is (1) a novel blend between rule-based approach and tree-search-based approach and (2) testing different heuristics for tree search.

We published a workshop paper in FDG 2018, which is provided below. My technical statement, also provided below, details the development of the project, along with the technical issues we ran into and their solutions.

[>> Read our Paper <<](https://dl.acm.org/doi/abs/10.1145/3235765.3235812)

[>> Read my Technical Statement <<](/files/Pommerman-TechnicalStatement.pdf)