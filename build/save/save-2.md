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