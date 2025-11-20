
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc,
  query,
  where
} from 'firebase/firestore';
import { Product } from '../types';

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "mock-key",
  authDomain: "lua-baby.firebaseapp.com",
  projectId: "lua-baby",
  storageBucket: "lua-baby.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Safe initialization
let app;
let auth: any;
let db: any;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase not configured correctly, falling back to local mode.");
}

export const authenticateUser = async () => {
  if (!auth) return null;
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Auth Error:", error);
    return null;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  if (!db) return MOCK_PRODUCTS;
  
  try {
    // Hardcoded app ID path for demo purposes as requested
    const productsRef = collection(db, 'artifacts', 'lua-baby-app', 'public', 'data', 'products');
    const snapshot = await getDocs(productsRef);
    
    if (snapshot.empty) {
      return MOCK_PRODUCTS;
    }

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (e) {
    console.warn("Firestore unavailable, using mocks.");
    return MOCK_PRODUCTS;
  }
};

export const addProduct = async (product: Omit<Product, 'id'>) => {
  if (!db) {
    console.log("Mock adding product:", product);
    return;
  }
  const productsRef = collection(db, 'artifacts', 'lua-baby-app', 'public', 'data', 'products');
  await addDoc(productsRef, product);
};

export const deleteProduct = async (productId: string) => {
  if (!db) {
    console.log("Mock deleting product:", productId);
    return;
  }
  const productDoc = doc(db, 'artifacts', 'lua-baby-app', 'public', 'data', 'products', productId);
  await deleteDoc(productDoc);
};

// Fallback Data - SEO Optimized with New Brands
export const MOCK_PRODUCTS: Product[] = [
  // Brand: Kaine (Urban/Streetwear)
  {
    id: 'k1',
    name: 'Moletom Kaine "Future"',
    price: 129.90,
    image: 'https://picsum.photos/seed/kaine1/500/500',
    category: 'top',
    description: 'Estilo urbano para os pequenos que já ditam tendência. Conforto e atitude.',
    sizes: ['4', '6', '8', '10'],
    colors: ['Preto Grafite', 'Cinza Concreto'],
    brand: 'Kaine',
    material: '50% Algodão Premium, 50% Poliéster Reciclado',
    care: 'Lavar à máquina a frio, não usar secadora.',
    occasion: 'Passeio Urbano'
  },
  {
    id: 'k2',
    name: 'Jogger Cargo Mini Kaine',
    price: 99.90,
    image: 'https://picsum.photos/seed/kaine2/500/500',
    category: 'bottom',
    description: 'Calça cargo ultra resistente para aventuras na cidade. Bolsos funcionais e elástico confortável.',
    sizes: ['4', '6', '8', '10'],
    colors: ['Verde Militar', 'Caqui', 'Preto'],
    brand: 'Kaine',
    material: 'Sarja com Elastano',
    care: 'Lavagem normal.',
    occasion: 'Dia a Dia Radical'
  },
  
  // Brand: Dingdang (Playful/Colorful)
  {
    id: 'd1',
    name: 'Vestido "Festa das Cores"',
    price: 89.90,
    image: 'https://picsum.photos/seed/dingdang1/500/500',
    category: 'fullbody',
    description: 'Um arco-íris em forma de vestido! Tecido leve que gira com a criança.',
    sizes: ['2', '4', '6', '8'],
    colors: ['Multicolorido', 'Rosa Chiclete'],
    brand: 'Dingdang',
    material: '100% Algodão Orgânico',
    care: 'Lavar delicadamente.',
    occasion: 'Festas e Parques'
  },
  {
    id: 'd2',
    name: 'Camiseta "Dino Skatista"',
    price: 59.90,
    image: 'https://picsum.photos/seed/dingdang2/500/500',
    category: 'top',
    description: 'Diversão garantida com estampas criativas que estimulam a imaginação.',
    sizes: ['2', '4', '6'],
    colors: ['Amarelo Sol', 'Azul Céu'],
    brand: 'Dingdang',
    material: 'Algodão Sustentável',
    care: 'Pode passar a ferro.',
    occasion: 'Escola e Brincadeiras'
  },
  
  // Brand: Hagarradinhos (Comfort/Pajamas)
  {
    id: 'h1',
    name: 'Macacão "Abraço de Urso"',
    price: 79.90,
    image: 'https://picsum.photos/seed/hagar1/500/500',
    category: 'fullbody',
    description: 'O toque mais macio do mundo. Desenvolvido para peles sensíveis e noites tranquilas.',
    sizes: ['P', 'M', 'G', '1'],
    colors: ['Beige Aveia', 'Cinza Nuvem'],
    brand: 'Hagarradinhos',
    material: 'Algodão Pima Peruano',
    care: 'Lavar com sabão neutro.',
    occasion: 'Hora de Dormir'
  },
  {
    id: 'h2',
    name: 'Conjunto "Soninho Profundo"',
    price: 69.90,
    image: 'https://picsum.photos/seed/hagar2/500/500',
    category: 'fullbody',
    description: 'Tecnologia térmica que mantém a temperatura ideal do bebê a noite toda.',
    sizes: ['P', 'M', 'G'],
    colors: ['Azul Sereno', 'Rosa Pastel'],
    brand: 'Hagarradinhos',
    material: 'Malha Suedine',
    care: 'Secar à sombra.',
    occasion: 'Descanso'
  },

  // HOLIDAY SPECIALS (New)
  {
    id: 'hol1',
    name: 'Vestido Dourado Estelar',
    price: 159.90,
    image: 'https://picsum.photos/seed/holiday1/500/500',
    category: 'fullbody',
    description: 'Brilhe nas festas com este vestido de tafetá dourado. Possui forro de algodão para conforto total.',
    sizes: ['2', '4', '6', '8'],
    colors: ['Dourado', 'Rose Gold'],
    brand: 'Dingdang',
    material: 'Tafetá e Algodão',
    care: 'Lavagem a seco.',
    occasion: 'Festa',
    isKit: false
  },
  {
    id: 'hol2',
    name: 'Conjunto Linho Ano Novo',
    price: 139.90,
    image: 'https://picsum.photos/seed/holiday2/500/500',
    category: 'fullbody',
    description: 'Elegância pura. Camisa de linho e bermuda de alfaiataria para começar o ano com o pé direito.',
    sizes: ['2', '4', '6'],
    colors: ['Branco', 'Off-White'],
    brand: 'Kaine',
    material: '100% Linho',
    care: 'Passar a ferro brando.',
    occasion: 'Festa',
    isKit: false
  },
  {
    id: 'hol3',
    name: 'Camisa Brilho Lunar',
    price: 89.90,
    image: 'https://picsum.photos/seed/holiday3/500/500',
    category: 'top',
    description: 'Camisa social com micro-estampas de estrelas prateadas. Um charme discreto.',
    sizes: ['4', '6', '8'],
    colors: ['Azul Noite', 'Preto'],
    brand: 'Kaine',
    material: 'Algodão Egípcio',
    care: 'Lavagem normal.',
    occasion: 'Festa',
    isKit: false
  },

  // KITS (Bundles)
  {
    id: 'kit1',
    name: 'Kit Verão Dingdang (3 Peças)',
    price: 149.90,
    image: 'https://picsum.photos/seed/kit1/500/500',
    category: 'kit',
    description: 'Economize levando o look completo! Inclui camiseta, shorts e boné combinando.',
    sizes: ['2', '4', '6'],
    colors: ['Tema Praia', 'Tema Safari'],
    brand: 'Dingdang',
    material: 'Mix de Algodão e Poliamida',
    care: 'Verificar etiquetas individuais.',
    occasion: 'Férias',
    isKit: true
  },
  {
    id: 'kit2',
    name: 'Kit Maternidade Hagarradinhos',
    price: 199.90,
    image: 'https://picsum.photos/seed/kit2/500/500',
    category: 'kit',
    description: 'O presente perfeito. Contém body, calça, gorro e luvas em algodão egípcio.',
    sizes: ['RN', 'P'],
    colors: ['Branco Puro', 'Amarelo Sorte'],
    brand: 'Hagarradinhos',
    material: '100% Algodão Egípcio',
    care: 'Lavagem delicada à mão.',
    occasion: 'Maternidade',
    isKit: true
  }
];
