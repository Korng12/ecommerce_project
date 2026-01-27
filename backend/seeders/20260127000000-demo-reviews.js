"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "reviews",
      [
        // iPhone 16 ProMax
        {
          userId: 1, // admin
          productId: 1,
          rating: 5.0,
          comment:
            "Excellent phone! The camera quality is outstanding and the performance is top-notch. Worth every penny.",
          createdAt: new Date("2026-01-15"),
          updatedAt: new Date("2026-01-15"),
        },
        {
          userId: 2, // user
          productId: 1,
          rating: 3.8,
          comment:
            "Great device overall, but battery life is just average for me. Still very fast and smooth.",
          createdAt: new Date("2026-01-16"),
          updatedAt: new Date("2026-01-16"),
        },

        // Samsung Galaxy S25 Ultra
        {
          userId: 1, // admin
          productId: 2,
          rating: 4.6,
          comment:
            "Fantastic Android flagship. The display is gorgeous and the S-Pen is super useful.",
          createdAt: new Date("2026-01-14"),
          updatedAt: new Date("2026-01-14"),
        },
        {
          userId: 2, // user
          productId: 2,
          rating: 3.2,
          comment:
            "Really powerful, but the phone feels bulky and I had to tweak settings to get good battery life.",
          createdAt: new Date("2026-01-17"),
          updatedAt: new Date("2026-01-17"),
        },

        // Asus ROG Flow Z13
        {
          userId: 1, // admin
          productId: 3,
          rating: 4.4,
          comment:
            "Innovative and portable. Great performance for the size, but fans can get loud under load.",
          createdAt: new Date("2026-01-13"),
          updatedAt: new Date("2026-01-13"),
        },
        {
          userId: 2, // user
          productId: 3,
          rating: 3.0,
          comment:
            "Cool concept, but it runs hot during heavy gaming and battery life is quite short.",
          createdAt: new Date("2026-01-18"),
          updatedAt: new Date("2026-01-18"),
        },

        // Asus VivoBook S16 OLED
        {
          userId: 1, // admin
          productId: 4,
          rating: 4.2,
          comment:
            "Beautiful OLED display and light design. Great for media and basic editing.",
          createdAt: new Date("2026-01-12"),
          updatedAt: new Date("2026-01-12"),
        },
        {
          userId: 2, // user
          productId: 4,
          rating: 2.9,
          comment:
            "Screen is amazing but I expected better battery life. Also gets warm with multiple apps.",
          createdAt: new Date("2026-01-19"),
          updatedAt: new Date("2026-01-19"),
        },

        // MSI Cyborg 15
        {
          userId: 1, // admin
          productId: 5,
          rating: 4.1,
          comment:
            "Solid gaming laptop for the price. Runs most games well, but the chassis feels a bit plasticky.",
          createdAt: new Date("2026-01-11"),
          updatedAt: new Date("2026-01-11"),
        },
        {
          userId: 2, // user
          productId: 5,
          rating: 3.5,
          comment:
            "Good value, but the fan noise is noticeable and the screen could be brighter.",
          createdAt: new Date("2026-01-20"),
          updatedAt: new Date("2026-01-20"),
        },

        // Apple MacBook Pro 16
        {
          userId: 1, // admin
          productId: 6,
          rating: 4.9,
          comment:
            "Insanely fast for work and editing. Battery life is excellent and the display is top tier.",
          createdAt: new Date("2026-01-10"),
          updatedAt: new Date("2026-01-10"),
        },
        {
          userId: 2, // user
          productId: 6,
          rating: 3.9,
          comment:
            "Performance is amazing, but it's expensive and heavy to carry around daily.",
          createdAt: new Date("2026-01-21"),
          updatedAt: new Date("2026-01-21"),
        },

        // Asus ROG Azoth keyboard
        {
          userId: 1, // admin
          productId: 7,
          rating: 4.7,
          comment:
            "Premium feel and great typing. Wireless is stable and latency is excellent.",
          createdAt: new Date("2026-01-09"),
          updatedAt: new Date("2026-01-09"),
        },
        {
          userId: 2, // user
          productId: 7,
          rating: 2.5,
          comment:
            "Nice build quality but too pricey for what you get. Software was also a bit frustrating.",
          createdAt: new Date("2026-01-22"),
          updatedAt: new Date("2026-01-22"),
        },

        // MSI MAG Z890
        {
          userId: 1, // admin
          productId: 8,
          rating: 4.3,
          comment:
            "Good board overall. Plenty of ports and easy setup. BIOS is fairly straightforward.",
          createdAt: new Date("2026-01-08"),
          updatedAt: new Date("2026-01-08"),
        },
        {
          userId: 2, // user
          productId: 8,
          rating: 3.3,
          comment:
            "Works fine, but boot time was slower than expected and BIOS update took some effort.",
          createdAt: new Date("2026-01-23"),
          updatedAt: new Date("2026-01-23"),
        },

        // Asus ROG STRIX B760-A
        {
          userId: 1, // admin
          productId: 9,
          rating: 4.6,
          comment:
            "Great motherboard with strong features. Looks good and has solid connectivity.",
          createdAt: new Date("2026-01-07"),
          updatedAt: new Date("2026-01-07"),
        },
        {
          userId: 2, // user
          productId: 9,
          rating: 3.7,
          comment:
            "Good board, but the price is a bit high. Setup was fine after updating BIOS.",
          createdAt: new Date("2026-01-24"),
          updatedAt: new Date("2026-01-24"),
        },

        // RTX 5080
        {
          userId: 1, // admin
          productId: 10,
          rating: 4.8,
          comment:
            "Beast for 4K gaming. Runs cool and stable with excellent performance.",
          createdAt: new Date("2026-01-06"),
          updatedAt: new Date("2026-01-06"),
        },
        {
          userId: 2, // user
          productId: 10,
          rating: 3.4,
          comment:
            "Performance is great, but power draw is high and the card is huge—check your case size.",
          createdAt: new Date("2026-01-25"),
          updatedAt: new Date("2026-01-25"),
        },

        // RTX 4070 Ti
        {
          userId: 1, // admin
          productId: 11,
          rating: 4.2,
          comment:
            "Great for 1440p high refresh gaming. Quiet and efficient most of the time.",
          createdAt: new Date("2026-01-05"),
          updatedAt: new Date("2026-01-05"),
        },
        {
          userId: 2, // user
          productId: 11,
          rating: 3.1,
          comment:
            "Good GPU, but pricing could be better. Some games need tweaking for best temps.",
          createdAt: new Date("2026-01-26"),
          updatedAt: new Date("2026-01-26"),
        },

        // RTX 5090
        {
          userId: 1, // admin
          productId: 12,
          rating: 5.0,
          comment:
            "Insane performance for heavy workloads and high-end gaming. Absolutely top of the line.",
          createdAt: new Date("2026-01-04"),
          updatedAt: new Date("2026-01-04"),
        },
        {
          userId: 2, // user
          productId: 12,
          rating: 3.6,
          comment:
            "Powerful, but the price is hard to justify and it needs a strong PSU + good airflow.",
          createdAt: new Date("2026-01-27"),
          updatedAt: new Date("2026-01-27"),
        },

        // Samsung 990 Evo
        {
          userId: 1, // admin
          productId: 13,
          rating: 4.7,
          comment:
            "Fast SSD with excellent load times and smooth performance for large files.",
          createdAt: new Date("2026-01-03"),
          updatedAt: new Date("2026-01-03"),
        },
        {
          userId: 2, // user
          productId: 13,
          rating: 3.0,
          comment:
            "Speed is good, but it ran a bit warm in my system without a heatsink.",
          createdAt: new Date("2026-01-26"),
          updatedAt: new Date("2026-01-26"),
        },

        // Asus ROG Strix monitor
        {
          userId: 1, // admin
          productId: 14,
          rating: 4.4,
          comment:
            "Smooth refresh rate and great colors. Perfect for competitive gaming.",
          createdAt: new Date("2026-01-02"),
          updatedAt: new Date("2026-01-02"),
        },
        {
          userId: 2, // user
          productId: 14,
          rating: 3.2,
          comment:
            "Good panel, but I noticed some backlight bleed. Still enjoyable for gaming.",
          createdAt: new Date("2026-01-25"),
          updatedAt: new Date("2026-01-25"),
        },

        // MSI MAG 32CQ4
        {
          userId: 1, // admin
          productId: 15,
          rating: 4.1,
          comment:
            "Immersive curve and nice size for games and movies. Great value overall.",
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        },
        {
          userId: 2, // user
          productId: 15,
          rating: 3.0,
          comment:
            "The curve is nice, but colors needed calibration and the stand isn't very adjustable.",
          createdAt: new Date("2026-01-24"),
          updatedAt: new Date("2026-01-24"),
        },

        // Apple Magic Keyboard
        {
          userId: 1, // admin
          productId: 16,
          rating: 4.3,
          comment:
            "Great typing feel and very clean design. Works flawlessly with Mac.",
          createdAt: new Date("2025-12-31"),
          updatedAt: new Date("2025-12-31"),
        },
        {
          userId: 2, // user
          productId: 16,
          rating: 3.2,
          comment:
            "Nice keyboard, but overpriced. I wish it had backlight at this price.",
          createdAt: new Date("2026-01-23"),
          updatedAt: new Date("2026-01-23"),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("reviews", null, {});
  },
};
