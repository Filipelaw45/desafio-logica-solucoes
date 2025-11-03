import { User } from '@/types/user';

const CSV_SEPARATOR = ',';

export function userToCSV(user: User): string {
  const escapeCsvValue = (value: string | number): string => {
    const strValue = String(value);
    if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
      return `"${strValue.replace(/"/g, '""')}"`;
    }
    return strValue;
  };

  return [
    escapeCsvValue(user.id),
    escapeCsvValue(user.firstName),
    escapeCsvValue(user.lastName),
    escapeCsvValue(user.email),
    escapeCsvValue(user.phone),
    escapeCsvValue(user.city),
    escapeCsvValue(user.country),
    escapeCsvValue(user.picture),
    escapeCsvValue(user.gender),
    escapeCsvValue(user.age),
  ].join(CSV_SEPARATOR);
}

export function csvToUser(csvLine: string): User | null {
  if (!csvLine.trim()) return null;

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === CSV_SEPARATOR && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const values = parseCsvLine(csvLine);

  if (values.length < 10) return null;

  return {
    id: values[0],
    firstName: values[1],
    lastName: values[2],
    email: values[3],
    phone: values[4],
    city: values[5],
    country: values[6],
    picture: values[7],
    gender: values[8],
    age: parseInt(values[9]) || 0,
  };
}

export function getCSVHeader(): string {
  return 'id,firstName,lastName,email,phone,city,country,picture,gender,age';
}
