---
title: save 1
tags: [empty]
author: JWN
date: 2026. 06. 04.
---

Deep BSDE는 고차원으로 갈수록 Control을 잘 학습하지 못한다. Option Hedge 관점에서, Hedging Stratege 에 대한 정보를 제대로 제공해주지 못한다.

Q. 근데 실무적인 관점에서, 고차원 Option Hedging이 필요한가? 어느 정도까지의 고차원을 필요로 하는가?

근데 고차원에서도 Y는 비교적 정확하게 계산해낸다. 특히 고차원에서, control이 달라도 유사한 Y를 만들어낼 수 있어서 그렇지 않을까 함.
근데 Hedging 에서, truncation cost가 있는 경우 등 Y를 잘 맞춘다고 하더라도 Z가 많이 달라지면 문제가 생길 수도 있다.

# Goal

* 정확한 Control 학습
* 현실적인 조건 추가
* Incomplete market

IDEA: Deep BSDE(또는 다른 더 좋은 방법)로 Y를 구한 뒤, 이 Y를 가지고 Hedging Portfolio를 다시 계산한다.
1. Y를 계산하는 단계부터 현실적인 여러 조건을 고려해야 할까?
2. 아니면 Hedging Portfolio 계산 단계에서 truncation cost 등을 추가로 고려해서 실제 hedging 전략을 얻어내야 할까?

Y에 대한 Z는 이미 알고 있지만, 문제는
1. 이 Z가 Exact solution과 차이가 많이 날 수 있다 = 더 좋은 Y를 만드는 Z가 존재할 수 있다.
2. 만약 control이 불안정할 경우, 예를 들면 어떤 한 차원에서 Z가 엄청나게 큰 값을 가지는 경우가 생길 수도 있지 않을까? 그러면 hedging 관점에서 비현실적인 hedging 전략이 나올 수도 있지 않을까?

근데 '더 좋은'에 대해서 생각해 볼 필요가 있음. Portfolio 관점에서는 위험을 좀 감수하고서라도 어느 정도 허용할 수 있는 위험 하에서 수익을 최대화하는게 목적이라면,
hedging은 위험 요소를 완전히 줄여서 payoff 를 복제하는 것이 목적임.

근데 BSDE에서 Y의 path가 결정되면, 그에 대응되는 Z는 unique하다. 그러면 Z를 꼭 개선해야 할까? 그냥 Z대로 Hedging하면 안되나?

그러면 이건 어때? Y는 그냥 구하고, Z를 구할 때 제약조건을 넣는거임. 한번에 많이 사면 안된다 등. 근데 그러면 Y 자체를 못따라갈 수도 있지 않을까?

실제로 incomplete market에서도 그걸 인정하고 payoff를 비슷하게나마 추종하는 식으로 hedging을 진행함. 그런 의미에서, payoff 를 따라가는걸 목표로 하는게 아니라 solution Y를 따라가는걸 목표로 바꾼다면 더 좋은 결과가 나올 수도 있을까?

근데 애초에 Y를 따라갈 필요가 없음. 우리는 그냥 payoff를 완전히 복제하는 포트폴리오가 필요한거니까.

고차원 or nonlinear 같이 못푸는 상황에서, Z가 exact solution이랑은 차이가 많이 난다고 해도 그렇게 control을 하는게 현실적으로 가능하고 Y도 잘 만들어준다면 사실 상관없는거 아님?
다른 control 들과 비교하는게 필요할지도.

만약 그렇다면, 그니까 Z를 꼭 정확하게 맞추는게 필요 없다고 한다면, 어떤 것에 초점을 맞춰야 할까?

근데 BSDE에서 Z에 constraint를 주기는 쉽지 않을 것 같은데. 

XVA에서는 더이상 Z가 hedging stratege 를 의미하지 않는다. 아마도? 그러면 이때는 Y를 만들어놓고 hedging 전략을 찾는게 의미가 있을 수도 있다.
ㅊ
그리고 XVA 컨셉 자체가 현실성있는 조건들을 추가해서 option 가격을 조정하자는 의미인데, 이때 거래량 같은것도 고려해서 option pricing 에 추가할 수 있을지 고민해보는 것도 좋겠다.

현실적으로는
1. 주식을 한번에 너무 많이 사고 팔 수 없다.(거래량 제한)
2. 한번에 너무 많은 규모의 주식을 사고 팔면 주식 가격 자체에 영향을 줄 수 있다.
3. 거래 수수료가 존재한다
정도가 문제가 될 수 있겠다.

loss 에 Z 관련 제약조건을 추가하는 방식도 고려해볼 만 할 것 같다.
예를 들어, 거래량 제한 관련 조건을 loss 에 추가하는 식으로. 대신 이러면 완전하게 제약조건을 만족하기를 기대하기는 어려울 수 있다.

또는 공매도 제한 조건을 위해 network output을 양수로 만들어버릴 수도 있겠다. (활성화 함수에 softplus 사용 등.)

아니면 NN 가 Y를 생성하게 한 다음 Z를 미분값으로 출력하는 방식도 생각해볼 수 있겠다. 이러면 관계식을 통해 Z를 만들어내니까 Z의 학습에 유리할 수 있지 않을까?

이미 있네. 

1. 기존 Deep BSDE
2. Local DBSDE (Y만 NN, Z=AD) : [논문](https://arxiv.org/pdf/1804.07010)
3. Y,Z,Γ 각각 NN : [논문](https://arxiv.org/abs/2408.05620?utm_source=chatgpt.com)
4. Y만 NN + Z consistency loss