---
title: Research Interests
author: JWN
date: 2026. 09. 25.
---

My research interests are centered on **convex optimization** and **duality-based reformulation**. I am interested in using these tools not only as abstract theory, but as a common language for turning difficult problems into formulations that can be analyzed and solved reliably.

The specific application areas may change over time. At the moment, I am particularly interested in two directions: **distributionally robust portfolio optimization** and **AI / scientific machine learning**.

## Convex Optimization and Duality

Convex optimization provides a setting in which global optimality, tractable algorithms, and structural analysis can often be developed together. I am especially interested in problems where an apparently complicated formulation can be transformed into a convex problem by identifying the right variables, constraints, or representation.

Duality is closely connected to this viewpoint. A dual formulation can provide more than an alternative optimization problem: it can expose hidden structure, produce useful bounds, and convert an infinite-dimensional or nested problem into a finite-dimensional tractable one.

For this reason, my main methodological interest is not limited to solving a given optimization problem numerically. I am interested in understanding **how a problem can be reformulated through convexity and duality, and what information becomes visible after that reformulation**.

## Distributionally Robust Portfolio Optimization

One application direction is **Distributionally Robust Portfolio Optimization (DRPO)**.

Classical portfolio optimization typically assumes that the distribution of asset returns is known or estimated from historical data. In practice, however, the estimated distribution is itself uncertain. Distributionally robust optimization addresses this by optimizing against a set of plausible probability distributions rather than a single estimated model.

A generic formulation has the form

$$
\min_{w \in \mathcal{W}}
\sup_{\mathbb{P} \in \mathcal{P}}
\rho_{\mathbb{P}}\!\left(L(w,\xi)\right),
$$

where $w$ is the portfolio, $\mathcal{W}$ represents portfolio constraints, $\mathcal{P}$ is an ambiguity set for the return distribution, and $\rho_{\mathbb{P}}$ is a risk measure such as CVaR.

### Role of optimization

Optimization determines how portfolio constraints, risk measures, transaction restrictions, sparsity, and robustness can be incorporated into a single decision problem. An important question is whether the resulting problem remains computationally tractable when realistic constraints are added.

I am particularly interested in data-driven ambiguity sets and in models that incorporate additional market structure, such as regime information, while retaining a formulation that can be solved efficiently.

### Role of duality

The inner worst-case problem over $\mathbb{P}$ is often infinite-dimensional. Duality can transform this distributional optimization problem into a finite-dimensional reformulation involving the portfolio variables and additional dual variables.

This is one of the clearest examples of the role I would like duality to play in my research:

> Use duality not merely to prove strong duality, but to obtain a formulation that can actually be analyzed and computed.

Possible directions include richer ambiguity sets, regime-dependent uncertainty, and portfolio constraints whose interaction with the dual reformulation is not yet fully understood.

## AI and Scientific Machine Learning

A second direction is the intersection of optimization with **AI and scientific machine learning**.

I am particularly interested in learning-based methods for problems that are difficult to solve with classical numerical methods in high dimensions. Examples include neural approaches to PDEs and BSDEs, such as Deep BSDE methods, where neural networks are used to approximate unknown solution components or controls.

For a forward-backward stochastic differential equation,

$$
\begin{aligned}
dX_t &= \mu(t,X_t)\,dt + \sigma(t,X_t)\,dW_t, \\
dY_t &= -f(t,X_t,Y_t,Z_t)\,dt + Z_t\,dW_t,
\end{aligned}
$$

a neural model can be used to parameterize quantities such as $Z_t$ or the solution map. This turns a high-dimensional numerical problem into a learning problem, but it also raises questions about stability, consistency, constraints, and the structure of the resulting optimization landscape.

### Role of optimization

Training itself is an optimization problem, but my interest is broader than choosing a neural-network architecture or optimizer. I am interested in how the mathematical structure of the original problem can be preserved or exploited during learning.

Examples include constrained learning, control and hedging interpretations of $Z$, structure-aware loss functions, and hybrid methods that combine numerical optimization with neural approximation.

### Role of duality

Duality may be useful when learning problems contain constraints, robust objectives, or nested optimization. Primal-dual formulations can provide a natural way to incorporate constraints, while dual reformulations may turn robust or adversarial components into more tractable training objectives.

Not every AI problem has a useful dual formulation, so the goal is not to apply duality mechanically. The more interesting question is **when duality reveals enough structure to make a learning-based method more interpretable, stable, or computationally manageable**.

## Direction

The common theme across these areas is therefore

$$
\text{problem structure}
\longrightarrow
\text{convex formulation}
\longrightarrow
\text{duality-based reformulation}
\longrightarrow
\text{tractable computation}.
$$

The application domain may vary, but I would like the mathematical core of my work to remain centered on optimization and duality. Over time, this page will serve as a working description of the directions I am exploring rather than a fixed list of topics.
