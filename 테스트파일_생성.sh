#!/bin/bash

# 깨진 한글 파일명 테스트 파일 생성 스크립트

echo "======================================"
echo "  깨진 한글 파일명 테스트 파일 생성"
echo "======================================"
echo ""

# 데스크탑에 테스트 폴더 생성
TEST_DIR=~/Desktop/테스트_파일들
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo "📁 테스트 파일 생성 중..."
echo ""

# Python으로 NFD 파일 생성
python3 << 'EOF'
import unicodedata
import os

# 테스트 파일명 목록
test_files = [
    ("자기평가서.txt", "자기평가서 예시 내용입니다."),
    ("보고서.pdf", "보고서 예시 내용입니다."),
    ("회의록.xlsx", "회의록 예시 내용입니다."),
    ("최종본.pptx", "최종본 예시 내용입니다."),
    ("강남역.txt", "강남역 (받침 테스트)"),
    ("한국어.docx", "한국어 (받침 테스트)"),
    ("성공.txt", "성공 (받침 테스트)"),
    ("있다.txt", "있다 (복잡한 받침 테스트)"),
    ("밟다.txt", "밟다 (복잡한 받침 테스트)"),
]

print("생성된 파일:")
print("-" * 50)

for filename, content in test_files:
    # NFD 형식으로 변환 (자음/모음 분리)
    nfd_filename = unicodedata.normalize('NFD', filename)
    
    # 파일 생성
    with open(nfd_filename, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ {nfd_filename:30} → {filename}")

print("-" * 50)
print(f"\n✅ 총 {len(test_files)}개 파일이 생성되었습니다!")
EOF

echo ""
echo "======================================"
echo "  ✅ 테스트 파일 생성 완료!"
echo "======================================"
echo ""
echo "📂 위치: $TEST_DIR"
echo ""
echo "다음 단계:"
echo "1. 크롬에서 확장프로그램 열기"
echo "2. 위 폴더의 파일들을 드래그"
echo "3. '✨ 파일명 복원하기' 클릭"
echo "4. 다운로드 폴더에서 복원된 파일 확인"
echo ""

