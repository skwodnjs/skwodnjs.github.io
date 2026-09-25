# Duality와 Lagrangian Duality

## Duality의 기본 아이디어

최적화 문제에서는 하나의 문제를 직접 푸는 대신, 그 문제와 밀접하게 연결된 또 다른 최적화 문제를 구성하는 경우가 많다. 원래 문제를 **primal problem**, 새롭게 구성한 문제를 **dual problem**이라고 한다.

Dual problem에 대해 모든 최적화 문제를 포괄하는 하나의 유일한 형식적 정의가 존재하는 것은 아니다. 대신 Lagrangian duality, Fenchel duality, conic duality 등 여러 duality framework가 존재하며, 각각의 framework 안에서 dual problem을 구성하는 방법이 정의된다.

이러한 여러 duality framework를 관통하는 핵심적인 아이디어는 다음과 같다.

> Dual problem은 primal problem의 optimal value에 대한 bound를 제공하도록 구성된다.

예를 들어 minimization problem

$$
	p^\ast = \inf_x f(x)
$$

을 생각하자. 어떤 방법으로 각 $y$에 대해

$$
	g(y) \le p^\ast
$$

를 만족하는 lower bound $g(y)$를 만들 수 있다고 하자. 그러면 가능한 lower bound 중 가장 큰 것을 찾는 문제

$$
	d^\ast = \sup_y g(y)
$$

를 생각할 수 있다.

모든 $y$에 대해 $g(y) \le p^\ast$이므로

$$
	d^\ast \le p^\ast
$$

가 성립한다. 이러한 관계를 **weak duality**라고 한다.

반대로 primal이 maximization problem인 경우에는 dual problem이 upper bound를 제공하도록 구성할 수 있으며, 이 경우 부등호의 방향이 반대가 된다.

따라서 weak duality의 핵심은 dual이 항상 primal보다 작다는 것이 아니라,

> dual problem의 optimal value가 primal problem의 optimal value에 대해 한 방향의 bound를 제공한다

는 것이다.

## Strong Duality

Minimization primal과 그에 대한 dual problem을 생각하면 weak duality에 의해

$$
	d^\ast \le p^\ast
$$

가 성립한다.

두 값의 차이

$$
	p^\ast - d^\ast
$$

를 **duality gap**이라고 한다.

특정한 조건 아래에서는 이 gap이 사라져

$$
	d^\ast = p^\ast
$$

가 성립할 수 있다. 이를 **strong duality**라고 한다.

Strong duality가 성립한다는 것은 primal problem과 dual problem이 동일한 문제가 된다는 뜻은 아니다. 두 문제는 서로 다른 변수와 서로 다른 feasible set을 가질 수 있다. Strong duality는 두 문제의 **optimal value가 동일하다**는 것을 의미한다.

즉,

$$
	\text{weak duality}: \qquad d^\ast \le p^\ast
$$

이고, 추가적인 조건 아래

$$
	\text{strong duality}: \qquad d^\ast = p^\ast
$$

를 얻을 수 있다.

어떤 조건이 strong duality를 보장하는지는 사용하는 duality framework에 따라 달라진다. 따라서 실제 문제에서는 어떤 방식으로 dual problem을 구성했는지와 그 framework에서 어떤 strong duality theorem을 적용할 수 있는지를 함께 확인해야 한다.

## Lagrangian Duality

여러 duality framework 중 가장 대표적인 것이 **Lagrangian duality**이다. Lagrangian duality에서는 constraint를 objective function과 결합한 Lagrangian을 이용하여 primal optimal value에 대한 bound를 구성하고, 그중 가장 좋은 bound를 찾는다.

### Primal problem과 Lagrangian

다음 constrained minimization problem을 생각하자.

$$
	\begin{aligned}
	\min_x \quad & f(x) \\
	\text{s.t.} \quad & g_i(x) \le 0, \qquad i = 1, \dots, m, \\
	& h_j(x) = 0, \qquad j = 1, \dots, p.
	\end{aligned}
$$

이 문제의 **Lagrangian**을

$$
	L(x, \lambda, \nu) = f(x) + \sum_{i = 1}^m \lambda_i g_i(x) + \sum_{j = 1}^p \nu_j h_j(x)
$$

로 정의한다.

여기서 $\lambda_i$와 $\nu_j$를 **Lagrange multiplier**라고 하며, inequality constraint에 대응하는 multiplier에는

$$
	\lambda_i \ge 0
$$

라는 조건을 둔다.

$x$가 primal feasible point라면

$$
	g_i(x) \le 0
$$

이고 $\lambda_i \ge 0$이므로

$$
	\lambda_i g_i(x) \le 0
$$

이다. 또한 equality constraint에 대해서는

$$
	h_j(x) = 0
$$

이다. 따라서 모든 primal feasible $x$에 대해

$$
	L(x, \lambda, \nu) \le f(x)
$$

가 성립한다.

즉 Lagrangian은 feasible point에서 원래 objective function의 값을 넘지 않도록 구성된다.

### Dual function

이제 multiplier $(\lambda, \nu)$를 고정하고 primal variable $x$에 대해 Lagrangian의 infimum을 취한다.

$$
	q(\lambda, \nu) = \inf_x L(x, \lambda, \nu)
$$

이를 **Lagrangian dual function**이라고 한다.

임의의 primal feasible point $x$에 대해

$$
	q(\lambda, \nu) = \inf_z L(z, \lambda, \nu) \le L(x, \lambda, \nu) \le f(x)
$$

가 성립한다.

따라서 모든 primal feasible $x$에 대해

$$
	q(\lambda, \nu) \le f(x)
$$

이고, 특히 primal optimal value $p^\ast$에 대해

$$
	q(\lambda, \nu) \le p^\ast
$$

가 성립한다.

즉 $\lambda \ge 0$인 각각의 $(\lambda, \nu)$는 primal optimal value에 대한 하나의 lower bound를 제공한다.

### Lagrangian dual problem

각 $(\lambda, \nu)$가 하나의 lower bound를 제공하므로, 자연스럽게 가능한 lower bound 중 가장 큰 것을 찾을 수 있다.

따라서 **Lagrangian dual problem**을

$$
	d^\ast = \sup_{\lambda \ge 0, \nu} q(\lambda, \nu)
$$

로 정의한다.

Dual function의 정의를 대입하면

$$
	d^\ast = \sup_{\lambda \ge 0, \nu} \inf_x L(x, \lambda, \nu)
$$

이다.

각각의 $q(\lambda, \nu)$가 $p^\ast$의 lower bound이므로

$$
	d^\ast \le p^\ast
$$

가 항상 성립한다. 이것이 **Lagrangian weak duality**이다.

따라서 Lagrangian duality의 기본적인 구조는

$$
	\text{Lagrangian} \longrightarrow \text{lower bounds} \longrightarrow \text{best lower bound}
$$

로 이해할 수 있다.

### Minimax 관점

Lagrangian duality는 minimax inequality와도 직접 연결된다.

고정된 $x \in X$에 대해 multiplier에 대한 supremum

$$
	\sup_{\lambda \ge 0, \nu} L(x, \lambda, \nu)
$$

을 생각하자.

$x$가 feasible하다면 모든 inequality constraint에 대해 $g_i(x) \le 0$이고 모든 equality constraint에 대해 $h_j(x) = 0$이므로

$$
	\sup_{\lambda \ge 0, \nu} L(x, \lambda, \nu) = f(x).
$$

반대로 $x$가 infeasible하다면 적어도 하나의 constraint가 위반된다.

어떤 inequality constraint가

$$
	g_i(x) > 0
$$

를 만족한다면 $\lambda_i \to \infty$로 보내어 Lagrangian을 무한히 크게 만들 수 있다. 또한 어떤 equality constraint가

$$
	h_j(x) \ne 0
$$

를 만족한다면 $\nu_j$의 부호와 크기를 적절히 선택하여 역시 Lagrangian을 무한히 크게 만들 수 있다.

따라서

$$
	\sup_{\lambda \ge 0, \nu} L(x, \lambda, \nu) =
	\begin{cases}
	f(x), & x \text{ is feasible}, \\
	+\infty, & x \text{ is infeasible}.
	\end{cases}
$$

이고 primal optimal value는

$$
	p^\ast = \inf_x \sup_{\lambda \ge 0, \nu} L(x, \lambda, \nu)
$$

로 표현할 수 있다.

반면 dual optimal value는

$$
	d^\ast = \sup_{\lambda \ge 0, \nu} \inf_x L(x, \lambda, \nu)
$$

이다.

따라서 일반적인 minimax inequality

$$
	\sup_{\lambda \ge 0, \nu} \inf_x L(x, \lambda, \nu) \le \inf_x \sup_{\lambda \ge 0, \nu} L(x, \lambda, \nu)
$$

는 곧

$$
	d^\ast \le p^\ast
$$

라는 Lagrangian weak duality를 의미한다.

그리고 두 값이 같아져

$$
	\sup_{\lambda \ge 0, \nu} \inf_x L(x, \lambda, \nu) = \inf_x \sup_{\lambda \ge 0, \nu} L(x, \lambda, \nu)
$$

가 성립하면 Lagrangian strong duality가 성립한다.

### Strong duality와 Slater condition

Lagrangian weak duality는 항상 성립하지만, strong duality는 일반적으로 자동으로 성립하지 않는다.

Convex optimization에서는 strong duality를 보장하는 여러 sufficient condition이 알려져 있으며, 대표적인 것이 **Slater condition**이다.

Convex problem에서 모든 constraints를 만족하고, 특히 모든 inequality constraints를 strictly 만족하는 point $\bar{x}$가 존재한다고 하자. 즉 strict feasible point가 존재하여

$$
	g_i(\bar{x}) < 0, \qquad i = 1, \dots, m
$$

가 성립한다고 하자.

이러한 **Slater condition**이 성립하면 Lagrangian strong duality가 성립하여

$$
	d^\ast = p^\ast
$$

를 얻는다.

즉 Lagrangian dual problem을 통해 얻을 수 있는 가장 좋은 lower bound가 실제 primal optimal value와 일치한다.

다만 Slater condition은 strong duality를 보장하는 대표적인 **sufficient condition**이지 necessary condition은 아니다. 따라서 Slater condition이 성립하지 않더라도 strong duality가 성립할 수 있다.

전체적으로 Lagrangian duality의 흐름은 다음과 같이 정리할 수 있다.

$$
	\text{primal problem} \longrightarrow \text{Lagrangian} \longrightarrow \text{dual function} \longrightarrow \text{dual problem} \longrightarrow \text{strong duality}
$$