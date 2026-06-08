---
title: XVA
tags: [Mathematics, Financial Mathematics]
author: JWN
date: 2026. 05. 07.
---

# XVA

Black-Scholes Equation은 다음과 동치이다.
$$
\left\{ \begin{aligned} 
dV_t &= -dA_t + r V_t dt + Z_t dW_t^\mathbb Q \\
V_T &= 0
\end{aligned} \right.
$$

여기에 현실적인 조건들을 추가하여 다음과 같이 변형할 수 있다.

Let 
$$
f(t, V, C) := - \left[ (r_t^{f,l} - r_t)(V_t - C_t)^+ - (r_t^{f,b} - r_t)(V_t - C_t)^- + (r_t^{c,l} - r_t)C_t^+ - (r_t^{c,b} - r_t)C_t^- \right]
$$
where
* $r^{f,l}, r^{f,b}$ represent unsecured funding lending and borrowing rates;
* $r^{c,l}, r^{c,b}$ denote the interest on posted and received variation margin (collateral);
* $C^+$ and $C^-$ represent the posted and received variation margin/collateral and $C = C^+ - C^-$.

The $\mathbb G$-BSDE for the portfolio’s dynamics then has the form on $\{t < \tau\}$
$$
\left\{ \begin{aligned}
-dV_t &= dA_t + \bigl( f(t,V,C)-r_tV_t \bigr)\,dt - Z_t \,dW_t^\mathbb Q - \sum_{j\in\{B,C\}} U_t^j\,dM_t^{j,\mathbb Q}, \\
V_\tau &= \theta_\tau(\widehat V,C) := \widehat V_\tau + \mathbb 1_{\{\tau^C<\tau^B\}} (1-R^C) (\widehat V_\tau-C_{\tau^-})^- 
- \mathbb 1_{\{\tau^B<\tau^C\}} (1-R^B) (\widehat V_\tau-C_{\tau^-})^+
\end{aligned} \right. \tag{2.8}
$$
where $R^B$, $R^C$ are two positive constants representing the recovery rate of the bank and the counterparty, respectively.

기존의 Black-Scholes Equation에 비해 추가된 것들에 대해서 살펴보자.

1. $f(t,V,C) dt$

이상적인 상황과 비교했을 때, 현실에서는 실제 포트폴리오를 운용하면서 발생할 수 있는 손해와, 각종 위험요소들로 인해 옵션의 가격이 더 비싸질 수밖에 없다. 
$f(t,V,C) dt$는 포트폴리오를 실제로 운용하는 과정에서 발생하는 이상과 현실간의 차이를 반영하는 부분이다.

수식을 살펴보면, $f(t, V, C) dt$는 $dV_t$와 반대 부호를 가지고 있다. 이는 $f(t,V,C)$가 음수일 때 $V$가 증가한다는 의미이다.

포트폴리오를 운용하면서 발생하는 손해가 클수록 옵션의 가격은 비싸진다. 즉, $f(t, V, C)$는 포트폴리오를 운용하면서 발생하는 **손해**를 **마이너스 부호**로 반영한다.

은행은 포트폴리오 구성을 위해 실제 주식을 구매하는 대신, 레포 마켓을 통해 자금을 조달한다. 
레포 거래란 주식이나 채권을 담보로 돈을 빌려오는 거래를 의미하고, 이러한 거래가 이루어지는 시장을 레포 마켓이라고 한다.

레포 거래는 만기가 하루에서 길어야 2주인 초단기대출인 것이 특징이다. 은행은 레포 마켓에서 자금을 조달하고, 이 비용으로 포트폴리오를 구성한다.
포트폴리오의 비율은 매일 변화하기 때문에, 매일 레포마켓에서 자금을 조달하고 포트폴리오를 조정하는 것이 반복된다.

만약 포트폴리오 상으로 보유해야 할 현금보다 담보로 받은 금액이 더 많다면($V_t - C_t < 0$), 넘치는 금액은 다른 사람들에게 빌려주고 이자를 받아내는데 사용할 수 있다.
이때 이상적인 이자율과 은행이 빌려주는 이자율이 서로 다르다면, 그만큼의 초과 수익(or 손해)이 발생할 수 있다. 이는 $f$에서 다음과 같은 항으로 표현된다.
$$
(r_t^{f, b} - r_t)(V_t - C_t)^-
$$

반대로 포트폴리오 상으로 보유해야 할 현금보다 담보로 받은 금액이 더 적다면($V_t - C_t > 0$), 부족한 금액을 레포 마켓에서 조달해야 한다.
이때에는 이상적인 이자율과 실제 이자율의 차이만큼 손해(or 수익)가 발생할 수 있다. 이는 $f$에서 다음과 같은 항으로 표현된다.
$$
-(r_t^{f, l} - r_t)(V_t - C_t)^+
$$
이전과 다르게 여기서는 빌릴 때의 이자($r_t^{f, l}$)가 더 크면 손해를 본다(음수).

$- (r_t^{c,l} - r_t)C_t^+ + (r_t^{c,b} - r_t)C_t^-$는 담보에 대한 이자에 대한 부분이다. 
$C_t$가 양수이면 은행(나)이 담보를 받은 것, 반대로 음수이면 내가 담보를 준 것이 된다.
담보를 줬다면 이자를 받아야 하고, 담보를 받았다면 이자를 줘야 한다.
이때 이자율의 차이에 따라 이상적인 값에 비해 이득 또는 손해를 볼 수 있다.

2. $\sum_{j\in\{B,C\}} U_t^j\,dM_t^{j,\mathbb Q}$

Bank 또는 Counterparty가 파산할 위험을 반영한 부분이다. 


3. $\theta_\tau(\widehat V,C)$

은행 입장에서, Counterparty가 파산하는 경우...

(중략)

---

Let $W^\mathbb{P} = (W_t^\mathbb{P})_{t \in [0,T]}$ be a $d$-dimensional Brownian motion on 
$(\Omega, \mathcal{G}, \mathbb{P})$ with associated natural filtration $\mathbb{F}$.

We denote by $\tau^B$, resp. by $\tau^C$, the _time of default_ of the bank, resp. of the counterparty 
and by $H_t^j := \mathbb{1}_{\{\tau^j \leq t\}}, j \in \{B,C\}$, the associated jump process.

Default times $\tau^B$ and $\tau^C$ are assumed to be exponentially distributed random variables with time-dependent intensity
$$\Gamma_t^j = \int_0^t \lambda_s^{j,\mathbb{P}} ds, j \in \{B, C\}, t \in [0, T],$$
where $\lambda^j$ are non-negative bounded $\mathbb{F}$-adapted processes. 

Let $\mathbb{H}^j = (\mathcal{H}_t^j)_{t \in [0,T]}, j \in \{B,C\}$, be the natural filtration of $H^B, H^C$, respectively. 
On $(\Omega, \mathcal{G}, \mathbb{P})$ we consider the filtration $\mathbb{G} = \mathbb{F} \lor \mathbb{H}$.

* $\mathbb F$는 Brownian motion에 의해 생성되는 filtration을 의미한다.
* $H^j_t$는 $\tau^j \le t$이면 1, 아니면 0을 반환하는 확률변수이다. 
그래서 $\sigma(H^j_t)$는 $\tau_j \le t$과 $\tau_j > t$, 그리고 빈 사건과 전체 사건으로 이루어진 $\sigma$-algebra이다.
* $\mathcal H^j_t = \sigma (H^j_s : s \le t)$이다. 쉽게 생각하면, $\mathcal H^j_t$는 $\tau^j$가 $t$보다 작은지 안작은지를 결정할 수 있는 상황(사건)들의 모임이다.
* 그래서 $\mathbb H^j$는 $j$가 파산하는 타이밍에 대한 정보들에 대한 filtration이라고 할 수 있다.
* $\mathbb H = \mathbb H^B \lor \mathbb H^C$이고 $\mathbb{G} = \mathbb{F} \lor \mathbb{H}$이므로 $\mathbb G$는 $[0, T]$ 동안 발생하는 Brownian motion과 
파산에 대한 filtration이라고 할 수 있다.

---

We consider the following $\mathbb{F}$-BSDE on $[0, T]$:
$$(2.10) \quad \left\{ \begin{aligned}
-d\overline{\text{XVA}}_t &= \bar{f}(t, \widehat{V}_t, \overline{\text{XVA}}_t) \, dt - \overline{Z}_t \, dW_t^\mathbb{Q}, \\
\overline{\text{XVA}}_T &= 0,
\end{aligned} \right.$$
where
$$\begin{aligned}
(2.11) \quad \bar{f}(t, \widehat{V}_t, \overline{\text{XVA}}_t) &:= -(1 - R^C) (\widehat{V}_t - C_t)^- \lambda_t^{C,\mathbb{Q}} \\
&\quad + (1 - R^B) (\widehat{V}_t - C_t)^+ \lambda_t^{B,\mathbb{Q}} \\
&\quad + (r_t^{f,l} - r_t) (\widehat{V}_t - \overline{\text{XVA}}_t - C_t)^+ - (r_t^{f,b} - r_t) (\widehat{V}_t - \overline{\text{XVA}}_t - C_t)^- \\
&\quad + (r_t^{c,l} - r_t) C_t^+ - (r_t^{c,b} - r_t) C_t^- - (r_t + \lambda_t^{C,\mathbb{Q}} + \lambda_t^{B,\mathbb{Q}}) \overline{\text{XVA}}_t.
\end{aligned}$$

---

## Theorem 3.16. 

Let $V_t := \hat{V}_t - XVA_t, t \in [0,T]$, on $\{\tau > t\}$, where $\hat{V}$ and $XVA$ are defined in (3.14) and (3.15), respectively. 
Then, under Assumptions 2.14 and 3.12, the triplet $(V, Z, U) \in \mathcal{S}^2(\mathbb{Q}) \times \mathcal{H}^{2,d}(\mathbb{Q}) \times \mathcal{H}_{\lambda}^{2,2}(\mathbb{Q})$ 
solves the $\mathbb{G}$-BSDE (3.10) with $\mathcal{V} = \hat{V}$, where $Z$ and $U$ are given by 
$$\begin{aligned}
(3.32) \quad Z_t^k &= \hat{Z}_t^k - \tilde{Z}_t^k, k = 1, \dots, d, \\
(3.33) \quad U_t^j &= -\tilde{U}_t^j, j \in \{B, C\}.
\end{aligned}$$

Moreover, the process $V$ satisfies (3.11).

* (3.14)는 Clean value의 solution으로, 논문에는 Expectation Form으로 적혀있다.
* (3.15)는 $XVA_t := -CVA_t + DVA_t + FVA_t + ColVA_t + MVA_t$인데, 위 (2.10)으로 구할 수 있음을 알고 있다고 치자.
* $\hat{Z}_t^k$는 clean value 수식에 포함된 $Z$이다. $\tilde{Z}_t^k$는 논문 (3.29)에서 등장하는데, 
(3.29)는 $\mathbb F$-BSDE로 XVA를 구했을 때 다시 $\mathbb G$-BSDE로 복구하는 내용이 적혀있다. 
$\tilde{U}_t^j$도 마찬가지로 (3.29)에서 등장한다.
* (3.10)은 위 (2.8) 식과 동일하다.
* 이 Theorem의 의미는 결국 $V_t := \hat{V}_t - XVA_t, t \in [0,T]$로 $V_t$를 구하면 (3.10)의 해를 구할 수 있다는 뜻이다.
clean value는 구하기가 어렵지 않으니, XVA를 구하는데 초점을 맞추면 되겠다.

---

흐름이 이렇게 되는게 자연스럽겠다.
* clean value가 있고, 보정된 value가 있음.
* $XVA_t := -CVA_t + DVA_t + FVA_t + ColVA_t + MVA_t$인데, 위 (2.10)의 solution임(PDE 표현 vs 기댓값 표현).
* $V_t := \hat{V}_t - XVA_t, t \in [0,T]$라 하면, 보정된 value $V_t$를 구할 수 있음.

---

Given the pre-default value process $\overline V$ such that $\overline V_t \mathbb 1_{\{t<\tau\}} = V_t \mathbb 1_{\{t<\tau\}}$, on $\{t < \tau\}$ the solution to (2.8) can be represented as
$$\overline{V}_t = \widehat{V}_t - \overline{\text{XVA}}_t$$

Moreover, defining the process $\tilde{r} = (\tilde{r}_t)_{t \in [0,T]}$ as $\tilde{r} := r + \lambda^{C,\mathbb{Q}} + \lambda^{B,\mathbb{Q}}$, it has been shown in Biagini et al. (2021, Corollary 3.17) that the process $\overline{\text{XVA}}$ admits the representation
$$
\begin{equation}
\overline{\text{XVA}}_t = -\overline{\text{CVA}}_t + \overline{\text{DVA}}_t + \overline{\text{FVA}}_t + \overline{\text{ColVA}}_t,
\end{equation}
$$
where
$$
\begin{align}
\overline{\text{CVA}}_t &:= B_t^{\tilde{r}} \mathbb{E}^{\mathbb{Q}} \left[ \left. (1 - R^C) \int_t^T \frac{1}{B_u^{\tilde{r}}} (\widehat{V}_u - C_u)^- \lambda_u^{C,\mathbb{Q}} \, du \right| \mathcal{F}_t \right], \\
\overline{\text{DVA}}_t &:= B_t^{\tilde{r}} \mathbb{E}^{\mathbb{Q}} \left[ \left. (1 - R^B) \int_t^T \frac{1}{B_u^{\tilde{r}}} (\widehat{V}_u - C_u)^+ \lambda_u^{B,\mathbb{Q}} \, du \right| \mathcal{F}_t \right], \\
\overline{\text{FVA}}_t &:= B_t^{\tilde{r}} \mathbb{E}^{\mathbb{Q}} \left[ \left. \int_t^T \frac{(r_u^{f,l} - r_u) (\widehat{V}_u - \overline{\text{XVA}}_u - C_u)^+}{B_u^{\tilde{r}}} \, du \right| \mathcal{F}_t \right] \nonumber \\
&\quad - B_t^{\tilde{r}} \mathbb{E}^{\mathbb{Q}} \left[ \left. \int_t^T \frac{(r_u^{f,b} - r_u) (\widehat{V}_u - \overline{\text{XVA}}_u - C_u)^-}{B_u^{\tilde{r}}} \, du \right| \mathcal{F}_t \right], \\
\overline{\text{ColVA}}_t &:= B_t^{\tilde{r}} \mathbb{E}^{\mathbb{Q}} \left[ \left. \int_t^T \frac{(r_u^{c,l} - r_u) C_u^+ - (r_u^{c,b} - r_u) C_u^-}{B_u^{\tilde{r}}} \, du \right| \mathcal{F}_t \right].
\end{align}
$$

이때 linear, non-recursive한 xVA들은 쉽게 계산이 가능하다. 그러나, FVA는 nonlinear, recursive한 expression을 가지고 있다. 따라서 일반적인 방식으로는 구하기가 굉장히 어렵다.
따라서, deep BSDE와 같은 방식이 요구된다.

# Linear, Non-recursive Terms

그렇다면 구하기 쉬운 놈들은 어떻게 구하는지를 살펴보자.

...

따라서 XVA를 구하는데 있어서 핵심 내용은 "FVA를 어떻게 구하는가?"가 되겠다.

# Reference

* Deep xVA solver; A neural network–based counterparty credit risk management framework.pdf
* A UNIFIED APPROACH TO XVA WITH CSA DISCOUNTING AND INITIAL MARGIN.pdf