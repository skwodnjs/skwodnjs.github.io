---
title: convex set
date: 2025-03-25 10:58:00 +0900
categories: [장편소설, 모두를 위한 컨벡스 최적화]
tags: []     # TAG names should always be lowercase
author: skwodnjs
math: true
---

## Examples of convex set

### Hyperplanes

definition
{: .subheading}

Let $a \in \mathbb R^n$ with $a \neq 0$, $b \in \mathbb R$. Then a hyperplane is defined by:
$$\begin{equation}
    \{ x \in \mathbb R^n : a^\top x = b\}
\end{equation}$$
$a$ is a normal vector, and $b$ is an offset of origin.
{: .text-box}

Hyperplanes는 convex set이자 affine set이다. affine set이면 convex set이므로, 
affine set인 것만 보이면 된다.

proof
{: .subheading}

추가 바람.
{: .text-box}

### Halfspaces

definition
{: .subheading}

Let $a \in \mathbb R^n$ with $a \neq 0$, $b \in \mathbb R$. Then a halfspace is defined by:
$$\begin{equation}
    \{ x \in \mathbb R^n : a^\top x \ge b\}
\end{equation}$$
or
$$\begin{equation}
    \{ x \in \mathbb R^n : a^\top x \le b\}
\end{equation}$$
{: .text-box}

$a ^\top x$는 $a$와 $x$의 내적으로 볼 수 있고, 그 값은 $x$가 $a$와 유사한 방향일수록 증가한다. 
따라서, $a ^\top x \ge b$는 $a ^\top x = b$를 기준으로 $a$ 벡터가 가리키는 방향이 된다.
반대로 $a ^\top x \le b$는 $a ^\top x = b$를 기준으로 $-a$ 벡터가 가리키는 방향이 된다.

halfspace는 convex set이지만 affine set은 아니다.

proof
{: .subheading}

추가 바람.
{: .text-box}

### Euclidean balls

definition
{: .subheading}

Euclidean ball is defined by:
$$\begin{equation}
    B(x_c, r) = \{ x \in \mathbb R^n : \| x - x_c \| \le r \}
\end{equation}$$
{: .text-box}

Euclidean ball은 convex set이다.

proof
{: .subheading}

추가 바람.
{: .text-box}

### Ellipsoids

definition
{: .subheading}

Let $P$ be a symmetric and positive definite matrix. Then an ellipsoid $\epsilon$ is defined by:
$$\begin{equation}
    \epsilon = \{ x \in \mathbb R^n : (x - x_c)^\top P^{-1} (x - x_c) \le 1 \}
\end{equation}$$
{: .text-box}

(link)[#]. 추가 바람.

Ellipsoids는 convex set이다.

proof
{: .subheading}

추가 바람.
{: .text-box}

### Norm balls

definition
{: .subheading}

$p$-norm is defined as follows:
$$\begin{equation}
    \| \cdot \|_p = \left ( \sum_{i=0}^n |x_i| ^p \right)^{\frac{1}{p}}
\end{equation}$$
And $p$-norm ball is defined as follows:
$$\begin{equation}
    \{ x \in \mathbb R^n : \| x - x_c \|_p \le r \}
\end{equation}$$
{: .text-box}

$p$-norm ball is a convex set if $p \ge 1$.

proof
{: .subheading}

추가 바람.
{: .text-box}

### Polyhedra

definition
{: .subheading}

Polyhedra is defined as follows:
$$\begin{equation}
    \mathcal P = \{ x \in \mathbb R^n : a_i^\top x \le b_o, \; i = 1, \; \cdots, m, c_j^\top x = d, \; j = 1, \cdots, p \}.
\end{equation}$$
{: .text-box}

Polyhedra는 halfspaces의 교집합으로 표현되는 집합이다. convex sets의 countable개 교집합은 convex를 유지하므로, 
Polyhedra 역시 convex임을 알 수 있다.

## Convex를 보존하는 함수

### 추가 바람...