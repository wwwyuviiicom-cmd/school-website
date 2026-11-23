import {
  FlaskConical,
  Cpu,
  MonitorPlay,
  Trophy,
  BookOpen,
  Users,
  Award,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

export interface Facility {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  alt: string;
  accent: 'amber' | 'sky';
}

export const facilities: Facility[] = [
  {
    icon: FlaskConical,
    title: 'अत्याधुनिक साइंस लैब',
    description:
      'भौतिकी (Physics), रसायन (Chemistry) और जीव विज्ञान (Biology) के आधुनिक और सुरक्षित उपकरणों से सुसज्जित प्रयोगशाला, जहाँ छात्र प्रैक्टिकल के जरिए सीखते हैं।',
    image:
      'https://images.pexels.com/photos/8471839/pexels-photo-8471839.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Science Lab',
    accent: 'amber',
  },
  {
    icon: Cpu,
    title: 'हाई-टेक कंप्यूटर लैब',
    description:
      'नवीनतम कंप्यूटर सिस्टम, हाई-स्पीड इंटरनेट और प्रोग्रामिंग टूल्स के साथ, जो छात्रों को कोडिंग और डिजिटल युग के लिए पूरी तरह तैयार करती है।',
    image:
      'https://images.pexels.com/photos/5530437/pexels-photo-5530437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Computer Lab',
    accent: 'sky',
  },
  {
    icon: MonitorPlay,
    title: 'डिजिटल स्मार्ट क्लास',
    description:
      'प्रोजेक्टर, एनिमेटेड वीडियो और इंटरेक्टिव बोर्ड की मदद से कठिन से कठिन विषयों और थ्योरी को आसान, विजुअल और मजेदार तरीके से समझना।',
    image:
      'https://images.pexels.com/photos/7743260/pexels-photo-7743260.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Smart Class',
    accent: 'amber',
  },
  {
    icon: Trophy,
    title: 'स्पोर्ट्स और शारीरिक विकास',
    description:
      'क्रिकेट, फुटबॉल, वॉलीबॉल जैसे खेलों के लिए बड़ा खेल मैदान और समर्पित खेल शिक्षकों के मार्गदर्शन में छात्रों का सर्वांगीण विकास।',
    image:
      'https://images.pexels.com/photos/17113551/pexels-photo-17113551.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'Sports & Games',
    accent: 'sky',
  },
];

export interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { icon: Users, value: '1500+', label: 'छात्र' },
  { icon: GraduationCap, value: '60+', label: 'अनुभवी शिक्षक' },
  { icon: Award, value: '25+', label: 'वर्षों का अनुभव' },
  { icon: BookOpen, value: '98%', label: 'परीक्षा परिणाम' },
];
