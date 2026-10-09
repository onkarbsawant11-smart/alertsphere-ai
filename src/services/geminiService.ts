import { HazardAlert } from '../types';

export interface CopilotResponse {
  reply: string;
  source: string;
}

export interface AlertExplanation {
  summary: string;
  keyActions: string[];
  avoidActions: string[];
  shelterAdvice: string;
  source?: string;
}

export async function askCopilot(
  message: string,
  context?: any,
  language: 'en' | 'hi' | 'mr' = 'en',
  userLocation?: string
): Promise<CopilotResponse> {
  try {
    const res = await fetch('/api/gemini/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, language, userLocation }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return {
      reply: data.reply || 'Please seek high ground and follow official directives.',
      source: data.source || 'AlertSphere Emergency System',
    };
  } catch (err) {
    console.warn('Backend copilot call failed, using client safety fallback:', err);
    return {
      reply: getClientEmergencyFallback(message, language),
      source: 'On-device Emergency Knowledge Base',
    };
  }
}

export async function getAlertExplanation(
  alert: HazardAlert,
  language: 'en' | 'hi' | 'mr' = 'en'
): Promise<AlertExplanation> {
  try {
    const res = await fetch('/api/gemini/explain-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alert, language }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('Backend explain alert failed, using client fallback:', err);
    return {
      summary: `Official ${alert.hazardType.toUpperCase()} warning issued for ${alert.locationName} with ${alert.severity} severity level.`,
      keyActions: [
        'Move to a designated safe structure or high ground immediately.',
        'Keep emergency supplies, charged power bank, and vital documents ready.',
        'Do not cross moving floodwaters or approach dangling power cables.',
      ],
      avoidActions: [
        'Avoid driving or walking through waterlogged underpasses.',
        'Do not spread unverified rumors on social messaging channels.',
      ],
      shelterAdvice: 'Check the nearest verified shelter with open capacity in the Safe Shelter Finder tab.',
      source: 'On-device Safety Rules',
    };
  }
}

function getClientEmergencyFallback(message: string, language: string): string {
  const q = message.toLowerCase();
  if (language === 'hi') {
    if (q.includes('kit') || q.includes('pack')) {
      return 'आपातकालीन बैग (Go-Bag) में: 3 दिन का पीने का पानी, सूखा भोजन, टॉर्च, पावर बैंक, दवाइयां, प्राथमिक उपचार सामग्री और वाटरप्रूफ पाउच में आवश्यक पहचान पत्र रखें।';
    }
    if (q.includes('flood') || q.includes('water') || q.includes('बाढ़')) {
      return 'बाढ़ चेतावनी: तुरंत ऊंचे स्थान पर जाएं। 15 सेमी बहता पानी भी व्यक्ति को गिरा सकता है। बिजली का मुख्य स्विच बंद करें। लिफ्ट का प्रयोग न करें।';
    }
    return 'शांत रहें और अपनी व्यक्तिगत सुरक्षा सुनिश्चित करें। आधिकारिक चेतावनी का पालन करें और निकटतम शरण स्थल पर जाएं। आपात स्थिति में 112 डायल करें।';
  }

  if (language === 'mr') {
    if (q.includes('kit') || q.includes('pack')) {
      return 'आपत्कालीन बॅगमध्ये: ३ दिवसांचे पिण्याचे पाणी, सुका खाऊ, टॉर्च, औषधे, ओळखपत्रे आणि पॉवर बँक सोबत ठेवा.';
    }
    return 'शांत राहा आणि सुरक्षित उंच ठिकाणी जा. पुराच्या पाण्यातून गाडी चालवू नका. आपत्कालीन मदतीसाठी ११२ किंवा एनडीआरएफशी संपर्क साधा.';
  }

  if (q.includes('pack') || q.includes('kit')) {
    return 'Emergency Go-Bag Checklist:\n1. 3-day drinking water (3L/person/day) & non-perishable rations\n2. LED Flashlight + extra batteries + power bank\n3. First aid kit & essential prescription medicines\n4. Waterproof pouch with government ID & cash\n5. Sturdy boots and emergency signaling whistle.';
  }

  if (q.includes('flood') || q.includes('water')) {
    return 'Flood Emergency Protocols:\n1. Move immediately to higher elevation; never stay in low-lying ground rooms.\n2. Turn Around, Don’t Drown! Avoid wading or driving through moving water.\n3. Disconnect main power grid breaker if water reaches foundation level.\n4. If stranded, head to the roof and display bright clothing or blow whistle.';
  }

  return 'Stay calm and prioritize physical safety. Follow official disaster warnings, check the shelter map for safe staging zones, and call 112 (National Emergency) if in direct peril.';
}
