// src/utils/quater.utils.js

export const calculateQuarterEndDate = (startDate) => {
  const start = new Date(startDate);
  if (Number.isNaN(start)) return { endDate: null, soDonViThang: null };

  const day = start.getDate();
  const month = start.getMonth(); // 0 = Jan
  const quarter = Math.floor(month / 3);
  const monthPos = month % 3;

  let soDonViThang;
  switch (monthPos) {
    case 0:
      soDonViThang = day < 15 ? 3 : 2.5;
      break;
    case 1:
      soDonViThang = day < 15 ? 2 : 1.5;
      break;
    case 2:
      soDonViThang = day < 15 ? 4 : 3.5;
      break;
    default:
      soDonViThang = 0;
  }

  let endDate;
  if (monthPos === 2) {
    const nextQ = (quarter + 1) % 4;
    const yEnd = quarter === 3 ? start.getFullYear() + 1 : start.getFullYear();
    const mEnd = nextQ * 3 + 2;
    endDate = new Date(yEnd, mEnd + 1, 0); // Lấy ngày cuối cùng của tháng
  } else {
    const mEnd = quarter * 3 + 2;
    endDate = new Date(start.getFullYear(), mEnd + 1, 0);
  }

  endDate.setHours(12, 0, 0, 0);
  return { endDate, soDonViThang };
};
