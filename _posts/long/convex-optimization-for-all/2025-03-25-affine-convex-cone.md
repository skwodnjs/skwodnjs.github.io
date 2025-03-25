---
title: affine, convex, cone
date: 2025-03-25 10:58:00 +0900
categories: [장편소설, 모두를 위한 컨벡스 최적화]
tags: [affine, convex, cone, affine combination, convex combination, conic combination, affine hull, convex hull, conic hull]     # TAG names should always be lowercase
author: skwodnjs
math: true
---

## Affine set

definition
{: .subheading}

집합 $C \subseteq \mathbb R ^n$ is an affine set if $\forall x_1, x_2 \in C$, 
$$\begin{equation}
    \theta x_1 + (1-\theta) x_2 \in C \quad \forall \theta \in \mathbb R.
\end{equation}$$
{: .text-box}

### Affine combination

definition
{: .subheading}

A linear combination of $x_1, \cdots, x_k \in \mathbb R^n$
$$\begin{equation}
    \theta_1 x_1 + \cdots + \theta_k x_k
\end{equation}$$
is called affine combination when $\theta_1 + \cdots + \theta_k = 1$.
{: .text-box}

theorem
{: .subheading}

집합 $C \subseteq \mathbb R ^n$ is an affine set if and only if $\forall x_1, \cdots, x_k \in C$ for any $k$, 
affine combination of $x_1, \cdots, x_k$ is also in $C$.
{: .text-box}

proof
{: .subheading}

추가 바람.
{: .text-box}

### Affine hull

definition
{: .subheading}

집합 $C \subseteq \mathbb R^n$(does not need to be affine)에 대해, affine hull of $C$는 다음과 같이 정의된다.
$$\begin{equation}
    \rm aff (C) = \{ \theta_1 x_1 + \cdots + \theta_k x_k \ \big| \ x_1, \cdots, x_k \in C, \; \theta_1 + \cdots + \theta_k = 1, \; \forall k \}.
\end{equation}$$
{: .text-box}

theorem
{: .subheading}

집합 $C \subseteq \mathbb R^n$에 대해, $\rm aff (C)$는 집합 $C$를 포함하는 가장 작은 affine set이다.
{: .text-box}

proof
{: .subheading}

추가 바람.
{: .text-box}





## Convex set

definition
{: .subheading}

집합 $C \subseteq \mathbb R ^n$ is an convex set if $\forall x_1, x_2 \in C$, 
$$\begin{equation}
    \theta x_1 + (1-\theta) x_2 \in C \quad \forall \theta \in [0, 1].
\end{equation}$$
{: .text-box}

### Convex combination

definition
{: .subheading}

A linear combination of $x_1, \cdots, x_k \in \mathbb R^n$
$$\begin{equation}
    \theta_1 x_1 + \cdots + \theta_k x_k
\end{equation}$$
is called convex combination when $\theta_1 + \cdots + \theta_k = 1$ and $\theta_i \in [0, 1]$ for all $i = 1, \cdots, k$.
{: .text-box}

theorem
{: .subheading}

집합 $C \subseteq \mathbb R ^n$ is an convex set if and only if $\forall x_1, \cdots, x_k \in C$ for any $k$, 
convex combination of $x_1, \cdots, x_k$ is also in $C$.
{: .text-box}

proof
{: .subheading}

추가 바람.
{: .text-box}

### Convex hull

definition
{: .subheading}

집합 $C \subseteq \mathbb R^n$(does not need to be convex)에 대해, convex hull of $C$는 다음과 같이 정의된다.
$$\begin{equation}
    \rm conv (C) = \{ \theta_1 x_1 + \cdots + \theta_k x_k \ \big| \ x_1, \cdots, x_k \in C, \; \theta_i \in [0, 1] \ \forall i = 1, \cdots, k, 
    \; \theta_1 + \cdots + \theta_k = 1, \; \forall k \}.
\end{equation}$$
{: .text-box}

theorem
{: .subheading}

집합 $C \subseteq \mathbb R^n$에 대해, $\rm conv (C)$는 집합 $C$를 포함하는 가장 작은 convex set이다.
{: .text-box}

proof
{: .subheading}

추가 바람.
{: .text-box}





## Cone

definition
{: .subheading}

집합 $C \subseteq \mathbb R ^n$ is a cone if $C$가 원점을 포함하고, $\forall x \in C$에 대해
$$\begin{equation}
    \theta x \in C \quad \forall \theta \ge 0.
\end{equation}$$
{: .text-box}

### Convex Cone

definition
{: .subheading}

집합 $C$가 cone이면서 동시에 convex이면 이를 convex라고 한다. 이 때, convex cone은 다음 정의와 동치이다.
$$\begin{equation}
    \theta_1 x_1 + \theta_2 x_2 \in C \quad \forall x_1, x_2 \in C, \; \theta_1, \theta_2 \ge 0.
\end{equation}$$
{: .text-box}

### Conic combination

definition
{: .subheading}

A linear combination of $x_1, \cdots, x_k \in \mathbb R^n$
$$\begin{equation}
    \theta_1 x_1 + \cdots + \theta_k x_k
\end{equation}$$
is called conic combination when $\theta_i \ge 0$ for $i = 1, \cdots, k$.
{: .text-box}

theorem
{: .subheading}

집합 $C \subseteq \mathbb R ^n$ is a convex cone(is also called conic set) if and only if $\forall x_1, \cdots, x_k \in C$ for any $k$, 
conic combination of $x_1, \cdots, x_k$ is also in $C$.
{: .text-box}

proof
{: .subheading}

추가 바람.
{: .text-box}

### Conic hull

definition
{: .subheading}

집합 $C \subseteq \mathbb R^n$(does not need to be conic)에 대해, conic hull of $C$는 다음과 같이 정의된다.
$$\begin{equation}
    \{ \theta_1 x_1 + \cdots + \theta_k x_k \ \big| \ x_1, \cdots, x_k \in C, \; \theta_i \ge 0, i=1, \cdots, k, \; \forall k \}.
\end{equation}$$
{: .text-box}

theorem
{: .subheading}

집합 $C \subseteq \mathbb R^n$에 대해, conic hull은 집합 $C$를 포함하는 가장 작은 convex cone이다.
{: .text-box}

proof
{: .subheading}

추가 바람.
{: .text-box}