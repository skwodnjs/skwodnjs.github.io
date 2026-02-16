---
title: Markdown Render Test
categories: [Test, Markdown]
author: JWN
date: 2026. 02. 17.
---

# Heading 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Heading 2

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Heading 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

#### Heading 4

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

##### Heading 5

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

###### Heading 6

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

---

# 텍스트 스타일

기본 텍스트입니다.

**굵은 텍스트 (Bold)**

*기울임 텍스트 (Italic)*

***굵은 + 기울임***

~~취소선 텍스트~~

<u>HTML 밑줄</u>

<small>small 태그 테스트</small>

---

# 리스트

## 순서 없는 리스트

- 항목 1
- 항목 2
  - 하위 항목 2-1
  - 하위 항목 2-2
- 항목 3

## 순서 있는 리스트

1. 첫 번째
2. 두 번째
3. 세 번째

---

# 체크리스트

- [x] 완료된 작업
- [ ] 미완료 작업

---

# 인용문 (Blockquote)

> 이것은 인용문입니다.

> 이것은 인용문입니다.
> 여러 줄도 가능합니다.

> 이것은 인용문입니다.
>
> 여러 줄도 가능합니다.

---

# 코드

## 인라인 코드

인라인 코드는 `const test = 123;`와 같은 식으로 들어갑니다.

## 코드 블록

```js
function hello() {
  console.log("Hello World");
}
```

```python
def hello():
    print("Hello World")
```
        
```javascript
// Example JavaScript code
function helloWorld() {
    console.log('Hello, world!');
}
helloWorld();
```

---

# 링크

Markdown 링크:

구글은 [여기](https://google.com)를 누르세요.

같은 탭 열기 테스트:

<a href="https://naver.com">네이버</a>

새 탭 열기 테스트:

<a href="https://daum.net" target="_blank">다음</a>

내부 글 이동 테스트:

<a href="?id=3">내부 글 이동</a>

카테고리 페이지 이동 테스트:

<a href="/category#mathematics">수학 카테고리</a>

---

# 이미지

Markdown 이미지:

![테스트 이미지](https://picsum.photos/400/200)

HTML 이미지:

<img src="https://picsum.photos/300/150">

가로 100% 이미지:

<img src="https://picsum.photos/800/200" style="width:100%;">

---

# 테이블

| 이름 | 역할 | 나이 |
|------|------|------|
| Steve | Developer | 25 |
| Alex | Designer | 27 |
| JWN | Blogger | 30 |

---

# 구분선

---

***

___

---

# HTML 혼합 테스트

<div style="padding:10px;border:1px solid #ccc;">
HTML 박스 테스트
</div>

<div style="background:#f5f5f5;padding:12px;">
배경 박스 테스트
</div>

---

# Details / Summary

<details>
<summary>펼치기</summary>

숨겨진 내용입니다.

- 리스트도 가능
- **강조도 가능**
- <a href="?id=1">내부 링크도 가능</a>

</details>

---

# 수식 (MathJax 테스트용)

Inline:

$E = mc^2$

Block:

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

---

# 줄바꿈 테스트

한 줄  
강제 줄바꿈

한 줄 띄우기 테스트

---

# 긴 텍스트

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

---

# 마지막

렌더링 테스트 끝.
