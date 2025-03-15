---
title: Convex & Jensen's Inequality
author: skwodnjs
date: 2025-03-14 22:32:00 +0900
categories: [단편소설]
tags: []
math: true
---

## Definition of Convex Function
함수 $f: I \to \mathbb{R}$가 다음 부등식을 만족하면, 함수 $f$를 **convex function**이라 부른다.

$$\begin{equation}
f(\theta x + (1 - \theta) y) \le \theta f(x) + (1-\theta) f(y) \qquad \forall x, y \in I , \ \forall \theta \in [0, 1]
\end{equation}
$$

## Property of Convex Function
Let $I$ be an **interval**, and let $f:I \to \mathbb{R}$ be a **convex function**. Then, for any $p, q, r \in I$ with $p<q<r$, the following inequalities hold:

1. $\frac{f(q) - f(p)}{q - p} \le \frac{f(r) - f(q)}{r - q}$
2. $\frac{f(q) - f(p)}{q - p} \le \frac{f(r) - f(p)}{r - p}$
3. $\frac{f(r) - f(p)}{r - p} \le \frac{f(r) - f(q)}{r - q}$

> proof.

$p<q<r$ 에서 $\exists \theta \in [0, 1]$ s. t $q = \theta p + (1 - \theta) r$.

Convex function의 정의에 의해, 다음이 성립한다.

$$\begin{equation}
f (\theta p + (1 - \theta) r) = f(q) \le \theta f(p) + (1 - \theta) f(r)
\end{equation}$$

이 때 

$$\begin{equation}
t = \frac{r-q}{r-p}, \ 1-t = \frac{q-p}{r-p}
\end{equation}$$

이므로 

$$\begin{align}
f(q) & \le \theta f(p) + (1 - \theta) f(r) \\
& = \frac{r-q}{r-p} f(p) + \frac{q-p}{r-p} f(r)
\end{align}$$

$$\begin{equation}
\therefore \quad (r-p) f(q) \le (r-q) f(p) + (q-p) f(r)
\end{equation}$$

양 변에 $(r - q) f(q)$를 빼면

$$\begin{align}
(r-p) f(q) - (r - q) f(q) & \le (r-q) (f(p) - f(q)) + (q-p) f(r) \\
(q - p) f(q) & \le (r - q) (f(p) - f(q)) + (q - p) f(r) \\
(r - q) (f(q) - f(p)) & \le (q - p) (f(r) - f(q))
\end{align}$$

$$\begin{equation}
\therefore \quad \frac{f(q) - f(p)}{q - p} \le \frac{f(r) - f(q)}{r - q}
\end{equation}$$

The first inequality has been proved.

같은 방식으로 두번째, 세번째 부등식을 증명할 수 있다.

## Jensen's Inequality

### Lemma
1
Let $I$ be an **open interval**, and let $f:I \to \mathbb{R}$ be a **convex function**. Then, for fixed $x_0 \in I$, 
$\exists b$ such that $f(x) \ge f(x_0) + b(x - x_0)$ for all $x \in I$.

> proof.

Let $0 < h_1 < h_2$. Let $df_{p, q} = \frac{f(q) - f(p)}{q-p}$.

Then for all $x_0$, $df_{x_0 - h_2, x_0} \le df_{x_0 - h_1, x_0} \le df_{x_0, x_0 - h_1} \le df_{x_0, x_0 - h_2}$.

$df_{x_0 - h_1, x_0}$는 $df_{x_0, x_0 - h_2}$에 의해 lower bounded이므로 $\displaystyle df_- f(x_0) := \lim_{h_1 \to 0+} \inf df_{x_0 - h_1, x_0}$가
잘 정의된다. 같은 이유로 $\displaystyle df_+ f(x_0) := \lim_{h_1 \to 0-} \sup df_{x_0 - h_1, x_0}$를 잘 정의할 수 있다.
그리고 $df_- f(x_0) \le df_+ f(x_0)$라는 사실도 알 수 있다.

이 때, $b \in [df_- f(x_0), df_+ f(x_0)]$인 $b$를 잡으면 다음이 성립한다.

If $x > x_0$, 
$$\begin{equation}
f(x) - f(x_0) = df_{x_0, x} \ (x - x_0) \ge d_+ f(x_0) (x - x_0) \ge b(x - x_0)
\end{equation}$$

If $x < x_0$, 
$$\begin{equation}
f(x) - f(x_0) = df_{x_0, x} \ (x - x_0) \ge d_- f(x_0) (x - x_0) \ge b(x - x_0)
\end{equation}$$

> Note that $f$ does not need to be **differentiable**. If $f$ is **differentiable**, then $b = f'(x_0)$.
{: .prompt-tip }

### Jensen's Inequality

Let $I$ be an **open interval**, and let $f:I \to \mathbb{R}$ be a **convex function**. Then, for any convex combination 
$x_1, \cdots, x_n \in I$ with weights $\lambda_1, \cdots, \lambda_n$ such that $\sum_{i=1}^n \lambda_i = 1$ and
$\lambda_i \ge 0$, we have:

$$\begin{equation}
f\left( \sum_{i=1}^n \lambda_i x_i \right) \le \sum_{i=1}^n \lambda_i f(x_i)
\end{equation}$$

또는, **연속적인 경우**로 확장하면,

$$\begin{equation}
f\left( \mathbb{E} [X] \right) \le \mathbb{E} [f(X)]
\end{equation}$$

where $X$ is a random variable supported on $I$.

> proof.

By lemma, $f(x) \ge f(x_0) + b(x- x_0)$ for all $x \in I$.

Since $\mathbb{E}[X] \in I$, we can write as follows:

$$\begin{equation}
f(X) \ge f(\mathbb{E}[X]) + b(X - \mathbb{E}[X])
\end{equation}$$

By the linearity of expectation, 

$$\begin{equation}
\mathbb{E}[f(X)] \ge \mathbb{E}[f(\mathbb{E}[X]) + b(X - \mathbb{E}[X])] = f(\mathbb{E}[X])
\end{equation}$$