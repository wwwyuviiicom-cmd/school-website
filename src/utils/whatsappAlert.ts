export interface StudentInfo {
  name: string;
  phone: string;
  gender: 'male' | 'female';
}

export const studentDatabase: Record<string, Record<string, StudentInfo>> = {
  '9th B': {
    '1': { name: 'ABHISHEK', phone: '9301324335', gender: 'male' },
    '2': { name: 'AKASH', phone: '871844709', gender: 'male' },
    '3': { name: 'ANJALI', phone: '8959428625', gender: 'female' },
    '4': { name: 'ANTIMA', phone: '7879507213', gender: 'female' },
    '5': { name: 'ANURADHA GURJAR', phone: '8120609588', gender: 'female' },
    '6': { name: 'ASMITA', phone: '9981016874', gender: 'female' },
    '7': { name: 'ASTHA TANWAR', phone: '9754290027', gender: 'female' },
    '8': { name: 'DEVENDRA', phone: '9697966769', gender: 'male' },
    '9': { name: 'HARSHITA TANWAR', phone: '7489917073', gender: 'female' },
    '10': { name: 'HIMANSHU VERMA', phone: '9981863735', gender: 'male' },
    '11': { name: 'LAXMI GURJAR', phone: '9757949907', gender: 'female' },
    '12': { name: 'NIGAM', phone: '8643001977', gender: 'male' },
    '13': { name: 'NISHA SOLANKI', phone: '8103559874', gender: 'female' },
    '14': { name: 'PRASHANT SAHU', phone: '9754814567', gender: 'male' },
    '15': { name: 'PRIYANKA GURJAR', phone: '8305449001', gender: 'female' },
    '16': { name: 'SAKSHI', phone: '9755144758', gender: 'female' },
    '17': { name: 'SHEETAL', phone: '7697392178', gender: 'female' },
    '18': { name: 'SHIVANI', phone: '7806009291', gender: 'female' },
    '19': { name: 'SHUBHAM', phone: '6266550569', gender: 'male' },
    '20': { name: 'SHYAMSUNDAR', phone: '7773828897', gender: 'male' },
    '21': { name: 'SUMIT MEENA', phone: '8878545923', gender: 'male' },
    '22': { name: 'UDIT JOSHI', phone: '7400996082', gender: 'male' },
    '23': { name: 'UMA', phone: '9617057312', gender: 'female' },
    '24': { name: 'VEER SINGH', phone: '7566872899', gender: 'male' },
    '25': { name: 'VINAY KEVAT', phone: '9752756753', gender: 'male' },
    '26': { name: 'VIRENDRA', phone: '9329884782', gender: 'male' },
    '27': { name: 'VISHAL', phone: '7400965921', gender: 'male' },
    '28': { name: 'YUVRAJ RAJPUT', phone: '9893749159', gender: 'male' },
    '29': { name: 'YUVRAJ THAKUR', phone: '9893636899', gender: 'male' },
    '30': { name: 'YUVI RAJPUT', phone: '6265345040', gender: 'male' },
  },
};

const DEFAULT_PHONE = '0000000000';

export const alertReasons = [
  'मस्ती',
  'बातचीत',
  'अधूरी कॉपी',
  'बदतमीजी',
  'आज अनुपस्थित (Absent)',
  'यूनिफॉर्म ठीक नहीं',
  'होमवर्क अधूरा',
];

export const classOptions = [
  '8th A',
  '8th B',
  '9th A',
  '9th B',
  '10th A',
  '10th B',
  '11th Chemistry',
  '11th Maths',
  '11th Physics',
  '11th Bio',
  '12th Physics',
  '12th Maths',
  '12th Chemistry',
  '12th Bio',
];

export const AUTH_PASSWORD = 'gvm2026';
export const AUTH_STORAGE_KEY = 'gvm_auth';

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === AUTH_PASSWORD;
}

export function authenticate(password: string): boolean {
  if (password === AUTH_PASSWORD) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, AUTH_PASSWORD);
    return true;
  }
  return false;
}

const REAL_DATA_CLASS = '9th B';
const DUMMY_ROW_COUNT = 50;

function dummyStudent(rollNumber: string): StudentInfo {
  const isEven = Number(rollNumber) % 2 === 0;
  return {
    name: `टेस्ट छात्र ${rollNumber}`,
    phone: DEFAULT_PHONE,
    gender: isEven ? 'female' : 'male',
  };
}

export function getStudentInfo(
  className: string,
  rollNumber: string
): StudentInfo {
  return studentDatabase[className]?.[rollNumber] ?? dummyStudent(rollNumber);
}

export function getClassStudents(
  className: string
): Array<{ roll: string; info: StudentInfo }> {
  if (className === REAL_DATA_CLASS) {
    return Object.entries(studentDatabase[REAL_DATA_CLASS])
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([roll, info]) => ({ roll, info }));
  }
  return Array.from({ length: DUMMY_ROW_COUNT }, (_, i) => {
    const roll = String(i + 1);
    return { roll, info: dummyStudent(roll) };
  });
}

const ALERT_CLOSING = 'कृपया इस पर तुरंत ध्यान दीजिएगा।';

export function getAlertBody(alertReason: string): string {
  switch (alertReason) {
    case 'बातचीत':
      return `वो आज कक्षा में बहुत ज्यादा बातचीत करता/करती है जिससे पूरी क्लास डिस्टर्ब होती है।\n${ALERT_CLOSING}`;
    case 'अधूरी कॉपी':
      return `वो आज की कॉपी अधूरी (Incomplete) है और शिक्षकों के बार-बार कहने पर भी कॉपी पूरी नहीं कर रहा/रही है।\n${ALERT_CLOSING}`;
    case 'मस्ती':
      return `वो आज कक्षा में बहुत ज्यादा मस्ती और शरारत करता/करती है जिससे उसका पढ़ाई पर ध्यान नहीं है।\n${ALERT_CLOSING}`;
    case 'बदतमीजी':
      return `वो आज का व्यवहार शिक्षकों के प्रति ठीक नहीं है और कक्षा में अनुशासनहीनता (बदतमीजी) करता/करती है।\n${ALERT_CLOSING}`;
    case 'आज अनुपस्थित (Absent)':
      return 'वह आज बिना किसी सूचना के स्कूल में अनुपस्थित (Absent) है। कृपया इसका कारण बताएं।';
    case 'यूनिफॉर्म ठीक नहीं':
      return 'वह आज स्कूल यूनिफॉर्म (Dress/Shoes/Hair) में नहीं आया/आई है। कृपया कल से उसे सही गणवेश में स्कूल भेजें।';
    case 'होमवर्क अधूरा':
      return 'वह आज घर से मिला हुआ पुराना गृहकार्य (Homework) पूरा करके नहीं लाया/लाई है। कृपया घर पर उसकी कॉपी चेक करें।';
    default:
      return `वो आज की गतिविधियों पर विशेष ध्यान देने की आवश्यकता है।\n${ALERT_CLOSING}`;
  }
}

export function buildAlertMessage(
  className: string,
  rollNumber: string,
  alertReason: string
): string {
  const student = getStudentInfo(className, rollNumber);
  return `गायत्री विद्या मंदिर अलर्टस (GVM)
नमस्कार सर/मैडम,
आपका बच्चा ${student.name}, जो कक्षा ${className} में है, ${getAlertBody(alertReason)}`;
}

function openWhatsAppMessages(messages: Array<{ phone: string; text: string }>): void {
  messages.forEach(({ phone, text }, index) => {
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(text)}`;
    setTimeout(() => {
      window.open(url, '_blank');
    }, index * 800);
  });
}

export function sendToWhatsApp(
  className: string,
  rollNumbers: string[],
  alertReason: string
): void {
  openWhatsAppMessages(
    rollNumbers.map((roll) => ({
      phone: getStudentInfo(className, roll).phone,
      text: buildAlertMessage(className, roll, alertReason),
    }))
  );
}

export const ptmStatusOptions = [
  'परफॉर्मेंस ठीक है',
  'पढ़ाई ठीक है पर और ध्यान देने की जरूरत है',
  'ठीक पढ़ाई नहीं कर रहा है बहुत ज्यादा ध्यान देने की जरूरत है',
  'पढ़ाई में बहुत बढ़िया है',
] as const;

export function buildPtmMessage(
  className: string,
  rollNumber: string,
  marks: string,
  status: string
): string {
  const student = getStudentInfo(className, rollNumber);
  return `गायत्री विद्या मंदिर (GVM) PTM अलर्ट
नमस्कार सर/मैडम,
आपके बच्चे ${student.name} (रोल नंबर: ${rollNumber}) की कक्षा ${className} की PTM रिपोर्ट इस प्रकार है:
परीक्षा में प्राप्तांक: ${marks}
शिक्षक की टिप्पणी: आपका बच्चा ${status}।
कृपया इस रिपोर्ट के आधार पर बच्चे की पढ़ाई में सहयोग करें। धन्यवाद।`;
}

export function sendSinglePtmToWhatsApp(
  className: string,
  roll: string,
  marks: string,
  status: string
): void {
  const student = getStudentInfo(className, roll);
  const phone = `91${student.phone}`;
  const message = buildPtmMessage(className, roll, marks, status);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function sendPtmToWhatsApp(
  className: string,
  entries: Array<{ roll: string; marks: string; status: string }>
): void {
  openWhatsAppMessages(
    entries.map((entry) => ({
      phone: getStudentInfo(className, entry.roll).phone,
      text: buildPtmMessage(className, entry.roll, entry.marks, entry.status),
    }))
  );
}

export function formatFeeDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
}

export function buildFeeMessage(
  className: string,
  rollNumber: string,
  amount: string,
  lastDate: string
): string {
  const student = getStudentInfo(className, rollNumber);
  return `गायत्री विद्या मंदिर (GVM) फीस अलर्ट
नमस्कार सर/मैडम,
आपके बच्चे ${student.name} (रोल नंबर: ${rollNumber}) की स्कूल फीस ₹${amount} बकाया है। जमा करने की अंतिम तिथि ${formatFeeDate(lastDate)} है। कृपया लेट फीस से बचने के लिए समय पर भुगतान करें।
धन्यवाद।`;
}

export function sendFeeRemindersToWhatsApp(
  className: string,
  rollNumbers: string[],
  amount: string,
  lastDate: string
): void {
  openWhatsAppMessages(
    rollNumbers.map((roll) => ({
      phone: getStudentInfo(className, roll).phone,
      text: buildFeeMessage(className, roll, amount, lastDate),
    }))
  );
}

export function buildDiaryMessage(
  className: string,
  classwork: string,
  homework: string
): string {
  return `गायत्री विद्या मंदिर (GVM) दैनिक डायरी
कक्षा: ${className}
नमस्कार सर/मैडम, आज स्कूल में यह कार्य करवाया गया है:
📘 आज पढ़ाया गया: ${classwork}
📝 आज का गृहकार्य: ${homework}
कृपया घर पर बच्चों से यह कार्य पूरा करवाएं। धन्यवाद।`;
}

export function sendDiaryToWhatsApp(
  className: string,
  rollNumbers: string[],
  classwork: string,
  homework: string
): void {
  const text = buildDiaryMessage(className, classwork, homework);
  openWhatsAppMessages(
    rollNumbers.map((roll) => ({
      phone: getStudentInfo(className, roll).phone,
      text,
    }))
  );
}
