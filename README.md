# 📸 Screenshot Generator (`screenshot-gen`)

`skia-canvas`와 TypeScript 기반으로 만든 앱스토어 스크린샷 자동 생성 도구입니다.  
JSON 설정 파일을 기반으로 텍스트, 배경, 프레임, 스크린샷 이미지를 자동으로 조합하여 고해상도 마케팅 이미지를 생성할 수 있습니다.

---

## ✅ 주요 기능

- App Store용 6.5인치, 6.9인치 대응 고해상도 스크린샷 생성
- 프레임 이미지 위에 스크린샷 자동 합성
- 타이틀 / 서브타이틀 텍스트 삽입 (그라데이션, 외곽선 포함)
- 다중 색상의 메타 그라데이션 배경 생성
- JSON 입력을 통한 배치 처리
- 투명도 제거 → App Store 업로드 가능 이미지 생성

---

## 📦 설치

```bash
git clone git@github.com:allting/screenshot_gen.git
cd screenshot_gen
yarn install

yarn start -- ./input/example.json
```

---

## 📱 실제 적용 사례

**이 프로젝트로 생성된 스크린샷은 [테도 앱](https://apps.apple.com/kr/app/테도/id6472631004)에서 사용되고 있습니다.**

🌐 더 많은 정보는 [테슬라도 공식 웹사이트](https://teslado.com)에서 확인하실 수 있습니다.

---
