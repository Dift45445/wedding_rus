const config = {
  data: {
    // Main invitation title that appears on the page
    title: "Свадьба Алексея и Софии",
    // Opening message/description of the invitation
    description:
      "Мы женимся и будем рады разделить этот день с вами.",
    // Groom's name
    groomName: "Алексей",
    // Bride's name
    brideName: "София",
    // Groom's parents names
    parentGroom: "Родители Алексея",
    // Bride's parents names
    parentBride: "Родители Софии",
    // Wedding date (format: YYYY-MM-DD)
    date: "2026-06-03",
    // Google Maps link for location (short clickable link)
    maps_url: "https://yandex.com/maps/-/CPe7bAz8",
    // Google Maps embed code to display map on website
    // How to get: open Google Maps → select location → Share → Embed → copy link
    maps_embed:
      "https://yandex.ru/map-widget/v1/?ll=37.688032%2C55.563273&z=17&pt=37.688032%2C55.563273,pm2rdm",
    // Event time (free format, example: "10:00 - 12:00 WIB")
    time: "16:00–18:00",
    // Venue/building name
    location: "Банкетный зал",
    // Full address of the wedding venue
    address: "Адрес будет указан позже",
    // Image that appears when link is shared on social media
    ogImage: "/images/og-image.jpg",
    // Icon that appears in browser tab
    favicon: "/images/favicon.ico",
    // List of event agenda/schedule
    agenda: [
      {
        // First event name
        title: "Церемония",
        // Event date (format: YYYY-MM-DD)
        date: "2026-06-03",
        // Start time (format: HH:MM)
        startTime: "16:00",
        // End time (format: HH:MM)
        endTime: "17:00",
        // Event venue
        location: "Зал торжеств",
        // Full address
        address: "Адрес будет указан позже",
      },
      {
        // Second event name
        title: "Банкет",
        date: "2026-06-03",
        startTime: "18:00",
        endTime: "21:00",
        location: "Зал торжеств",
        address: "Адрес будет указан позже",
      }
      // You can add more agenda items with the same format
    ],

    // Detailed wedding program/timeline
    program: [
      {
        time: "10:50",
        title: "ЗАГС",
        description: "Торжественная регистрация брака",
        icon: "Scroll",
      },
      {
        time: "12:00",
        title: "Венчание",
        description: "Таинство венчания",
        icon: "Church",
      },
      {
        time: "14:00",
        title: "Фотосессия",
        description: "Прогулка и фотосессия с гостями",
        icon: "Camera",
      },
      {
        time: "16:00",
        title: "Банкет",
        description: "Праздничный ужин и поздравления",
        icon: "Utensils",
      },
    ],

    // Background music settings
    // audio: {
    //   // Music file (choose one or replace with your own file)
    //   src: "/audio/fulfilling-humming.mp3", // or /audio/nature-sound.mp3
    //   // Music title to display
    //   title: "Фоновая музыка", // or Nature Sound
    //   // Whether music plays automatically when website opens
    //   autoplay: true,
    //   // Whether music repeats continuously
    //   loop: true
    // },

    // List of bank accounts for digital envelope/gifts
    banks: []
  }
};

export default config;
