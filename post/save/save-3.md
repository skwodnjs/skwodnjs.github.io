---
title: nn.Module
tags: [Python, PyTorch]
author: JWN
date: 2026. 05. 18.
---

# nn.Module

PyTorch에서는 `nn.Module`을 상속받아 커스텀 Neural Network 모델을 만들 수 있다.

```python
import torch.nn as nn
import torch.nn.functional as F

class MyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Linear(1, 10)
        self.layer2 = nn.Linear(10, 1)

    def forward(self, x):
        x = F.relu(self.layer1(x))
        return self.layer2(x)
```

`nn.Module`을 상속하면 PyTorch가 자동으로
* parameter 관리
* GPU 이동
* gradient 계산
* optimizer 연결
* train/eval 모드 관리
* model 저장/로드
등을 수행한다. 예를 들어, `model.parameters()`를 하면 NN의 내부 weight/bias를 자동으로 수집한다.
이는 `optimizer = Adam(model.parameters())`와 같은 작업이 가능하도록 한다.

Neural Network 모델은 기본적으로 함수이다. 그래서 이런 단순한 형태도 가능하다.
```python
import torch.nn as nn

class MyAddModel(nn.Module):
    def __init__(self, value):
        super().__init__()
        self.value = value

    def forward(self, x):
        return x + self.value

model = MyAddModel(3)
print(model(4)) # 7
```

Neural Network는 parameter들을 update하여 loss를 줄이는 식으로 작동한다.
그래서 보통 모델 안에는 적당히 조절할 수 있는 parameter가 있다.
```python
for param in model.parameter():
    print(param.shape)

# for name, param in model.named_parameters():
#     print(name, param.shape)
```

`MyAddModel`에는 결과값을 조절해줄 만한 parameter가 딱히 없는 것을 확인할 수 있다. 그래서 출력해보면 아무것도 안나온다.

nn.Model 안에서 nn.Linear 등을 사용하는 경우, 자동으로 parameter가 수집된다. 
`MyModel`의 parameter를 출력해보면 Linear의 parameter들이 들어있는 것을 확인할 수 있다.

parameter를 직접 지정해줄 수도 있다. 즉, `nn.Module` 안에 "변동이 가능한 값"을 직접 선언할 수도 있다.
```python
class Linear(nn.Module):
    def __init__(self):
        super().__init__()
        self.W = nn.Parameter(torch.ones(3,2))
        self.b = nn.Parameter(torch.ones(2,3))

    def forward(self, x):
        output = torch.addmm(self.b, x, self.W.T)   # addmm = add + matrix-matrix multiplication
        return output

model = Linear()
for name, param in model.named_parameters():
    print(f"{name}\t{param.shape}")

# W       torch.Size([3, 2])
# b       torch.Size([2, 3])
```

`nn.ModuleList`를 이용해 nn.Module들을 리스트처럼 선언하고 index로 꺼내 쓸 수 있다. 아래 예제를 참고하자.
```python
class MyListModule(nn.Module):
    def __init__(self):
        super().__init__()
        self.add_list = nn.ModuleList([Linear(), Linear(), Linear()])

    def forward(self, x):
        for i in range(len(self.add_list)):
            x = self.add_list[i](x)
        return x

model = MyListModule()
for name, param in model.named_parameters():
    print(f"{name}\t{param.shape}")

# add_list.0.W    torch.Size([3, 2])
# add_list.0.b    torch.Size([2, 3])
# add_list.1.W    torch.Size([3, 2])
# add_list.1.b    torch.Size([2, 3])
# add_list.2.W    torch.Size([3, 2])
# add_list.2.b    torch.Size([2, 3])
```
