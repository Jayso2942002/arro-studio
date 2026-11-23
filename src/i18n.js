// Interface text for the EN / MM toggle.
// Anything missing in "mm" automatically falls back to English.
// Please have a native speaker check the MM text before launch.
export const UI = {
  en: {
    home: 'Home',
    services: 'Services',
    work: 'Work',
    about: 'About',
    contact: 'Contact',
    startProject: 'Start a project',
    consultation: 'Free consultation',
    bookNow: 'Book now',
    projectsDelivered: 'Projects delivered',
    happyClients: 'Happy clients',
    experience: 'Experience',
    glassTitle: 'Websites & Dashboards',
    glassText:
      'We design in Figma, build in React and connect everything to a database you can manage yourself.',
    ourProjects: 'Our Projects',
    projectsSub: 'Thoughtful design. Purposeful development. A glimpse of what we create.',
    all: 'All',
    conceptProject: 'Concept project',
    project: 'Project',
    viewProject: 'View project',
    howTitle1: 'How we work.',
    howTitle2: 'From idea to launch.',
    howSub:
      'A clear, collaborative process from the first conversation to your final launch. We bring you into every step, so your website or app feels right, works beautifully, and is ready to grow.',
    leadership: 'Our leadership',
    leadershipSub:
      'The people behind your next big idea. A team built on creativity, collaboration, and a shared love for great digital experiences.',
    nextIdea: 'Your next big idea starts here',
    join1: 'Let’s join ARRO,',
    join2: '& build',
    gorgeous: 'gorgeous',
    join3: 'projects.',
    joinSub:
      'Your vision. Our creativity. Let’s create a digital experience that makes your brand impossible to ignore.',
    haveProject: 'Have a project in mind?',
    makeHappen: 'Let’s make it happen.',
    newsletter: 'Subscribe to our newsletter',
    emailAddress: 'Email address',
    newsletterNote: 'Fresh ideas, studio news, and design inspiration.',
    subscribed: 'Thanks! You are subscribed.',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send message',
    sent: 'Message sent. We will reply soon.',
    close: 'Close',
    failed: 'Something went wrong. Please try again.',
    contactTitle: 'Tell us about your project',
    noItems: 'Nothing to show yet.',
  },
  mm: {
    home: 'ပင်မစာမျက်နှာ',
    services: 'ဝန်ဆောင်မှုများ',
    work: 'ပရောဂျက်များ',
    about: 'ကျွန်ုပ်တို့အကြောင်း',
    contact: 'ဆက်သွယ်ရန်',
    startProject: 'ပရောဂျက် စတင်ရန်',
    consultation: 'အခမဲ့ ဆွေးနွေးမှု',
    bookNow: 'ယခု ရက်ချိန်းယူပါ',
    projectsDelivered: 'ပြီးစီးသော ပရောဂျက်များ',
    happyClients: 'ကျေနပ်သော ဖောက်သည်များ',
    experience: 'အတွေ့အကြုံ',
    ourProjects: 'ကျွန်ုပ်တို့၏ ပရောဂျက်များ',
    all: 'အားလုံး',
    leadership: 'ခေါင်းဆောင်အဖွဲ့',
    name: 'အမည်',
    email: 'အီးမေးလ်',
    message: 'မက်ဆေ့ချ်',
    emailAddress: 'အီးမေးလ်လိပ်စာ',
  },
}

export const t = (lang, key) => UI[lang]?.[key] || UI.en[key] || key

// Picks row.title_mm if it exists, otherwise row.title_en
export const pick = (row, field, lang) =>
  (row && (row[`${field}_${lang}`] || row[`${field}_en`])) || ''
