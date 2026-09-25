---
title: infimum과 minimum, supremum과 maximum
category: mathematics
author: JWN
date: 2026. 09. 25.
---

# infimum과 minimum, supremum과 maximum

## Definition

부분순서집합 $(P, \leq)$와 부분집합 $A \subseteq P$를 생각하자.

어떤 $l \in P$가 모든 $a \in A$에 대해

$$
	l \leq a
$$

를 만족하면 $l$을 $A$의 lower bound라고 한다. $A$의 lower bound 중 가장 큰 원소를 **infimum**이라 하고,

$$
	\inf A
$$

로 나타낸다. 즉, $\inf A$는

$$
	\inf A \leq a \qquad \text{for all } a \in A
$$

를 만족하고, 임의의 lower bound $l$에 대해

$$
	l \leq \inf A
$$

가 성립한다.

반면 $A$에 속하는 원소 중 가장 작은 원소를 **minimum**이라 하고,

$$
	\min A
$$

로 나타낸다. 즉, $m = \min A$라면

$$
	m \in A, \qquad m \leq a \qquad \text{for all } a \in A
$$

이다.

마찬가지로 어떤 $u \in P$가 모든 $a \in A$에 대해

$$
	a \leq u
$$

를 만족하면 $u$를 $A$의 upper bound라고 한다. $A$의 upper bound 중 가장 작은 원소를 **supremum**이라 하고

$$
	\sup A
$$

로 나타낸다. $A$에 속하는 원소 중 가장 큰 원소는 **maximum**이라 하고

$$
	\max A
$$

로 나타낸다.

## Infimum과 minimum

$\inf A$가 정의되어 있다고 하자. 그러면

$$
	\exists m \in A \text{ such that } m = \min A \iff \inf A \in A
$$

이고, 이 경우

$$
	\min A = \inf A
$$

가 성립한다.

### Proof

먼저 $m = \min A$인 $m \in A$가 있다고 하자. 그러면

$$
	m \leq a \qquad \text{for all } a \in A
$$

이므로 $m$은 $A$의 lower bound다. $\inf A$는 모든 lower bound 중 가장 큰 원소이므로

$$
	m \leq \inf A
$$

이다.

한편 $\inf A$는 $A$의 lower bound이고 $m \in A$이므로

$$
	\inf A \leq m
$$

이다. 따라서

$$
	m = \inf A
$$

이고, 특히 $\inf A \in A$이다.

반대로 $\inf A \in A$라고 하자. $\inf A$는 lower bound이므로

$$
	\inf A \leq a \qquad \text{for all } a \in A
$$

이다. 따라서 $\inf A$는 $A$에 속하면서 모든 원소보다 작거나 같으므로

$$
	\min A = \inf A
$$

이다.

## Supremum과 maximum

같은 논리를 반대 순서에 적용하면

$$
	\exists M \in A \text{ such that } M = \max A \iff \sup A \in A
$$

이고, 이 경우

$$
	\max A = \sup A
$$

가 성립한다.

즉, $\inf A$와 $\sup A$는 $A$의 원소일 필요가 없지만, $\min A$와 $\max A$는 반드시 $A$의 원소다.

## Example

$$
	A = [0,1]
$$

을 생각하자. $0$은 $A$의 greatest lower bound이고 $0 \in A$이므로

$$
	\inf A = \min A = 0
$$

이다. 마찬가지로 $1$은 $A$의 least upper bound이고 $1 \in A$이므로

$$
	\sup A = \max A = 1
$$

이다.

반대로

$$
	B = (0,1)
$$

에서는

$$
	\inf B = 0, \qquad \sup B = 1
$$

이지만

$$
	0 \notin B, \qquad 1 \notin B
$$

이다. 따라서 $B$에는 minimum과 maximum이 없다.