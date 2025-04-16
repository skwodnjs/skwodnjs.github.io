---
title: test - 1
date: 2025-04-16 16:18:39 +0900
categories: [test-tex-1]
tags: []
author: skwodnjs
math: true
---

##

###

Quadratic Programming (QP) problems are the following form:

$$
\begin{align}
\min_x \frac{1}{2} x^T Q x + q^T x \\
\rm s.t. \quad & Gx \le g \\
& Fx = f.
\end{align}
$$

where $Q \in \mathbb{R}^{n \times n}$ positive semi-definite. $F \in \mathbb{R} ^{p \times n}$, $G \in \mathbb{R} ^{q \times n}$,
and $x \in \mathbb{R}^n$, $q \in \mathbb{R}^n$, $f \in \mathbb{R} ^p$, $g \in \mathbb{R} ^q$ are vectors.
Using slack variable, we can derive the following equation:

$$
\begin{align}
\min_x \frac{1}{2} x^T Q x + q^T x + I_{\mathbb{R}^+}(z) \\
\rm s.t. \quad & Ax + Bz = c
\end{align}
$$

where

$$
\begin{equation}
I_{\mathbb{R}^+}(z) = \begin{cases}
0 & \quad z \ge 0 \\
\infty & \quad \rm otherwise
\end{cases}
\end{equation}
$$

and

$$
\begin{equation}
A = \begin{bmatrix}
G \\ F
\end{bmatrix},
\quad
B = \begin{bmatrix}
I_p \\ 0
\end{bmatrix},
\quad
c = \begin{bmatrix}
g \\ f
\end{bmatrix}.
\end{equation}
$$

$I_p$ is an $p \times p$ identity matrix.