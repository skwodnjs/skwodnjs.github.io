---
title: Vector Space
categories: [Mathematics, Long, Linear Algebra]
author: JWN
date: 2026. 02. 18.
---

<small>* 이 글은 책 "Linear algebra Stephen H. Friedberg, Arnold J. Insel, Lawrence E. Spence"를 참고하여 작성되었습니다.</small>

# Vector Space

## Vector

벡터는 "크기"와 "방향"을 가진 물리량을 의미한다. 그런데 수학에서는 이 물리량의 주요한 수학적 특징인 더하기(평행사변형의 법칙)와 
스칼라곱에 주목하여, 벡터 공간과 벡터를 아래와 같이 일반화한다.

## Vector Space

> Definition.

$V$: a set, $F$: a field.

$V$ is a vector space over the field $F$ <br>
if there exist two operations
$+: V \times V \to V$ (vector addition) and
$\cdot: F \times V \to V$ (scalar multiplication, often omitted in notation),
such that the following axioms hold.

* (VS 1) For all $x, y$ in $V$, $x + y = y + x$ (commutativity of addition).
* (VS 2) For all $x, y, z$ in $V$, $(x + y) + z = x + (y + z)$ (associativity of addition).
* (VS 3) There exists an element in $V$ denoted by $0$ such that $x + 0 = x$ for each $x$ in $V$.
* (VS 4) For each element $x$ in $V$ there exists an element $y$ in $V$ such that $x + y = 0$.
* (VS 5) For each element $x$ in $V$, $1x = x$.
* (VS 6) For each pair of elements $a, b$ in $F$ and each element $x$ in $V$, $(ab)x = a(bx)$.
* (VS 7) For each element $a$ in $F$ and each pair of elements $x, y$ in $V$, $a(x + y) = ax + ay$.
* (VS 8) For each pair of elements $a, b$ in $F$ and each element $x$ in $V$, $(a + b)x = ax + bx$.

The elements of the field F are called **scalars** and the elements of the vector space V are called **vectors**. 

---

더하기와 스칼라곱이 적당히 정의된 공간을 벡터공간이라 부르고, 벡터공간에 속한 element들을 벡터라고 부르기로 한다.

벡터의 더하기와 스칼라곱이 위와 같이 적당히 정의되고 나면, 아래와 같은 연산에 대해서도 생각해볼 수 있다.

> Theorem 1.1 (Cancellation Law for Vector Addition).

$V$: vector space, $x, y, z\in V$. If $x + z = y + z$, then $x = y$.

> Proof.

By (VS 4), $\exists v \in V$ suth that $z + v = 0$.

$$ x = x + 0 = x + (z + v) = (x + z) + v = (y + z) + v = y + (z + v) = y + 0 = y $$

---

> Theorem 1.2.

$V$: vector space. Then,
1. $0x = 0$ for all $x \in V$.
2. $(-a)x = -(ax) = a(-x)$ for all $a \in F$, $v \in V$.
3. $a0 = 0$ for all $a \in F$.

> Proof.

1. $0x + 0x = (0 + 0)x = 0x = 0 + 0x$, $0x = 0$, 3번도 유사하게 증명 가능.
2. $(-a)x + ax = (-a + a) x = 0x = 0$, $a(-x) + ax = a(-x + x) = a0 = 0$. Note that the additive inverse is unique.

## Subspace

> Definition.

A subset $W$ of a vector space $V$ over a field $F$ is called a
subspace of $V$ if $W$ is a vector space over $F$ with the operations of addition
and scalar multiplication defined on $V$.

---

벡터공간 $V$와 그 부분집합 $W$에 대해, $V$와 동일한 스칼라와 더하기, 스칼라곱 연산을 사용했을 때 $W$가 자연스럽게 벡터공간이 된다면 
$W$를 부분공간이라고 한다. 벡터공간 $V$의 임의의 부분집합이 부분공간이 되려면, 정의에 따라 다음 사실이 만족되어야 한다.

1. $x + y \in W$ whenever $x \in W$ and $y \in W$. (W is **closed under addition**.)
2. $cx \in W$ whenever $c \in F$ and $x \in W$. (W is **closed under scalar multiplication**.)
3. $W$ has a zero vector.
4. Each vector in $W$ has an additive inverse in $W$.

그런데 1~3 조건만 확인하면, 4번 조건은 확인하지 않아도 된다는 사실을 증명할 수 있다.

> Theorem 1.3.

$V$: vector space, $W \subset V$. 

Then $W$ is a subspace of $V$ if and only if the following three conditions hold 
for the operations defined in $V$.
1. $0 \in W$.
2. $x + y \in W$ whenever $x \in W$ and $y \in W$.
3. $cx \in W$ whenever $c \in F$ and $x \in W$.

> Proof.

모든 $x \in W$에 대해, additive inverse가 $W$ 안에 존재하는지만 확인하면 된다. $W$가 스칼라곱에 대해 닫혀으므로, 
$-x \in W$이고, $x - x = 1x + (-1)x = (1 - 1) x = 0x = 0$이므로, $x$의 additive inverse가 $W$ 안에 
들어있다는 사실을 확인할 수 있다.

---

$m \times n$ matrix $A$에 대해, $A^\top$은 대각선 성분을 유지한 채 대칭시키는 연산이다. 즉, $A^\top$은 $m \times n$ 
행렬이고, $A_{ij} = A^\top_{ji}$이다.

만약 $A^\top = A$이면, $A$를 **symmetric matrix**라고 부른다. symmetric matrix들의 집합은 $M_{n \times n} (F)$의 subspace이다.

만약 $A^\top = -A$이면, $A$를 **skew-symmetric**이라고 부른다. skew-symmetric matrix들의 집합도 역시 $M_{n \times n} (F)$의 subspace이다.

대각 성분을 제외한 element가 0인 행렬을 diagonal matrix라고 부른다. diagonal matrix들의 집합도 $M_{n \times n} (F)$의 subspace이다.

## Linear Combination

> Definition.

$V$: vector space. $S$: nonempty subset of $V$.

$v \in V$ is a **linear combination** of vectors of $S$ if 
$$ v = a_1 u_1 + \cdots + a_n u_n $$
for some $u_1, \cdots, u_n \in S$ and $a_1, \cdots, a_n \in F$.

---

> Definition.

$V$: vector space. $S$: nonempty subset of $V$.

$span(S)$ is the set consisting of all linear combinations of the vectors in $S$.

For convenience, we define $span(\emptyset) = \{ 0 \} $.

---

> Theorem 1.5

The span of any subset $S$ of a vector space $V$ is a subspace of $V$. Moreover, any subspace of $V$ that contains $S$ 
must also contain the span of $S$.

> Proof.

$V$가 더하기와 스칼라곱에 대해 닫혀있기 때문에, $span(S)$ $\subset V$이다. 그리고 $span(S)$가 더하기와 스칼라곱에 대해 닫혀있고, 
0을 포함한다는 사실도 쉽게 알 수 있다. 따라서 $span(S)$는 $V$의 subspace이다.

만약 $W$가 $S$를 포함하는 subspace라면, $W$는 더하기와 스칼라곱에 대해 닫혀있기 때문에, $S \subset W$에 대해 $span(S) \subset W$이어야 한다.

---

Theorem 1.5를 통해 알 수 있는 사실은, 벡터공간 $V$와 부분집합 $S$가 있을 때, 1) $span(S) \subset V$이고, 2) $span(S)$는 $V$의 subspace이며, 3) $span(S)$는 $S$를 포함하는 
$V$의 subspace 중에서 가장 작은 subspace라는 것이다.

## Linear dependence

> Definition.

$V$: vector space, $S \subset V$.

$S$ is **linearly dependent** if there exist a finite number of distinct vectors $u_1, u_2, \cdots, u_n$ in $S$ and scalars
$a_1, a_2, \cdots, a_n$, not all zero, such that
$$ a_1 u_1 + a_2 u_2 + \cdot + a_n u_n = 0 . $$
In this case we also say that the vectors of $S$ are linearly dependent.

---

$S$가 infinite subset이어도 정의상 문제가 없다. 그리고 만약 $S$가 linearly dependent가 아니라면, 우리는 $S$를 **linearly independent**라고 부른다.

우리는 부분공간에 대해 배웠고, $span(S)$가 부분공간이 된다는 사실도 배웠다. 이제 우리는, $W$가 $V$의 subspace이고 $S$가 $W$를 generate할 때, 과연 $S$가
$W$를 generate 하기에 최선인가? 하는 것이 궁금하다. 즉, $W$를 만들어주는 최대한 작은 $S$를 찾고 싶은 것이다.

> Theorem 1.7.

$S$: linearly independent subset of a vector space $V$, $v \in V$ and $v \notin S$.

Then, $S \cup \{ v \}$ is linearly dependent if and only if $v \in span(S)$.