// Firebase configuration keys (Placeholders until user replaces them in the Firebase console)
const firebaseConfig = {
    apiKey: "AIzaSyC4rquVj5Ug2ZdsDci7zHucEUXXVtaCPcI",
    authDomain: "kshetriva-farms.firebaseapp.com",
    projectId: "kshetriva-farms",
    storageBucket: "kshetriva-farms.firebasestorage.app",
    messagingSenderId: "332889493996",
    appId: "1:332889493996:web:945cbd393438dc3aa9b0c9"
};

// Global Firebase Instance State
let db = null;
let auth = null;
let useFirebase = false;

// Mock / Initial Products Data (Acts as default catalog and local fallback db)
let products = [
    {
        id: 1,
        name: "Spinach (Palak)",
        category: "leafy",
        price: "₹40",
        unit: "bunch",
        image: "images/spinach.webp",
        inStock: true
    },
    {
        id: 2,
        name: "Carrots",
        category: "root",
        price: "₹60",
        unit: "kg",
        image: "images/carrots.webp",
        inStock: true
    },
    {
        id: 3,
        name: "Red Tomatoes",
        category: "vegetables",
        price: "₹50",
        unit: "kg",
        image: "images/tomatoes.webp",
        inStock: true
    },
    {
        id: 4,
        name: "Alphonso Mangoes",
        category: "fruits",
        price: "₹400",
        unit: "dozen",
        image: "images/mangoes.webp",
        inStock: true
    },
    {
        id: 5,
        name: "Cabbage",
        category: "leafy",
        price: "₹30",
        unit: "pc",
        image: "images/cabbage.webp",
        inStock: true
    },
    {
        id: 6,
        name: "Potatoes (Aloo)",
        category: "root",
        price: "₹30",
        unit: "kg",
        image: "images/potatoes.webp",
        inStock: true
    },
    {
        id: 7,
        name: "Coriander (Kothmir)",
        category: "leafy",
        price: "₹20",
        unit: "bunch",
        image: "images/coriander.webp",
        inStock: true
    },
    {
        id: 8,
        name: "Lady Finger (Bhindi)",
        category: "vegetables",
        price: "₹60",
        unit: "kg",
        image: "images/lady_finger.webp",
        inStock: true
    },
    {
        id: 9,
        name: "Bottle Gourd (Lauki)",
        category: "vegetables",
        price: "₹40",
        unit: "pc",
        image: "images/bottle_gourd.webp",
        inStock: true
    }
];

// Initialize Firebase dynamically
try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        useFirebase = true;
        console.log("🌾 Kshetriva Farms: Live Firebase Backend Connected successfully.");
    } else {
        console.log("🌾 Kshetriva Farms: Running in Local Fallback Database mode. Setup Firebase credentials to sync live online.");
        // Load offline client catalog from LocalStorage if present
        const offlineCatalog = localStorage.getItem('kshetriva_catalog');
        if (offlineCatalog) {
            try {
                products = JSON.parse(offlineCatalog);
                // Migrate legacy 'organic' category to 'vegetables'
                products.forEach(p => {
                    if (p.category === 'organic') p.category = 'vegetables';
                });
            } catch (e) {
                console.error("Failed to parse offline localStorage catalog:", e);
            }
        }
    }
} catch (e) {
    console.error("🌾 Kshetriva Farms: Backend connection exception:", e);
}

const productGrid = document.getElementById('productGrid');

// Language Translation Dictionary
const translations = {
    en: {
        logoText: "Kshetriva Farms",
        navHome: "Home",
        navAbout: "About Us",
        navHow: "How It Works",
        navProducts: "Products",
        navFarmers: "Our Farmers",
        navGallery: "Gallery",
        navReviews: "Reviews",
        heroTitle: "Fresh From Farm to Your Home",
        heroSubtitle: "No Middlemen. Fresh Vegetables. Better Prices for Families and Better Income for Farmers.",
        heroOrderBtn: "Order Now",
        heroContactBtn: "Contact Us",
        heroWhatsappBtn: " Chat on WhatsApp",
        aboutTitle: "About Kshetriva Farms",
        aboutP1Bold: "Direct Farm-to-Home Delivery:",
        aboutP1Text: " We bridge the gap between hardworking farmers and your kitchen table, cutting out the middlemen to ensure you get the freshest produce possible.",
        aboutP2Bold: "Fresh & Chemical-Safe:",
        aboutP2Text: " Our vegetables are grown with care, ensuring they are safe, healthy, and full of natural nutrients for your family.",
        aboutP3Bold: "Supporting Local Farmers:",
        aboutP3Text: " By buying directly through us, you are helping local farmers earn a fair and sustainable income for their hard work.",
        aboutP4Bold: "Transparency in Sourcing:",
        aboutP4Text: " Know exactly where your food comes from. We believe in complete transparency from the soil to your plate.",
        howTitle: "How It Works",
        howSubtitle: "A simple, transparent journey from our farms to your home",
        step1Title: "1. Farmer Harvests",
        step1Text: "Farmers pick fresh produce at peak ripeness.",
        step2Title: "2. Quality Check",
        step2Text: "Our experts ensure every item meets high standards.",
        step3Title: "3. Fresh Packaging",
        step3Text: "Produce is carefully packed to retain freshness.",
        step4Title: "4. Home Delivery",
        step4Text: "Delivered straight to your door, fast and fresh.",
        productsTitle: "Our Fresh Produce",
        productsSubtitle: "Handpicked selections delivered to you",
        filterAll: "All",
        filterLeafy: "Leafy Vegetables",
        filterRoot: "Root Vegetables",
        filterSeasonal: "Seasonal",
        filterOrganic: "Vegetables",
        filterFruits: "Fruits",
        farmersTitle: "Meet Our Farmers",
        farmersSubtitle: "The proud hands that feed our community",
        farmer1Name: "M. Surendhar Reddy",
        farmer1Story: "Surendhar has been cultivating organic root vegetables for over 15 years. His dedication to sustainable farming ensures the best quality carrots and beets.",
        farmer2Name: "N. Bhaskar Reddy",
        farmer2Story: "A pioneer in leafy greens. Bhaskar uses natural compost to grow the freshest spinach and kale. Kshetriva helps him sell directly without relying on wholesale markets.",
        farmer3Name: "P. Raju",
        farmer3Story: "Specializing in seasonal fruits, Raju's farm is a local legend for sweet mangoes and guavas. He loves seeing photos of families enjoying his harvest.",
        galleryTitle: "Farm Gallery",
        gallerySubtitle: "Glimpses of our daily farm life and deliveries",
        galleryItem1: "Lush Fields",
        galleryItem2: "Morning Harvest",
        galleryItem3: "Quality Check",
        galleryItem4: "Ready for Delivery",
        reviewsTitle: "Customer Reviews",
        reviewsSubtitle: "What families say about our farm-fresh produce",
        review1Name: "Ganesh.P",
        review1Text: '"The spinach and tomatoes were incredibly fresh! It feels so good knowing my money goes directly to the farmers. Highly recommended!"',
        review2Name: "Sanjay.T",
        review2Text: '"Ordering through WhatsApp is so easy. The delivery was prompt, and the quality of organic vegetables is unmatched in the local market."',
        review3Name: "Vamshi.A",
        review3Text: '"I loved reading the stories of the farmers on the website. The connection makes the food taste even better. Great initiative!"',
        footerDesc: "From Farm to Home — Directly. Empowering farmers and bringing health to families.",
        footerLinks: "Quick Links",
        footerContact: "Contact Us",
        footerFollow: "Follow Us",
        footerCopyright: "© 2026 Kshetriva Farms. All rights reserved.",
        basketTitle: " Your Basket",
        basketClearBtn: "Clear All",
        basketTotal: "Total:",
        basketOrderBtn: " Send Order on WhatsApp",
        basketEmpty: "Your basket is empty.",
        basketEmptySub: "Add fresh vegetables to get started!",
        confirmModalTitle: "Empty Your Basket?",
        confirmModalDesc: "Are you sure you want to clear all products from your basket?",
        confirmModalCancel: "Cancel",
        confirmModalAccept: "Clear All",

        spinachName: "Spinach (Palak)",
        carrotsName: "Carrots",
        tomatoesName: "Red Tomatoes",
        mangoesName: "Alphonso Mangoes",
        cabbageName: "Cabbage",
        potatoesName: "Potatoes (Aloo)",
        corianderName: "Coriander (Kothmir)",
        ladyfingerName: "Lady Finger (Bhindi)",
        bottlegourdName: "Bottle Gourd (Lauki)",

        unitBunch: "bunch",
        unitKg: "kg",
        unitPc: "pc",
        unitDozen: "dozen",

        btnAddToBasket: "Add to Basket",
        btnAdded: "✓ Added!",
        btnReset: "✓ Reset!",
        emailCopied: " Email copied to clipboard!",
        outOfStock: "Out of Stock",
        btnOutOfStock: "Out of Stock"
    },
    te: {
        logoText: "క్షేత్రీవ ఫార్మ్స్",
        navHome: "హోమ్",
        navAbout: "మా గురించి",
        navHow: "ఇది ఎలా పనిచేస్తుంది",
        navProducts: "ఉత్పత్తులు",
        navFarmers: "మా రైతులు",
        navGallery: "గ్యాలరీ",
        navReviews: "సమీక్షలు",
        heroTitle: "పొలం నుండి నేరుగా మీ ఇంటికి తాజా కూరగాయలు",
        heroSubtitle: "మధ్యవర్తులు లేరు. తాజా కూరగాయలు. కుటుంబాలకు మంచి ధరలు మరియు రైతులకు మెరుగైన ఆదాయం.",
        heroOrderBtn: "ఇప్పుడే ఆర్డర్ చేయండి",
        heroContactBtn: "మమ్మల్ని సంప్రదించండి",
        heroWhatsappBtn: " వాట్సాప్‌లో చాట్ చేయండి",
        aboutTitle: "క్షేత్రీవ ఫార్మ్స్ గురించి",
        aboutP1Bold: "నేరుగా పొలం నుండి ఇంటికి డెలివరీ:",
        aboutP1Text: " కష్టపడి పనిచేసే రైతులకు మరియు మీ వంటగదికి మధ్య మేము వారధిగా ఉంటాము, మధ్యవర్తులను తొలగించి మీకు సాధ్యమైనంత తాజా ఉత్పత్తులు అందేలా చూస్తాము.",
        aboutP2Bold: "తాజా & రసాయన రహిత:",
        aboutP2Text: " మా కూరగాయలు ఎంతో శ్రద్ధతో పండిస్తారు, అవి మీ కుటుంబానికి సురక్షితమైనవి, ఆరోగ్యకరమైనవి మరియు సహజమైన పోషకాలతో నిండి ఉండేలా చూస్తాము.",
        aboutP3Bold: "స్థానిక రైతులకు మద్దతు:",
        aboutP3Text: " మా ద్వారా నేరుగా కొనుగోలు చేయడం ద్వారా, స్థానిక రైతులు వారి కష్టానికి తగిన మరియు స్థిరమైన ఆదాయాన్ని పొందడానికి మీరు సహాయం చేస్తున్నారు.",
        aboutP4Bold: "మూలాల్లో పారదర్శకత:",
        aboutP4Text: " మీ ఆహారం ఎక్కడి నుండి వస్తుందో ఖచ్చితంగా తెలుసుకోండి. మట్టి నుండి మీ ప్లేట్ వరకు పూర్తి పారదర్శకతను మేము నమ్ముతాము.",
        howTitle: "ఇది ఎలా పనిచేస్తుంది",
        howSubtitle: "మా పొలాల నుండి మీ ఇంటికి ఒక సరళమైన, పారదర్శక ప్రయాణం",
        step1Title: "1. రైతు కోత కోస్తారు",
        step1Text: "రైతులు పూర్తి పక్వానికి వచ్చిన తాజా ఉత్పత్తులను కోస్తారు.",
        step2Title: "2. నాణ్యత తనిఖీ",
        step2Text: "ప్రతి వస్తువు ఉన్నత ప్రమాణాలకు అనుగుణంగా ఉందని మా నిపుణులు నిర్ధారిస్తారు.",
        step3Title: "3. తాజా ప్యాకేజింగ్",
        step3Text: "తాజాదనాన్ని నిలుపుకోవడానికి ఉత్పత్తులు జాగ్రత్తగా ప్యాక్ చేయబడతాయి.",
        step4Title: "4. ఇంటి వద్దకే డెలివరీ",
        step4Text: "తాజాగా మరియు వేగంగా నేరుగా మీ ఇంటి వద్దకే డెలివరీ చేయబడుతుంది.",
        productsTitle: "మా తాజా ఉత్పత్తులు",
        productsSubtitle: "మీ కోసం చేతితో ఎంపిక చేసిన తాజా ఉత్పత్తులు",
        filterAll: "అన్నీ",
        filterLeafy: "ఆకుకూరలు",
        filterRoot: "దుంపలు",
        filterSeasonal: "సీజనల్",
        filterOrganic: "కూరగాయలు",
        filterFruits: "పండ్లు",
        farmersTitle: "మా రైతులను కలవండి",
        farmersSubtitle: "మన సమాజానికి ఆహారాన్ని అందించే గర్వించదగిన హస్తాలు",
        farmer1Name: "ఎమ్. సురేందర్ రెడ్డి",
        farmer1Story: "సురేందర్ 15 సంవత్సరాలకు పైగా సేంద్రీయ దుంప కూరగాయలను పండిస్తున్నారు. స్థిరమైన వ్యవసాయం పట్ల ఆయనకున్న అంకితభావం ఉత్తమ నాణ్యమైన క్యారెట్లు మరియు బీట్‌రూట్‌లను నిర్ధారిస్తుంది.",
        farmer2Name: "ఎన్. భాస్కర్ రెడ్డి",
        farmer2Story: "ఆకుకూరల పెంపకంలో మార్గదర్శకుడు. భాస్కర్ అత్యంత తాజా పాలకూర మరియు కేల్‌ను పండించడానికి సహజ ఎరువులను ఉపయోగిస్తారు. క్షేత్రీవ హోల్‌సేల్ మార్కెట్లపై ఆధారపడకుండా నేరుగా విక్రయించడానికి ఆయనకు సహాయం చేస్తుంది.",
        farmer3Name: "పి. రాజు",
        farmer3Story: "సీజనల్ పండ్ల పెంపకంలో నైపుణ్యం కలిగిన రాజు తోట తీపి మామిడి మరియు జామకాయలకు స్థానికంగా ఎంతో ప్రసిద్ధి చెందింది. కుటుంబాలు తన పంటను ఆస్వాదిస్తున్న ఫోటోలను చూడటం ఆయనకు చాలా ఇష్టం.",
        galleryTitle: "ఫార్మ్ గ్యాలరీ",
        gallerySubtitle: "మా రోజువారీ వ్యవసాయ జీవితం మరియు డెలివరీల جھలకలు",
        galleryItem1: "పచ్చని పొలాలు",
        galleryItem2: "ఉదయపు కోత",
        galleryItem3: "నాణ్యత తనిఖీ",
        galleryItem4: "డెలివరీకి సిద్ధం",
        reviewsTitle: "వినియోగదారుల సమీక్షలు",
        reviewsSubtitle: "మా పొలం-తాజా ఉత్పత్తుల గురించి కుటుంబాలు ఏమంటున్నాయి",
        review1Name: "గణేష్.పి",
        review1Text: '"పాలకూర మరియు టమోటాలు చాలా తాజాగా ఉన్నాయి! నా డబ్బు నేరుగా రైతులకే వెళుతుందని తెలియడం చాలా సంతోషంగా ఉంది. తప్పకుండా కొనండి!"',
        review2Name: "సంజయ్.టి",
        review2Text: '"వాట్సాప్ ద్వారా ఆర్డర్ చేయడం చాలా సులభం. డెలివరీ చాలా త్వరగా జరిగింది, మరియు సేంద్రీయ కూరగాయల నాణ్యత స్థానిక మార్కెట్లో మరెక్కడా లభించదు."',
        review3Name: "వంశీ.ఎ",
        review3Text: '"వెబ్‌సైట్‌లో రైతుల కథలు చదవడం నాకు చాలా నచ్చింది. ఈ అనుబంధం ఆహారాన్ని మరింత రుచిగా చేస్తుంది. గొప్ప ప్రయత్నం!"',
        footerDesc: "పొలం నుండి నేరుగా ఇంటికి. రైతుల సబలీకరణ మరియు కుటుంబాల ఆరోగ్యం.",
        footerLinks: "త్వరిత లింకులు",
        footerContact: "మమ్మల్ని సంప్రదించండి",
        footerFollow: "మమ్మల్ని అనుసరించండి",
        footerCopyright: "© 2026 క్షేత్రీవ ఫార్మ్స్. అన్ని హక్కులు ప్రత్యేకించబడ్డాయి.",
        basketTitle: " మీ బాస్కెట్",
        basketClearBtn: "అన్నీ తీసివేయి",
        basketTotal: "మొత్తం:",
        basketOrderBtn: " వాట్సాప్‌లో ఆర్డర్ పంపండి",
        basketEmpty: "మీ బాస్కెట్ ఖాళీగా ఉంది.",
        basketEmptySub: "ప్రారంభించడానికి తాజా కూరగాయలను జోడించండి!",
        confirmModalTitle: "మీ బాస్కెట్‌ను ఖాళీ చేయాలా?",
        confirmModalDesc: "మీ బాస్కెట్ నుండి అన్ని ఉత్పత్తులను తొలగించాలనుకుంటున్నారా?",
        confirmModalCancel: "రద్దు చేయి",
        confirmModalAccept: "అన్నీ తీసివేయి",

        spinachName: "పాలకూర (పాలక్)",
        carrotsName: "క్యారెట్లు",
        tomatoesName: "ఎర్రటి టమోటాలు",
        mangoesName: "అల్ఫోన్సో మామిడి పండ్లు",
        cabbageName: "క్యాబేజీ",
        potatoesName: "బంగాళాదుంపలు (ఆలూ)",
        corianderName: "కొత్తిమీర",
        ladyfingerName: "బెండకాయలు (భిండి)",
        bottlegourdName: "ఆనపకాయ/సొరకాయ (లౌకి)",

        unitBunch: "కట్ట",
        unitKg: "కిలో",
        unitPc: "ముక్క / కాయ",
        unitDozen: "డజను",

        btnAddToBasket: "బాస్కెట్‌కు జోడించు",
        btnAdded: "✓ జోడించబడింది!",
        btnReset: "✓ రీసెట్!",
        emailCopied: " ఈమెయిల్ క్లిప్‌బోర్డ్‌కు కాపీ చేయబడింది!",
        outOfStock: "స్టాక్ లేదు",
        btnOutOfStock: "స్టాక్ లేదు"
    }
};

let currentLang = localStorage.getItem('kshetriva_lang') || 'en';

function applyLanguage() {
    const dict = translations[currentLang];

    // 1. Update Lang Selector sliding toggle states
    const langToggle = document.getElementById('langToggle');
    const langOptEn = document.getElementById('langOptEn');
    const langOptTe = document.getElementById('langOptTe');
    if (langToggle && langOptEn && langOptTe) {
        if (currentLang === 'te') {
            langToggle.classList.add('te-active');
            langOptTe.classList.add('active');
            langOptEn.classList.remove('active');
        } else {
            langToggle.classList.remove('te-active');
            langOptTe.classList.remove('active');
            langOptEn.classList.add('active');
        }
    }

    // Fallback: support older cached HTML button langBtn
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = currentLang === 'en' ? 'TE' : 'EN';
    }

    // 2. Translate Static Elements

    // Logo
    document.querySelectorAll('.logo span').forEach(el => el.textContent = dict.logoText);

    // Nav Links
    const homeLink = document.querySelector('.nav-links a[href="#home"]');
    if (homeLink) homeLink.textContent = dict.navHome;
    const aboutLink = document.querySelector('.nav-links a[href="#about"]');
    if (aboutLink) aboutLink.textContent = dict.navAbout;
    const howLink = document.querySelector('.nav-links a[href="#how-it-works"]');
    if (howLink) howLink.textContent = dict.navHow;
    const productsLink = document.querySelector('.nav-links a[href="#products"]');
    if (productsLink) productsLink.textContent = dict.navProducts;
    const farmersLink = document.querySelector('.nav-links a[href="#farmers"]');
    if (farmersLink) farmersLink.textContent = dict.navFarmers;
    const galleryLink = document.querySelector('.nav-links a[href="#gallery"]');
    if (galleryLink) galleryLink.textContent = dict.navGallery;
    const reviewsLink = document.querySelector('.nav-links a[href="#reviews"]');
    if (reviewsLink) reviewsLink.textContent = dict.navReviews;

    // Hero
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) heroTitle.textContent = dict.heroTitle;
    const heroSubtitle = document.querySelector('.hero-content p');
    if (heroSubtitle) heroSubtitle.textContent = dict.heroSubtitle;
    const heroOrder = document.querySelector('.hero-btns .btn-primary');
    if (heroOrder) heroOrder.textContent = dict.heroOrderBtn;
    const heroContact = document.querySelector('.hero-btns .btn-secondary');
    if (heroContact) heroContact.textContent = dict.heroContactBtn;
    const heroWhatsapp = document.querySelector('.hero-btns .btn-whatsapp');
    if (heroWhatsapp) {
        heroWhatsapp.innerHTML = `<i class="fa-brands fa-whatsapp"></i> ${dict.heroWhatsappBtn}`;
    }

    // About
    const aboutHeader = document.querySelector('.about-text h3');
    if (aboutHeader) aboutHeader.textContent = dict.aboutTitle;

    const aboutPs = document.querySelectorAll('.about-text p');
    if (aboutPs.length >= 4) {
        aboutPs[0].innerHTML = `<strong>${dict.aboutP1Bold}</strong>${dict.aboutP1Text}`;
        aboutPs[1].innerHTML = `<strong>${dict.aboutP2Bold}</strong>${dict.aboutP2Text}`;
        aboutPs[2].innerHTML = `<strong>${dict.aboutP3Bold}</strong>${dict.aboutP3Text}`;
        aboutPs[3].innerHTML = `<strong>${dict.aboutP4Bold}</strong>${dict.aboutP4Text}`;
    }

    // How It Works
    const howHeader = document.querySelector('.how-it-works .section-title');
    if (howHeader) howHeader.textContent = dict.howTitle;
    const howSubtitle = document.querySelector('.how-it-works .section-subtitle');
    if (howSubtitle) howSubtitle.textContent = dict.howSubtitle;

    const steps = document.querySelectorAll('.step');
    if (steps.length >= 4) {
        steps[0].querySelector('h4').textContent = dict.step1Title;
        steps[0].querySelector('p').textContent = dict.step1Text;
        steps[1].querySelector('h4').textContent = dict.step2Title;
        steps[1].querySelector('p').textContent = dict.step2Text;
        steps[2].querySelector('h4').textContent = dict.step3Title;
        steps[2].querySelector('p').textContent = dict.step3Text;
        steps[3].querySelector('h4').textContent = dict.step4Title;
        steps[3].querySelector('p').textContent = dict.step4Text;
    }

    // Products Titles
    const pTitle = document.querySelector('.products .section-title');
    if (pTitle) pTitle.textContent = dict.productsTitle;
    const pSubtitle = document.querySelector('.products .section-subtitle');
    if (pSubtitle) pSubtitle.textContent = dict.productsSubtitle;

    // Category Filters
    const filterBtnsEl = document.querySelectorAll('.category-filter .filter-btn');
    filterBtnsEl.forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        if (filter === 'all') btn.textContent = dict.filterAll;
        else if (filter === 'leafy') btn.textContent = dict.filterLeafy;
        else if (filter === 'root') btn.textContent = dict.filterRoot;
        else if (filter === 'seasonal') btn.textContent = dict.filterSeasonal;
        else if (filter === 'vegetables') btn.textContent = dict.filterOrganic;
        else if (filter === 'fruits') btn.textContent = dict.filterFruits;
    });

    // Farmers Titles
    const fTitle = document.querySelector('.farmers .section-title');
    if (fTitle) fTitle.textContent = dict.farmersTitle;
    const fSubtitle = document.querySelector('.farmers .section-subtitle');
    if (fSubtitle) fSubtitle.textContent = dict.farmersSubtitle;

    // Farmers Cards
    const farmerCards = document.querySelectorAll('.farmer-card');
    if (farmerCards.length >= 3) {
        farmerCards[0].querySelector('h4').textContent = dict.farmer1Name;
        farmerCards[0].querySelector('.farmer-story').textContent = dict.farmer1Story;

        farmerCards[1].querySelector('h4').textContent = dict.farmer2Name;
        farmerCards[1].querySelector('.farmer-story').textContent = dict.farmer2Story;

        farmerCards[2].querySelector('h4').textContent = dict.farmer3Name;
        farmerCards[2].querySelector('.farmer-story').textContent = dict.farmer3Story;
    }

    // Gallery Section
    const gTitle = document.querySelector('.gallery .section-title');
    if (gTitle) gTitle.textContent = dict.galleryTitle;
    const gSubtitle = document.querySelector('.gallery .section-subtitle');
    if (gSubtitle) gSubtitle.textContent = dict.gallerySubtitle;

    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length >= 4) {
        galleryItems[0].querySelector('.gallery-overlay h4').textContent = dict.galleryItem1;
        galleryItems[1].querySelector('.gallery-overlay h4').textContent = dict.galleryItem2;
        galleryItems[2].querySelector('.gallery-overlay h4').textContent = dict.galleryItem3;
        galleryItems[3].querySelector('.gallery-overlay h4').textContent = dict.galleryItem4;
    }

    // Reviews Section
    const rTitle = document.querySelector('.reviews .section-title');
    if (rTitle) rTitle.textContent = dict.reviewsTitle;
    const rSubtitle = document.querySelector('.reviews .section-subtitle');
    if (rSubtitle) rSubtitle.textContent = dict.reviewsSubtitle;

    const reviewCards = document.querySelectorAll('.review-card');
    if (reviewCards.length >= 3) {
        reviewCards[0].querySelector('.review-header-name h4').textContent = dict.review1Name;
        reviewCards[0].querySelector('p').textContent = dict.review1Text;

        reviewCards[1].querySelector('.review-header-name h4').textContent = dict.review2Name;
        reviewCards[1].querySelector('p').textContent = dict.review2Text;

        reviewCards[2].querySelector('.review-header-name h4').textContent = dict.review3Name;
        reviewCards[2].querySelector('p').textContent = dict.review3Text;
    }

    // Footer Section
    const footerDesc = document.querySelector('footer .footer-col:nth-child(1) p');
    if (footerDesc) footerDesc.textContent = dict.footerDesc;

    const footerHeaders = document.querySelectorAll('footer .footer-col h4');
    if (footerHeaders.length >= 3) {
        footerHeaders[0].textContent = dict.footerLinks;
        footerHeaders[1].textContent = dict.footerContact;
        footerHeaders[2].textContent = dict.footerFollow;
    }

    const footerCopyright = document.getElementById('copyrightText');
    if (footerCopyright) footerCopyright.textContent = dict.footerCopyright;

    // Cart Drawer Header & Footer
    const cartHeaderTitle = document.querySelector('.cart-drawer-header h3');
    if (cartHeaderTitle) {
        cartHeaderTitle.innerHTML = `<i class="fa-solid fa-shopping-basket"></i> ${dict.basketTitle}`;
    }

    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) clearCartBtn.textContent = dict.basketClearBtn;

    const cartTotalLabel = document.querySelector('.cart-total-row span:first-child');
    if (cartTotalLabel) cartTotalLabel.textContent = dict.basketTotal;

    const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
    if (whatsappOrderBtn) {
        whatsappOrderBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> ${dict.basketOrderBtn}`;
    }

    // Confirm Modal
    const modalTitle = document.querySelector('.confirm-modal-content h3');
    if (modalTitle) modalTitle.textContent = dict.confirmModalTitle;

    const modalDesc = document.querySelector('.confirm-modal-content p');
    if (modalDesc) modalDesc.textContent = dict.confirmModalDesc;

    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    if (cancelConfirmBtn) cancelConfirmBtn.textContent = dict.confirmModalCancel;

    const acceptConfirmBtn = document.getElementById('acceptConfirmBtn');
    if (acceptConfirmBtn) acceptConfirmBtn.textContent = dict.confirmModalAccept;

    // Toast Notification text
    const toastNotification = document.getElementById('toastNotification');
    if (toastNotification) {
        toastNotification.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${dict.emailCopied}`;
    }
}

function getTranslatedProduct(product) {
    const dict = translations[currentLang];
    let name = product.name;
    let unit = product.unit;

    // Dynamic Firestore Localization
    if (product.name_en && product.name_te) {
        name = currentLang === 'te' ? product.name_te : product.name_en;
    } else {
        // Fallback to static dictionary translating for standard seeds
        if (product.id === 1) { name = dict.spinachName; }
        else if (product.id === 2) { name = dict.carrotsName; }
        else if (product.id === 3) { name = dict.tomatoesName; }
        else if (product.id === 4) { name = dict.mangoesName; }
        else if (product.id === 5) { name = dict.cabbageName; }
        else if (product.id === 6) { name = dict.potatoesName; }
        else if (product.id === 7) { name = dict.corianderName; }
        else if (product.id === 8) { name = dict.ladyfingerName; }
        else if (product.id === 9) { name = dict.bottlegourdName; }
    }

    if (product.unit === 'bunch') { unit = dict.unitBunch; }
    else if (product.unit === 'kg') { unit = dict.unitKg; }
    else if (product.unit === 'pc') { unit = dict.unitPc; }
    else if (product.unit === 'dozen') { unit = dict.unitDozen; }

    return { ...product, name, unit };
}

const filterBtns = document.querySelectorAll('.filter-btn');

// Global Cart State
let cart = {};

// Get Cart Elements
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartBadge = document.getElementById('cartBadge');
const cartDrawerItems = document.getElementById('cartDrawerItems');
const cartTotalSum = document.getElementById('cartTotalSum');
const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
const cartFloatBtn = document.getElementById('cartFloatBtn');
const cartBadgeFloat = document.getElementById('cartBadgeFloat');

// Load Cart from LocalStorage
function loadCart() {
    const stored = localStorage.getItem('kshetriva_cart');
    if (stored) {
        try {
            cart = JSON.parse(stored);
        } catch (e) {
            cart = {};
        }
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('kshetriva_cart', JSON.stringify(cart));
}

// Open/Close Cart Drawer
function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
}

function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
}

// Render Products Grid (Supports real-time out of stock cards dynamically)
function renderProducts(category = 'all') {
    productGrid.innerHTML = '';

    const filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    filteredProducts.forEach(rawProduct => {
        const product = getTranslatedProduct(rawProduct);
        const currentQty = cart[product.id] || 0;
        const card = document.createElement('div');

        const isOutOfStock = rawProduct.inStock === false;
        card.className = isOutOfStock ? 'product-card out-of-stock' : 'product-card';

        const outOfStockBadge = isOutOfStock
            ? `<div class="out-of-stock-overlay">${translations[currentLang].outOfStock}</div>`
            : '';

        const buttonText = isOutOfStock
            ? translations[currentLang].btnOutOfStock
            : translations[currentLang].btnAddToBasket;

        const buttonDisabled = isOutOfStock ? 'disabled style="pointer-events: none;"' : '';

        card.innerHTML = `
            ${outOfStockBadge}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h4 class="product-title">${product.name}</h4>
                <p class="product-price">${product.price} / ${product.unit}</p>
                <div class="quantity-selector">
                    <button class="qty-btn minus" onclick="updateQty(this, -1, ${product.id})" ${isOutOfStock ? 'disabled' : ''}>-</button>
                    <span class="qty-val" id="qty-${product.id}">${currentQty}</span>
                    <button class="qty-btn plus" onclick="updateQty(this, 1, ${product.id})" ${isOutOfStock ? 'disabled' : ''}>+</button>
                </div>
                <button class="btn btn-primary btn-add-basket" id="btn-add-${product.id}" onclick="addProductToCart(${product.id})" ${buttonDisabled}>${buttonText}</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Update Quantity in Card DOM
function updateQty(btn, change, productId) {
    const qtySpan = btn.parentElement.querySelector('.qty-val');
    let currentQty = parseInt(qtySpan.textContent);
    let newQty = currentQty + change;
    if (newQty < 0) newQty = 0;
    qtySpan.textContent = newQty;
}

// Add Product to Cart from Card Selection
function addProductToCart(productId) {
    const qtySpan = document.getElementById(`qty-${productId}`);
    if (!qtySpan) return;

    let qty = parseInt(qtySpan.textContent);

    if (qty === 0) {
        if (cart[productId] !== undefined) {
            delete cart[productId];
            saveCart();
            updateCartUI();

            // Visual button feedback for reset
            const btn = document.getElementById(`btn-add-${productId}`);
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = translations[currentLang].btnReset;
                btn.style.backgroundColor = "#d32f2f";
                btn.style.borderColor = "#d32f2f";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = "";
                    btn.style.borderColor = "";
                }, 1200);
            }

            triggerCartHighlight();
        }
        return;
    }

    cart[productId] = qty;
    saveCart();
    updateCartUI();

    // Visual button feedback for add
    const btn = document.getElementById(`btn-add-${productId}`);
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = translations[currentLang].btnAdded;
        btn.style.backgroundColor = "#2e7d32";
        btn.style.borderColor = "#2e7d32";
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "";
            btn.style.borderColor = "";
        }, 1200);
    }

    triggerCartHighlight();
}

function triggerCartHighlight() {
    if (cartBtn) {
        cartBtn.classList.remove('highlight');
        void cartBtn.offsetWidth;
        cartBtn.classList.add('highlight');
        setTimeout(() => { cartBtn.classList.remove('highlight'); }, 800);
    }
    if (cartFloatBtn) {
        cartFloatBtn.classList.remove('highlight');
        void cartFloatBtn.offsetWidth;
        cartFloatBtn.classList.add('highlight');
        setTimeout(() => { cartFloatBtn.classList.remove('highlight'); }, 800);
    }
}

// Update Quantity inside the Cart Drawer
function updateCartItemQty(productId, change) {
    if (!cart[productId]) return;
    cart[productId] += change;

    if (cart[productId] <= 0) {
        delete cart[productId];
        const qtySpan = document.getElementById(`qty-${productId}`);
        if (qtySpan) qtySpan.textContent = '0';
    } else {
        const qtySpan = document.getElementById(`qty-${productId}`);
        if (qtySpan) qtySpan.textContent = cart[productId];
    }

    saveCart();
    updateCartUI();
}

// Refresh Cart UI
function updateCartUI() {
    const totalItems = Object.values(cart).reduce((sum, q) => sum + q, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    if (cartBadgeFloat) {
        cartBadgeFloat.textContent = totalItems;
        cartBadgeFloat.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    const cartKeys = Object.keys(cart);
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
        clearBtn.style.display = cartKeys.length > 0 ? 'inline-block' : 'none';
    }

    cartDrawerItems.innerHTML = '';
    let totalSum = 0;

    if (cartKeys.length === 0) {
        cartDrawerItems.innerHTML = `
            <div class="cart-empty-state">
                <i class="fa-solid fa-shopping-basket"></i>
                <p>${translations[currentLang].basketEmpty}</p>
                <p style="font-size: 0.85rem; margin-top: 5px; color: #aaa;">${translations[currentLang].basketEmptySub}</p>
            </div>
        `;
        cartTotalSum.textContent = '₹0';
        whatsappOrderBtn.disabled = true;
        whatsappOrderBtn.style.opacity = '0.5';
        whatsappOrderBtn.style.cursor = 'not-allowed';
        return;
    }

    whatsappOrderBtn.disabled = false;
    whatsappOrderBtn.style.opacity = '1';
    whatsappOrderBtn.style.cursor = 'pointer';

    cartKeys.forEach(idStr => {
        const id = parseInt(idStr);
        const rawProduct = products.find(p => p.id === id);
        if (!rawProduct) return;

        const product = getTranslatedProduct(rawProduct);
        const qty = cart[id];
        const priceNum = parseInt(product.price.replace(/[^\d]/g, ''));
        const itemTotal = priceNum * qty;
        totalSum += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${product.name}</div>
                <div class="cart-item-price">${product.price} / ${product.unit}</div>
            </div>
            <div class="cart-item-actions">
                <button class="cart-item-btn" onclick="updateCartItemQty(${id}, -1)">-</button>
                <span class="cart-item-qty">${qty}</span>
                <button class="cart-item-btn" onclick="updateCartItemQty(${id}, 1)">+</button>
            </div>
        `;
        cartDrawerItems.appendChild(itemEl);
    });

    cartTotalSum.textContent = `₹${totalSum}`;
}

// Custom Confirmation Modal Elements
const confirmModal = document.getElementById('confirmModal');
const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
const acceptConfirmBtn = document.getElementById('acceptConfirmBtn');

function clearCart() {
    if (confirmModal) {
        confirmModal.classList.add('open');
    }
}

function closeConfirmModal() {
    if (confirmModal) {
        confirmModal.classList.remove('open');
    }
}

if (cancelConfirmBtn && acceptConfirmBtn) {
    cancelConfirmBtn.addEventListener('click', closeConfirmModal);
    acceptConfirmBtn.addEventListener('click', () => {
        cart = {};
        saveCart();
        updateCartUI();
        renderProducts();
        closeConfirmModal();
    });
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });
}

// WhatsApp Cart Checkout Order compilation
function sendCartWhatsAppOrder() {
    const cartKeys = Object.keys(cart);
    if (cartKeys.length === 0) return;

    const isTe = currentLang === 'te';
    let message = isTe ? `*కొత్త ఆర్డర్ - క్షేత్రీవ ఫార్మ్స్*\n` : `*New Order - Kshetriva Farms*\n`;
    message += `===============================\n`;

    let totalSum = 0;
    cartKeys.forEach((idStr, index) => {
        const id = parseInt(idStr);
        const rawProduct = products.find(p => p.id === id);
        if (rawProduct) {
            const product = getTranslatedProduct(rawProduct);
            const qty = cart[id];
            const priceNum = parseInt(product.price.replace(/[^\d]/g, ''));
            const itemTotal = priceNum * qty;
            totalSum += itemTotal;
            message += `${index + 1}. *${product.name}* - ${qty} ${product.unit} (₹${itemTotal})\n`;
        }
    });

    message += `===============================\n`;
    message += isTe ? `*మొత్తం చెల్లింపు:* ₹${totalSum}\n\n` : `*Total Amount:* ₹${totalSum}\n\n`;
    message += isTe ? `దయచేసి నా ఆర్డర్‌ను ధృవీకరించండి మరియు డెలివరీ వివరాలను తెలపండి.\n` : `Please confirm my order and let me know delivery details.\n`;
    message += isTe ? `_డెలివరీ చిరునామా వివరాలు ఇక్కడ షేర్ చేయబడతాయి._` : `_Delivery Address details will be shared._`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/918374276995?text=${encoded}`, '_blank');
}

// Attach Event Listeners
cartBtn.addEventListener('click', openCart);
if (cartFloatBtn) {
    cartFloatBtn.addEventListener('click', openCart);
}
const langToggle = document.getElementById('langToggle') || document.getElementById('langBtn');
if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'te' : 'en';
        localStorage.setItem('kshetriva_lang', currentLang);
        applyLanguage();
        renderProducts();
        updateCartUI();
        if (isAdminLoggedIn()) {
            renderAdminProducts();
        }
    });
}
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
whatsappOrderBtn.addEventListener('click', sendCartWhatsAppOrder);

// Filtering Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        renderProducts(filter);
    });
});

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobileBtn');
const navLinks = document.getElementById('navLinks');

mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
    } else {
        navbar.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
    }
});

// Clipboard Copy & Toast Notification for Email Contact
const emailContactBtn = document.getElementById('emailContactBtn');
const toastNotification = document.getElementById('toastNotification');

if (emailContactBtn && toastNotification) {
    emailContactBtn.addEventListener('click', (e) => {
        navigator.clipboard.writeText('farm@kshetrivafarms.com').then(() => {
            toastNotification.classList.add('show');
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, 3000);
        }).catch(err => {
            console.error('Failed to copy email address: ', err);
        });
    });
}


/* ==========================================================================
   Admin Operations & Database Syncing Logic
   ========================================================================== */

// Seeding Firestore Database on initial load if empty
function seedDatabase() {
    if (!useFirebase || !db) return;
    console.log("Seeding Firestore with default catalog...");
    const batch = db.batch();
    const collectionRef = db.collection("products");

    const defaultCatalog = [
        { id: 1, name: "Spinach (Palak)", category: "leafy", price: "₹40", unit: "bunch", image: "images/spinach.webp", inStock: true },
        { id: 2, name: "Carrots", category: "root", price: "₹60", unit: "kg", image: "images/carrots.webp", inStock: true },
        { id: 3, name: "Red Tomatoes", category: "vegetables", price: "₹50", unit: "kg", image: "images/tomatoes.webp", inStock: true },
        { id: 4, name: "Alphonso Mangoes", category: "fruits", price: "₹400", unit: "dozen", image: "images/mangoes.webp", inStock: true },
        { id: 5, name: "Cabbage", category: "leafy", price: "₹30", unit: "pc", image: "images/cabbage.webp", inStock: true },
        { id: 6, name: "Potatoes (Aloo)", category: "root", price: "₹30", unit: "kg", image: "images/potatoes.webp", inStock: true },
        { id: 7, name: "Coriander (Kothmir)", category: "leafy", price: "₹20", unit: "bunch", image: "images/coriander.webp", inStock: true },
        { id: 8, name: "Lady Finger (Bhindi)", category: "vegetables", price: "₹60", unit: "kg", image: "images/lady_finger.webp", inStock: true },
        { id: 9, name: "Bottle Gourd (Lauki)", category: "vegetables", price: "₹40", unit: "pc", image: "images/bottle_gourd.webp", inStock: true }
    ];

    defaultCatalog.forEach((item) => {
        const docRef = collectionRef.doc(`prod_${item.id}`);
        batch.set(docRef, item);
    });

    batch.commit().then(() => {
        console.log("Database seeded successfully.");
    }).catch(err => console.error("Database seeding failed:", err));
}

// Router for hidden hash #admin route
window.addEventListener('hashchange', checkHashRoute);
window.addEventListener('load', checkHashRoute);

function checkHashRoute() {
    if (window.location.hash === '#admin') {
        openAdminPortal();
    } else {
        closeAdminPortal();
    }
}

function openAdminPortal() {
    if (isAdminLoggedIn()) {
        openAdminDashboard();
    } else {
        openAdminLogin();
    }
}

function closeAdminPortal() {
    document.getElementById('adminLoginModal').classList.remove('open');
    document.getElementById('adminDashboardOverlay').classList.remove('open');
    if (window.location.hash === '#admin') {
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }
}

function isAdminLoggedIn() {
    if (useFirebase && auth) {
        return auth.currentUser !== null;
    }
    return sessionStorage.getItem('kshetriva_admin_session') === 'active';
}

function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('open');
    document.getElementById('adminDashboardOverlay').classList.remove('open');
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('open');
}

function openAdminDashboard() {
    document.getElementById('adminLoginModal').classList.remove('open');
    document.getElementById('adminDashboardOverlay').classList.add('open');
    renderAdminProducts();
    updateAdminStats();
}

function closeAdminDashboard() {
    document.getElementById('adminDashboardOverlay').classList.remove('open');
}

// Login authentication trigger
function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('adminLoginError');

    errorDiv.style.display = 'none';

    if (useFirebase && auth) {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                closeAdminLogin();
                openAdminDashboard();
            })
            .catch((err) => {
                errorDiv.textContent = "Firebase Error: " + err.message;
                errorDiv.style.display = 'block';
            });
    } else {
        // Fallback offline mock session
        if (email === 'admin@kshetrivafarms.com' && password === 'admin123') {
            sessionStorage.setItem('kshetriva_admin_session', 'active');
            closeAdminLogin();
            openAdminDashboard();
        } else {
            errorDiv.textContent = "Invalid fallback credentials (use admin@kshetrivafarms.com and admin123)";
            errorDiv.style.display = 'block';
        }
    }
}

// Logout authentication trigger
function handleAdminLogout() {
    if (useFirebase && auth) {
        auth.signOut().then(() => {
            closeAdminDashboard();
            closeAdminPortal();
        }).catch(err => console.error("Signout error:", err));
    } else {
        sessionStorage.removeItem('kshetriva_admin_session');
        closeAdminDashboard();
        closeAdminPortal();
    }
}

// Sync fallback mock products database changes locally
function saveProductsLocal() {
    if (!useFirebase) {
        localStorage.setItem('kshetriva_catalog', JSON.stringify(products));
        renderProducts();
        updateCartUI();
        renderAdminProducts();
        updateAdminStats();
    }
}

// Render Dashboard products list
function renderAdminProducts() {
    const listContainer = document.getElementById('adminProductsList');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    products.forEach((rawProduct) => {
        const product = getTranslatedProduct(rawProduct);
        const tr = document.createElement('tr');

        const catLabel = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        const isChecked = product.inStock !== false ? 'checked' : '';

        const stockStatusText = product.inStock !== false
            ? `<span class="admin-stock-indicator in-stock"><i class="fa-solid fa-check-circle"></i> In Stock</span>`
            : `<span class="admin-stock-indicator out-of-stock"><i class="fa-solid fa-circle-xmark"></i> Out of Stock</span>`;

        tr.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}" class="admin-table-img"></td>
            <td>
                <div class="admin-table-title">${product.name_en || product.name}</div>
                <div class="admin-table-subtitle">${product.name_te || ''}</div>
            </td>
            <td><span class="admin-table-badge ${product.category}">${catLabel}</span></td>
            <td><strong>${product.price}</strong> / ${product.unit}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <label class="stock-toggle">
                        <input type="checkbox" onchange="toggleProductStock('${product.docId || ''}', ${product.id}, this.checked)" ${isChecked}>
                        <span class="stock-slider"></span>
                    </label>
                    ${stockStatusText}
                </div>
            </td>
            <td>
                <div class="admin-action-btns">
                    <button class="admin-action-btn edit" onclick="editProductModal('${product.docId || ''}', ${product.id})" title="Edit Product"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="admin-action-btn delete" onclick="deleteProduct('${product.docId || ''}', ${product.id})" title="Delete Product"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        `;
        listContainer.appendChild(tr);
    });
}

// Update Dashboard Counter statistics
function updateAdminStats() {
    const totalEl = document.getElementById('statTotalProducts');
    const inStockEl = document.getElementById('statInStock');
    const outStockEl = document.getElementById('statOutOfStock');

    if (!totalEl || !inStockEl || !outStockEl) return;

    const total = products.length;
    const inStock = products.filter(p => p.inStock !== false).length;
    const outStock = total - inStock;

    totalEl.textContent = total;
    inStockEl.textContent = inStock;
    outStockEl.textContent = outStock;
}

// Toggle Stock level dynamically
function toggleProductStock(docId, id, isChecked) {
    if (useFirebase && db && docId) {
        db.collection("products").doc(docId).update({
            inStock: isChecked
        }).then(() => {
            console.log("Live Stock status synced successfully.");
        }).catch(err => console.error("Firestore stock update error:", err));
    } else {
        const product = products.find(p => p.id === id);
        if (product) {
            product.inStock = isChecked;
            saveProductsLocal();
        }
    }
}

// Product CRUD Editor Actions
const productFormModalEl = document.getElementById('productFormModal');

function openProductFormModal() {
    document.getElementById('productFormTitle').textContent = "Add New Product";
    document.getElementById('formProductId').value = '';
    document.getElementById('productEntryForm').reset();
    productFormModalEl.classList.add('open');
}

function closeProductFormModal() {
    productFormModalEl.classList.remove('open');
}

function editProductModal(docId, id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('productFormTitle').textContent = "Edit Product";
    document.getElementById('formProductId').value = id;

    document.getElementById('prodNameEn').value = product.name_en || product.name;
    document.getElementById('prodNameTe').value = product.name_te || '';
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodUnit').value = product.unit;

    const priceNum = parseInt(product.price.replace(/[^\d]/g, ''));
    document.getElementById('prodPrice').value = priceNum;
    document.getElementById('prodImageUrl').value = product.image;
    document.getElementById('prodInStock').checked = product.inStock !== false;

    productFormModalEl.classList.add('open');
}

function saveProduct(e) {
    e.preventDefault();
    const idVal = document.getElementById('formProductId').value;
    const nameEn = document.getElementById('prodNameEn').value;
    const nameTe = document.getElementById('prodNameTe').value;
    const category = document.getElementById('prodCategory').value;
    const unit = document.getElementById('prodUnit').value;
    const price = parseInt(document.getElementById('prodPrice').value);
    const imageUrl = document.getElementById('prodImageUrl').value;
    const inStock = document.getElementById('prodInStock').checked;

    const formattedPrice = `₹${price}`;

    if (useFirebase && db) {
        if (idVal) {
            const id = parseInt(idVal);
            const product = products.find(p => p.id === id);
            if (product && product.docId) {
                db.collection("products").doc(product.docId).update({
                    name_en: nameEn,
                    name_te: nameTe,
                    name: nameEn,
                    category: category,
                    unit: unit,
                    price: formattedPrice,
                    image: imageUrl,
                    inStock: inStock
                }).then(() => {
                    closeProductFormModal();
                }).catch(err => console.error("Firebase dynamic update failed:", err));
            }
        } else {
            const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            const newDocId = `prod_${nextId}`;

            db.collection("products").doc(newDocId).set({
                id: nextId,
                name_en: nameEn,
                name_te: nameTe,
                name: nameEn,
                category: category,
                unit: unit,
                price: formattedPrice,
                image: imageUrl,
                inStock: inStock
            }).then(() => {
                closeProductFormModal();
            }).catch(err => console.error("Firebase dynamic creation failed:", err));
        }
    } else {
        // Local Fallback CRUD Updates
        if (idVal) {
            const id = parseInt(idVal);
            const productIndex = products.findIndex(p => p.id === id);
            if (productIndex !== -1) {
                products[productIndex] = {
                    ...products[productIndex],
                    name_en: nameEn,
                    name_te: nameTe,
                    name: nameEn,
                    category: category,
                    unit: unit,
                    price: formattedPrice,
                    image: imageUrl,
                    inStock: inStock
                };
                saveProductsLocal();
                closeProductFormModal();
            }
        } else {
            const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            products.push({
                id: nextId,
                name_en: nameEn,
                name_te: nameTe,
                name: nameEn,
                category: category,
                unit: unit,
                price: formattedPrice,
                image: imageUrl,
                inStock: inStock
            });
            saveProductsLocal();
            closeProductFormModal();
        }
    }
}

function deleteProduct(docId, id) {
    if (!confirm("Are you sure you want to delete this product from the dynamic inventory?")) return;

    if (useFirebase && db && docId) {
        db.collection("products").doc(docId).delete()
            .then(() => {
                console.log("Product successfully removed from Live database.");
            })
            .catch(err => console.error("Firestore document deletion failed:", err));
    } else {
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            saveProductsLocal();
        }
    }
}

// Attach Admin Panel Trigger Links
const adminLink = document.getElementById('adminLink');
const closeAdminLoginBtn = document.getElementById('closeAdminLoginBtn');
const closeAdminDashBtn = document.getElementById('closeAdminDashBtn');

if (adminLink) {
    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = 'admin';
    });
}

if (closeAdminLoginBtn) {
    closeAdminLoginBtn.addEventListener('click', closeAdminPortal);
}

if (closeAdminDashBtn) {
    closeAdminDashBtn.addEventListener('click', closeAdminPortal);
}


/* ==========================================================================
   Live Database Handshake Event Listeners
   ========================================================================== */

// Firestore live real-time query listener
if (useFirebase && db) {
    db.collection("products").orderBy("id", "asc").onSnapshot((snapshot) => {
        let dbProducts = [];
        snapshot.forEach((doc) => {
            dbProducts.push({
                docId: doc.id,
                ...doc.data()
            });
        });

        if (dbProducts.length > 0) {
            // Migrate legacy 'organic' category to 'vegetables'
            dbProducts.forEach(p => {
                if (p.category === 'organic') p.category = 'vegetables';
            });
            products = dbProducts;
            renderProducts();
            updateCartUI();
            if (isAdminLoggedIn()) {
                renderAdminProducts();
                updateAdminStats();
            }
        } else {
            // Seed base items to firestore
            seedDatabase();
        }
    }, (error) => {
        console.error("Firestore catalog snap update exception:", error);
    });
}

// Live Auth status state persistence listener
if (useFirebase && auth) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("Admin status check: Live Auth connected.");
            if (window.location.hash === '#admin') {
                openAdminDashboard();
            }
        } else {
            console.log("Admin status check: Guest status active.");
            if (window.location.hash === '#admin') {
                openAdminLogin();
            }
        }
    });
}


/* ==========================================================================
   Application Boot Initialization
   ========================================================================== */

loadCart();
applyLanguage();
updateCartUI();
renderProducts();
checkHashRoute();

// Force Hero Video to Autoplay overriding aggressive browser autoplay block policies
document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.play().catch(err => {
            console.warn("Browser autoplay restrictions prevented video playback. Retrying...", err);
        });
    }
});
