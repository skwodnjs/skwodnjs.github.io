---
title: 시간 보정 항 $e^{rt}$
tags: [Mathematics, Financial Mathematics]
author: JWN
date: 2026. 05. 02.
---

# Risk-free Asset

연 이자율 3%를 1년에 한 번 지급하는 경우, 10년 뒤에는
$$
B_0 \times (1.03)^{10}
$$
원이 되어 있을 것이다. 만약 비슷하게 연 3%의 이자율을 네 번에 나눠서 주는 경우를 생각해 보자.
이때에는 한 번 지급할 때마다 $(1 + \frac{0.03}{4})$배의 이자가 $10 \times 4$번 지급될 것이다.
이 경우에는 1년에 한번 지급할 때보다 조금 더 이득이다. 왜냐하면 이자를 더 자주 받게 되고 이자에 대한 이자가 더 쌓이기 때문이다.
연 이자율 $r$%를 1년에 $n$번 지급하는 경우, $t$년 뒤에는
$$
B_0 \times (1 + \frac r n)^{nt}
$$
원이 되어 있을 것이다. $n$을 무한히 늘려 연속적으로 지급하는 상황을 가정하면,
$$
B_t = B_0 e^{rt}
$$
가 된다. 

보통 무위험 자산을 다음과 같은 형태로 표현한다.
$$
dB_t = rB_tdt
$$
Solution의 형태는 앞서 본 형태와 같다.
$$
B_t = B_0 e^{rt}
$$
이는 단위 시간동안 $r$%의 이자율이 매 순간 연속적으로 나누어 지급되는 상황을 가정한 것이다. $t$의 단위에 따라서 연 이자율은 아닐 수 있다.

# Risky Asset

만약 $S_t$가 다음을 만족한다면,
$$
dS_t = rS_tdt + \sigma S_t dW_t
$$
$\tilde S_t = e^{-rt} S_t$로 정의하면 $\tilde S_t$는 다음을 만족한다.
$$
\begin{align*}
    d\tilde S_t &= e^{rt}(-rS_tdt + dS_t) \\
    &= e^{rt}(-rS_tdt + rS_tdt + \sigma S_t dW_t) \\
    &= \sigma \tilde S_t dW_t
\end{align*}
$$