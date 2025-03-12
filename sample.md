---
title: Your Document Title
author: Your Name
tags: [tag1, tag2, tag3]
---

<!--目次-->
[TOC]

# H1
## H2
### H3
#### h4

- h4は使用できますが，推奨しません

```cpp {.line-numbers}
int main(void){
    cout << "HelloWorld" << endl;
    return 0;
}
```

```cpp{.line-numbers highlight=2}
void getHoge(string context){
    return context;
}
```

@import "./sample.cpp" {.line-numbers highlight=2}

==マーカー==

!!! note
    default usage
    here body

!!! info
    here body

!!! warning
    here body

その他表示方法は以下URLより
[!!!表記一覧](https://squidfunk.github.io/mkdocs-material/reference/admonitions/#+type:abstract)

この他基本的な記法や機能は以下のURLより
[基礎記法](https://github.com/shd101wyy/markdown-preview-enhanced/blob/master/docs/ja-jp/markdown-basics.md)
[公式ドキュメント](https://shd101wyy.github.io/markdown-preview-enhanced//#/)

## mdのファイルリンクとpdfについて
- このテンプレートを使用する際，
```md
[next page](./02.md)
```
と記載しPDF出力したとき，
```md
[next page](./02.pdf)
```
と変更されるようにパーサーを組んでいます．
これは，PDFで見る人がいる際にページ移動を楽にするためです．

追加してほしい昨日があればissueなどを建ててください