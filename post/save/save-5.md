---
title: Solving BSDE
tags: [Mathematics, BSDE]
author: JWN
date: 2026. 06. 09.
---

# Solving BSDE

## Euler Scheme

BSDE를 수치적으로 풀기 위해서는 가장 먼저 Discretization 작업이 수행되어야 한다. 다음과 같은 BSDE가 있다고 하자.
$$
\begin{align*}
    -dY_t = f(t, X_t, Y_t, Z_t) \, dt - Z_t \cdot dW_t,
\end{align*}
$$
where $Y_T = g(X_T)$.

이제 다음과 같은 partition of the time interval을 생각하자:
$\pi : 0 = t_0 < t_1 < \cdots < t_n = T$.

그러면 다음과 같이 discretized된 알고리즘에 대해 고려해볼 수 있다.
$$
\begin{align*}
    &Y_{t_n}^\pi = g(X_{t_n}^\pi), \\
    &Z_{t_{i-1}}^\pi = \frac 1 {\Delta_i^\pi} \mathbb E_{i-1}^\pi \left[ Y_{t_i}^\pi \Delta^\pi W_i \right], \\
    &Y_{t_{i-1}}^\pi = \mathbb E_{i-1}^\pi \left[ Y_{t_i}^\pi \right] + f(t_{i-1}, X_{t_{i-1}}^\pi, Y_{t_{i-1}}^\pi, Z_{t_{i-1}}^\pi) \Delta_i^\pi
\end{align*}
$$
where $\Delta_i^\pi = t_i - t_{i-1}$ and $\Delta^\pi W_i = W_{t_i} - W_{t_{i-1}}$, for $i = 1, 2, \cdots, n$.

BSDE에 Euler scheme을 적용한 형태가 왜 저렇게 되느냐 하는 부분을 간단하게 살펴보자.

먼저 식 $-dY_t = f(t, X_t, Y_t, Z_t) \, dt - Z_t$에 그대로 Euler scheme을 적용해보자. 그러면 다음과 같은 식을 자연스럽게 얻을 수 있다.
$$
Y_{t_i}^\pi - Y_{t_{i-1}}^\pi = -f(t_{i-1}, X_{t_{i-1}}^\pi, Y_{t_{i-1}}^\pi, Z_{t_{i-1}}^\pi)(t_i - t_{i-1}) + Z_{t_{i-1}}^\pi (W_{t_1} - W_{t_{i-1}}), \quad Y_{t_n}^\pi = g(X_{t_n}^\pi).
$$
그러나 이 식만 가지고는 $(Y, Z)$를 unique하게 결정할 수도 없고, ($W$에 의해 generated되는 filtration에 대해) adapted라는 보장도 없다. 대신, 간단하게 conditional expectation을 취하는 방식을 고려해볼 수 있다.
$$
\begin{align*}
    &Z_{t_{i-1}}^\pi = (t_i - t_{i-1})^{-1} \mathbb E \left[ Y_{t_i}^\pi (W_{t_i} - W_{t_{i-1}}) \, \Big| \, \mathcal F_{t_{i-1}} \right], \\
    &Y_{t_{i-1}}^\pi = \mathbb E \left[ Y_{t_i}^\pi \, \Big| \, \mathcal F_{t_{i-1}} \right] + f(t_{i-1}, X_{t_{i-1}}^\pi, Y_{t_{i-1}}^\pi, Z_{t_{i-1}}^\pi) (t_i - t_{i-1})
\end{align*}
$$
있는 그대로 conditional expectation을 씌우면 아래 $Y$에 대한 식을 얻을 수 있다. 양 변에 $(W_{t_i} - W_{t_{i-1}})$을 곱한 뒤에 conditional expectation을 씌우면 
$$
\mathbb E [(W_{t_i} - W_{t_{i-1}})^2 \, \Big| \, \mathcal F_{t_{i-1}}] 
= \mathbb E [(W_{t_i} - W_{t_{i-1}})^2] = \textrm{Var} (W_{t_i} - W_{t_{i-1}}) = t_i - t_{i-1}
$$
이므로 $Z$에 대한 식을 얻을 수 있다.

[논문 1](https://www.sciencedirect.com/science/article/pii/S0304414904000031)에서는 위와 같은 Euler scheme 기반의 BSDE discretization이 실제 해에 수렴함을 보인다.

## Monte Carlo

Conditional Expectation은 기본적으로 $x \mapsto \mathbb E [ \, \cdot \, \big| X = x]$인 함수로 볼 수 있다. 
이때 Conditional Expectation을 추정하는 Monte Carlo 기법에는 여러가지가 있다. 

다음과 같은 linear PDE에 대해서 생각해 보자.
$$
u_t + Lu + Vu + f = 0
$$
이 경우, Euler scheme은 다음과 같다.
$$
\begin{align*}
    &Y_{t_n}^\pi = g(X_{t_n}^\pi), \\
    &Z_{t_{i-1}}^\pi = \frac 1 {\Delta_i^\pi} \mathbb E_{i-1}^\pi \left[ Y_{t_i}^\pi \Delta^\pi W_i \right], \\
    &Y_{t_{i-1}}^\pi = \mathbb E_{i-1}^\pi \left[ Y_{t_i}^\pi \right] + (V(t_i, X_{t_i}^\pi)Y_{t_i}^\pi + f(t_i, X_{t_i}^\pi)) \Delta_i^\pi
\end{align*}
$$
이때에는 conditional expectation을 Monte Carlo로 근사하는 방법을 이용한다면 쉽게 계산이 가능하다. ([참고]())

그러나 semilinear PDE의 경우에는
$$
Y_{t_{i-1}}^\pi = \mathbb E_{i-1}^\pi \left[ Y_{t_i}^\pi \right] + f(t_{i-1}, X_{t_{i-1}}^\pi, Y_{t_{i-1}}^\pi, Z_{t_{i-1}}^\pi) \Delta_i^\pi
$$
와 같이 generator $f$ 안에 $Y_{t_{i-1}}^\pi$가 다시 등장하므로, 식이 implicit한 형태를 가지게 된다. 
따라서 conditional expectation을 계산해 낸다고 하더라도 $Y_{t_{i-1}}^\pi$를 구하는데 어려움이 존재한다.

[논문 2]()에서는 이를 해결하기 위해 $f$ 안에 포함된 $Y_{t_{i-1}}^\pi$를 한 step 이후의 값인 $Y_{t_i}^\pi$로 대체하여 explicit scheme을 구성하였다. 그리고 **Theorem x.x**에서, conditional expectation을 충분히 정확하게 근사할 수 있다면 explicit scheme을 통해 얻은 값 역시 실제 BSDE의 solution에 수렴함을 보였다?

그러나 ...

terminal condition에서 시작하여 backward direction으로 step-by-step 계산을 수행하므로, 각 단계에서 발생한 approximation error가 반복적으로 누적될 수 있다. 

이러한 이유로 nonlinear BSDE 및 semilinear PDE를 Monte Carlo 기반 방법으로 안정적으로 계산하는 것은 linear PDE의 경우보다 훨씬 어려운 문제가 된다.

또한 Monte Carlo 기반 방법은 conditional expectation에 대한 반복적인 regression 및 function approximation을 필요로 하므로, PDE가 linear인지 여부와 관계없이 고차원 환경에서는 수치적인 어려움이 발생할 수 있다.

# Reference

* [1] Discrete-time approximation and Monte-Carlo simulation of backward stochastic differential equations
* [2] tlqkf