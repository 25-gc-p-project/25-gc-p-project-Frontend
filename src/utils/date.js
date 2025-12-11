import dayjs from 'dayjs';

export function formatKoreanDate(date) {
  if (!date) return '';
  return dayjs(date).format('YYYY년 MM월 DD일 HH:mm');
}
