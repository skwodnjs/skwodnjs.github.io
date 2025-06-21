import hashlib

def get_check_letter_secure(year: int, serial_number: int) -> str:
    key = f"{year}-{serial_number:06d}"
    h = hashlib.sha1(key.encode()).digest()
    code = h[0] % 23
    return chr(ord('A') + code)

# 예시
print(get_check_letter_secure(2025, 1))
print(get_check_letter_secure(2025, 2))
print(get_check_letter_secure(2025, 3))
print(get_check_letter_secure(2026, 1))
