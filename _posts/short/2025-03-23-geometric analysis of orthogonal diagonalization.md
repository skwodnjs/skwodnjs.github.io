---
title: Geometric Analysis of Orthogonal Diagonalization
author: skwodnjs
date: 2025-03-23 12:44:00 +0900
categories: [단편소설]
tags: []
math: true
---

## 선형변환과 행렬

### 선형변환

definition
{: .subheading}

$T: V \to W$ is a linear transformation if \\
$$\begin{align}
    & T(au) = a \ T(u) \\
    & T(u + v) = T(u) + T(v)
\end{align}$$ \\
for all $a \in \mathbb R$, $u, v \in V$.
{: .text-box}

### 선형변환과 행렬

모든 Linear transformation $T: \mathbb R^n \to \mathbb R^m$은 matrix $A \in R^{m \times n}$ 에 대해 다음과 같이 표현될 수 있다.
$$\begin{equation}
    T(x) = Ax
\end{equation}$$

proof
{: .subheading}

Let $e_i \in \mathbb{R}^n$: $i$th element 만 1이고 나머지가 모두 0인 벡터. \\
Then for all $x = (x_1, \cdots, x_n) \in \mathbb R ^n$, \\
$$\begin{equation}
    x = \sum_{i = 1}^n x_i e_i.
\end{equation}$$ \\
따라서 다음이 성립한다. \\
$$\begin{equation}
    T(x) = T\left(\sum_{i = 1}^n x_i e_i\right) = \sum_{i = 1}^n x_i T(e_i).
\end{equation}$$ \\
Note that $T(e_i) \in \mathbb R ^m$. \\
Let $A_{ij} = T(e_i)_j$. Then $A \in \mathbb R^{m \times n}$, and \\
$$\begin{equation}
    Ax = T(e_1)x_1 + \cdots + T(e_n) x_n = \sum_{i = 1}^n x_i T(e_i) = T(x).
\end{equation}$$
{: .text-box}

위 증명을 통해 $A$의 형태를 특정할 수 있다. \\
즉, 하나의 Linear transformation에 대해 unique한 matrix을 찾을 수 있다.

반대로 임의의 matrix $A \in \mathbb R^{n \times m}$에 대해, 
다음과 같이 정의되는 함수 $T: \mathbb R^m \to \mathbb R^n$은 linear transformation이다. \\
$$\begin{equation}
    T(x) = Ax
\end{equation}$$

proof
{: .subheading}

Homogeneity: $T(ax) = A(ax) = a(Ax)$ for all $a \in \mathbb R$. \\
Additivity: $T(x + y) = A(x + y) = Ax + Ay$ for all $x, y \in \mathbb R^m$.
{: .text-box}

[Link](link)
<!-- 행렬의 연산(뭐가 되고, 뭐가 안되고) -->

따라서, 모든 matrix $A \in \mathbb R^{n \times m}$과 linear transformation $T: \mathbb R^m \to \mathbb R^n$은 1대1로 대응시킬 수 있다.

## 선형변환의 예시

### 대각행렬

definition
{: .subheading}

A matrix $D$ is a diagonal matrix if $D_{ij} = 0$ if $i \neq j$.
{: .text-box}

대각행렬 $A$에 대해, linear transformation $T: \mathbb R^n \to \mathbb R^n$ such that $T(x) = Ax$에 대해 생각해보자.

$$\begin{equation}
    A = \rm diag (a_1, \cdots, a_n) = \begin{bmatrix}
        a_1 & 0   & \cdots & 0 \\
        0   & a_2 & \cdots & 0 \\
        \vdots & \vdots & \ddots & \vdots \\
        0 & 0 & \cdots & a_n
    \end{bmatrix}
\end{equation}$$ \\
라 하면 \\
$$\begin{equation}
    Ax = \begin{bmatrix}
        a_1 & 0   & \cdots & 0 \\
        0   & a_2 & \cdots & 0 \\
        \vdots & \vdots & \ddots & \vdots \\
        0 & 0 & \cdots & a_n
    \end{bmatrix} \ \begin{pmatrix}
        x_1 \\ \vdots \\ x_n
    \end{pmatrix} = (a_1 x_1, \cdots, a_n x_n)^ \top.
\end{equation}$$

이는 원래의 벡터 $(x_1, \cdots, x_n)$을 확대/축소$(a_i \ge 0)$ 또는 대칭$(a_i<0)$시키는 선형변환이라고 할 수 있다.

### 직교행렬

definition
{: .subheading}

A square matrix $Q \in \mathbb{R}^{n \times n}$ is an orthogonal matrix if $Q^\top Q = I$.
{: .text-box}
$I \in \mathbb{R}^{n \times n}$는 Identity matrix이다.

직교행렬이려면 정사각행렬이어야 한다.

직교행렬 $Q \in \mathbb R^{n \times n}$의 column vector들을 각각 $q_1, \cdots, q_n \in \mathbb R^n$이라 하자. \\
이 때, \\
$$\begin{equation}
    Q^\top Q = \begin{bmatrix}
        q_1^\top \\ \vdots \\ q_n^\top
    \end{bmatrix} \begin{bmatrix}
        q_1 & \cdots & q_n
    \end{bmatrix} = [\left< q_i, q_j \right>]_{n \times n} = I = \rm diag (1, \cdots, 1)
\end{equation}$$ \\
즉, \\
$$\begin{equation}
    \left< q_i, q_j \right> = \begin{cases}
        1 \quad i = j \\
        0 \quad i \neq j
    \end{cases}
\end{equation}$$ \\
따라서 $q_i$들은 크기가 1이고(자기 자신과 내적한 값이 1), 서로 직교한다(내적 = 1)는 사실을 알 수 있다.

직교행렬 $Q$에 대해, linear transformation $T: \mathbb R^n \to \mathbb R^n$ such that $T(x) = Qx$에 대해 생각해보자.

$$\begin{equation}
    Qx = \begin{bmatrix}
        q_1 & \cdots & q_n
    \end{bmatrix} \begin{bmatrix}
        x_1 \\ \vdots \\ x_n
    \end{bmatrix} = q_1 x_1 + \cdots + q_n x_n
\end{equation}$$ \\
에서, $Qx$는 $Q$의 column vector 의 linear combination 형태로 표현됨을 알 수 있다. \\
이때 $q_1, \cdots, q_n$는 서로 직교하는 unit vector들이므로, linear transformation $T$는 $x = (x_1, \cdots, x_n)$을 새로운 
직교좌표계로 옮기는 mapping으로 생각해볼 수 있다. 이는 아래 자료를 참고하여, 회전과 반사의 조합으로 생각해볼 수 있다.
![Orthogonal Matrix 의 Linear Transformation 이해를 위한 Animation](../../assets/img/2025-03-23-geometric%20analysis%20of%20orthogonal%20diagonalization%20(1).gif)

## 정사각행렬의 직교대각화

### ...

추가 바람