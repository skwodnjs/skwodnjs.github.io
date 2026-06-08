---
title: Deep BSDE
tags: [Mathematics, BSDE]
author: JWN
date: 2026. 06. 09.
---

# Deep BSDE

다음과 같은 형태의 Semilinear Parabolic PDE를 생각하자.
$$
\begin{align*}
    \frac{\partial u}{\partial t}(t,x) &+ \frac{1}{2}\mathrm{Tr}\left(\sigma\sigma^{\mathrm{T}}(t,x)(\mathrm{Hess}_x u)(t,x)\right) \\
    &+ \nabla u(t,x)\cdot\mu(t,x) + f\left(t,x,u(t,x),\sigma^{\mathrm{T}}(t,x)\nabla u(t,x)\right) = 0
\end{align*}
$$

deep neural network를 이용하여 위와 같은 형태의 PDE를 푸는 방식은 [논문 1](https://www.pnas.org/doi/abs/10.1073/pnas.1718942115)에서 처음으로 제안되었다. 이 방식은 위 PDE와 BSDE의 관계를 이용하였기 때문에 deep BSDE라고 부른다([참고]()). 이후 [논문 2](https://www.ams.org/mcom/0000-000-00/S0025-5718-2020-03514-5/)에서는 deep BSDE의 발전된 형태인 DBDP(Deep Backward Dynamic Programming)를 제안하고 그 수렴성에 대해 증명하였다.

Deep BSDE와 PINN을 연결하려는 연구([논문 3](https://arxiv.org/abs/2506.20308))도 진행된 바 있다. 

2026년 2월에 accepted된 [논문 4](https://arxiv.org/abs/2502.06238)에서는 deep BSDE 내의 FNN 구조를 XNet이라는 새로운 구조로 바꾸었고, 그 결과 계산 비용은 크게 줄이면서도 더 강한 approximation 성능을 확보하였다.

[논문 5](https://epubs.siam.org/doi/abs/10.1137/21M1457606)과 [논문 6](https://arxiv.org/abs/2502.14766)에서는 XVA를 계산하기 위해 Deep BSDE를 활용하는 방식을 제안한다.

# Reference

* [1] Solving High-Dimensional Partial Differential Equations Using Deep Learning
* [2] Deep backward schemes for high-dimensional nonlinear PDEs
* [3] Deep random difference method for high-dimensional quasilinear parabolic partial differential equations
* [4] XNet-Enhanced Deep BSDE Method and Numerical Analysis
* [5] Deep xVA solver: A neural network–based counterparty credit risk management framework
* [6] Multi-Layer Deep xVA: Structural Credit Models, Measure Changes and Convergence Analysis