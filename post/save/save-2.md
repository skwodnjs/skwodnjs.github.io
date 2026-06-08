---
title: Least Square Monte Carlo & Black-Scholes Equation
tags: [Mathematics, Short]
author: JWN
date: 2026. 05. 20.
---

# Least Square Monte Carlo

설명.

# Example: Solving Black-Scholes Equation

Black-Scholes Equation은 다음과 같다.
$$
\dfrac{\partial V}{\partial t} + rS \dfrac{\partial V}{\partial S} + \frac 1 2 \sigma^2 S^2 \dfrac{\partial^2 V}{\partial S^2} - rV = 0
$$
with $V(T, S) = g(S)$.

이는 linear PDE의 형태이고, BSDE 형태로 바꾸어 Euler scheme을 적용하여 다음과 같이 쓸 수 있다.
$$
\begin{align*}
    &Y_{t_n}^\pi = g(S_{t_n}^\pi), \\
    &Z_{t_{i-1}}^\pi = \frac 1 {\Delta_i^\pi} \mathbb E_{i-1}^\pi \left[ Y_{t_i}^\pi \Delta^\pi W_i \right], \\
    &Y_{t_{i-1}}^\pi = \mathbb E_{i-1}^\pi \left[ Y_{t_i}^\pi \right] - ( r Y_{t_{i-1}}^\pi ) \Delta_i^\pi
\end{align*}
$$
만약 risk-free rate $r$이 시간에 의존하는 경우 $r_{t_{t-1}}$을 사용할 수 있다.

