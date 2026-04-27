---
title: 
categories: [Mathematics, Financial Mathematics]
author: JWN
date: 2026. 04. 22.
---

# Black-Scholes Equation

지난 시간에는 옵션이 무엇인지에 대한 내용까지 알아보았다.
그래서 결국에는 "옵션의 가격을 어떻게 정해야 하는가"를 알고 싶은 것이었다.
그리고 Black-Scholes 방정식은 이 질문에 대한 해결 방법을 수학적으로 제시한다.

Black-Scholes 방정식은 다음과 같은 형태의 PDE이다.
$$
\begin{cases}
    \frac{\partial V}{\partial t} + \frac 1 2 \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} + r S \frac {\partial V}{\partial S} - rV = 0 \\
    V(T, s) = K(s) \quad \forall s
\end{cases}
$$

지금부터 이 식의 의미를 하나씩 파악해 보자.

## Stock Price

주식의 가격을 $S$라고 하면, 다음을 가정한다.
$$
d S = \mu S \, dt + \sigma S \, dW
$$
or equivalently, 
$$
S_t = S_0 + \int_0^t \mu S \, dt + \int_0^t \sigma S \, dW
$$
이를 주식의 가격이 'geometric Brownian motion을 따른다'라고 한다.

$\mu$와 $\sigma$는 각각 drift와 volatility라고 부르고, 고정된 상수 값으로 제시된다.

## Derivation

그래서 다시 Black-Scholes 방정식을 살펴보자.
$$
\begin{cases}
    \frac{\partial V}{\partial t} + \frac 1 2 \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} + r S \frac {\partial V}{\partial S} - rV = 0 \\
    V(T, s) = K(s) \quad \forall s
\end{cases}
$$

이때 $V$는 옵션의 가격을, $S$는 주식의 가격을 의미한다. 그리고 $\mu$와 $\sigma$는 주식의 가격을 모델링했을 때 GBM에서 등장했던 drift와 volatility이다.
$K(s)$는 옵션의 만기 조건이다. 예를 들어 '한 달 뒤에 주식 1개를 100만원에 살 권리'를 5만원에 사는 상황을 생각해 보자. 
만약 한 달 뒤에 주식이 100만원보다 올라서 120만원이 됐다면, 나는 이 옵션의 권리를 행사해서 120만원 가치의 주식을 100만원에 얻을 수 있다.
즉, 옵션의 권리를 행사해서 20만원의 추가적인 이득을 얻을 수 있다. 이때 옵션은 20만원의 가치를 가진다고 볼 수 있다.
반대로 만약 한 달 뒤에 주식의 가격이 100만원 아래로 떨어졌다면, 옵션을 행사하지 않는 것이 이득이다. 이때 옵션의 가치는 0원이라고 할 수 있다.

그래서 (European call option에서) 만기 시점에 옵션의 가치는 다음과 같이 결정된다.
$$
V(T, S) = \max(S-K, 0)
$$
$T$가 만기 시점, $S$는 주식의 가격, $K$는 옵션에서 제시하는 가격을 의미한다.

따라서 Black-Scholes Equation은, 만기 시점에서 옵션의 가치가 boundary condition으로 주어진 terminal value problem이라고 할 수 있다.
이 방정식을 어떻게 풀어내느냐는 조금 이따가 보기로 하고, 일단은 이 PDE가 어떻게 등장했는가부터 살펴보자.

$V(t, S)$에서 $S$는 미분이 불가능한 GBM을 따르므로, Itô's lemma에 의해 다음과 같이 쓸 수 있다.
$$
dV = \frac{\partial V}{\partial t}(t,S_t)\,dt + \frac{\partial V}{\partial S}(t,S_t)\,dS_t + \frac{1}{2}\frac{\partial^2 V}{\partial S^2}(t,S_t)\,(dS_t)^2
$$

여기서
$$
dS_t = \mu S_t\,dt + \sigma S_t\,dW_t
$$

이므로 It\^o 계산규칙
$$
(dW_t)^2 = dt,\quad dt\,dW_t = 0,\quad (dt)^2 = 0
$$

을 이용하면
$$
(dS_t)^2 = \sigma^2 S_t^2\,dt
$$

따라서
$$
dV
=
\left(
\frac{\partial V}{\partial t}
+
\mu S_t \frac{\partial V}{\partial S}
+
\frac{1}{2}\sigma^2 S_t^2 \frac{\partial^2 V}{\partial S^2}
\right)dt
+
\sigma S_t \frac{\partial V}{\partial S}\,dW_t
$$

